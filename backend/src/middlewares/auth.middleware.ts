import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { forbidden, unauthorized } from "../utils/errors";
import type { AuthJwtPayload, RoleName } from "../types/auth";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

export function requireAuth() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!ACCESS_SECRET) {
      return next(unauthorized("JWT_ACCESS_SECRET is not configured"));
    }

    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return next(unauthorized("Missing access token"));
    }

    const token = header.replace("Bearer ", "");

    try {
      const payload = jwt.verify(token, ACCESS_SECRET) as AuthJwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, isActive: true, role: { select: { name: true } } },
      });

      if (!user || !user.isActive) {
        return next(unauthorized("User is inactive"));
      }

      req.user = { userId: user.id, role: user.role.name as RoleName };
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireRole(...roles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(unauthorized("Missing access token"));
    }

    if (!roles.includes(req.user.role)) {
      return next(forbidden("Insufficient permissions"));
    }

    return next();
  };
}
