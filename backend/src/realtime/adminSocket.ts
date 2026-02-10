import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { onUserCreated } from "./adminEvents";
import type { AuthJwtPayload } from "../types/auth";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

type Subscription = {
  role: "student" | "teacher" | "admin";
};

export function attachAdminSocket(server: import("http").Server) {
  const wss = new WebSocketServer({ server, path: "/ws/admin" });

  wss.on("connection", async (socket, req) => {
    try {
      const url = new URL(req.url || "", "http://localhost");
      const token = url.searchParams.get("token");
      if (!token) {
        socket.close(1008, "Missing token");
        return;
      }

      const payload = jwt.verify(token, ACCESS_SECRET) as AuthJwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, isActive: true, role: { select: { name: true } } },
      });

      if (!user || !user.isActive || user.role.name !== "admin") {
        socket.close(1008, "Unauthorized");
        return;
      }

      let subscription: Subscription | null = null;

      const unsubscribe = onUserCreated((event) => {
        if (!subscription) return;
        if (event.role !== subscription.role) return;
        if (socket.readyState !== WebSocket.OPEN) return;
        socket.send(
          JSON.stringify({
            type: "userCreated",
            payload: {
              id: event.id,
              email: event.email,
              displayName: event.displayName,
              fullName: event.fullName,
              title: event.title,
              phone: event.phone,
              address: event.address,
              avatarUrl: event.avatarUrl,
              isActive: event.isActive,
              createdAt: event.createdAt,
            },
          })
        );
      });

      socket.on("message", async (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          if (parsed.type === "subscribe" && parsed.role) {
            if (parsed.role !== "student" && parsed.role !== "teacher" && parsed.role !== "admin") {
              socket.send(JSON.stringify({ type: "error", message: "Invalid role" }));
              return;
            }

            subscription = { role: parsed.role };
            const roleRecord = await prisma.role.findUnique({ where: { name: parsed.role } });
            if (!roleRecord) {
              socket.send(JSON.stringify({ type: "error", message: "Role not found" }));
              return;
            }

            const users = await prisma.user.findMany({
              where: { roleId: roleRecord.id },
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                email: true,
                displayName: true,
                fullName: true,
                title: true,
                phone: true,
                address: true,
                avatarUrl: true,
                isActive: true,
                createdAt: true,
              },
            });

            socket.send(JSON.stringify({ type: "users", payload: users }));
          }
        } catch (_error) {
          socket.send(JSON.stringify({ type: "error", message: "Invalid message" }));
        }
      });

      socket.on("close", () => {
        unsubscribe();
      });
    } catch (_error) {
      socket.close(1011, "Server error");
    }
  });

  return wss;
}
