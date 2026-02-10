import { Router } from "express";
import { updateProfile } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { avatarUpload } from "../middlewares/upload.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema } from "../validators/user.schemas";

const router = Router();

router.patch(
  "/me",
  requireAuth(),
  avatarUpload.single("avatar"),
  validate(updateProfileSchema),
  updateProfile
);

export default router;
