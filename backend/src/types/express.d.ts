import type { AuthRequestUser } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthRequestUser;
    }
  }
}

export {};
