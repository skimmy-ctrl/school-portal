export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new AppError(message, 400, details);

export const unauthorized = (message = "Unauthorized") =>
  new AppError(message, 401);

export const forbidden = (message = "Forbidden") => new AppError(message, 403);

export const notFound = (message = "Not found") => new AppError(message, 404);
