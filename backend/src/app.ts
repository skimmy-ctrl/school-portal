import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/students.routes";
import timetableRoutes from "./routes/timetable.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin.split(","),
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
