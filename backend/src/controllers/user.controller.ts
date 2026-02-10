import type { Request, Response, NextFunction } from "express";
import { updateUserProfile } from "../services/user.service";
import { sendSuccess } from "../utils/apiResponse";
import { badRequest } from "../utils/errors";

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw badRequest("Missing user context");
    }

    const displayName = req.body?.displayName as string | undefined;
    const fullName = req.body?.fullName as string | undefined;
    const title = req.body?.title as string | undefined;
    const phone = req.body?.phone as string | undefined;
    const address = req.body?.address as string | undefined;
    const file = req.file as Express.Multer.File | undefined;

    const avatarUrl = file ? `/uploads/avatars/${file.filename}` : undefined;

    const user = await updateUserProfile(req.user.userId, {
      displayName,
      fullName,
      title,
      phone,
      address,
      avatarUrl,
    });

    return sendSuccess(res, { user }, "Profile updated");
  } catch (error) {
    return next(error);
  }
}
