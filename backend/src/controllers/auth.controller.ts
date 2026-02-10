import type { Request, Response, NextFunction } from "express";
import {
  getUserById,
  loginUser,
  refreshSession,
  registerUser,
  revokeRefreshToken,
} from "../services/auth.service";
import { sendSuccess } from "../utils/apiResponse";
import { badRequest } from "../utils/errors";

const isProduction = process.env.NODE_ENV === "production";

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const result = await registerUser(email, password);

    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    return sendSuccess(
      res,
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      "User registered",
      201
    );
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const result = await loginUser(email, password);

    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    return sendSuccess(res, {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenFromCookie = req.cookies?.refreshToken as string | undefined;
    const tokenFromBody = (req.body?.refreshToken as string | undefined) || undefined;
    const refreshToken = tokenFromCookie || tokenFromBody;

    if (!refreshToken) {
      throw badRequest("Refresh token required");
    }

    const result = await refreshSession(refreshToken);

    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    return sendSuccess(res, {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenFromCookie = req.cookies?.refreshToken as string | undefined;
    const tokenFromBody = (req.body?.refreshToken as string | undefined) || undefined;
    const refreshToken = tokenFromCookie || tokenFromBody;

    if (!refreshToken) {
      throw badRequest("Refresh token required");
    }

    await revokeRefreshToken(refreshToken);

    res.clearCookie("refreshToken", getCookieOptions());

    return sendSuccess(res, { loggedOut: true }, "Logged out");
  } catch (error) {
    return next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw badRequest("Missing user context");
    }

    const user = await getUserById(req.user.userId);
    return sendSuccess(res, { user });
  } catch (error) {
    return next(error);
  }
}
