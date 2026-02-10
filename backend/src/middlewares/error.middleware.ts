import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/apiResponse";
import { AppError } from "../utils/errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return sendError(res, "Validation error", 400, err.flatten());
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  if (err instanceof Error) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return sendError(res, "Invalid or expired token", 401);
    }

    return sendError(res, err.message || "Internal server error", 500);
  }

  return sendError(res, "Internal server error", 500);
}
