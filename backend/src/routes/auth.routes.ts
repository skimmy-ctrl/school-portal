import { Router } from "express";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  logoutSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../validators/auth.schemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", validate(logoutSchema), logout);
router.get("/me", requireAuth(), me);

export default router;
