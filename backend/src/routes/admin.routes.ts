import { Router } from "express";
import { assignTeacherRole, createUser, deleteUser, listUsers } from "../controllers/admin.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { assignTeacherSchema, createUserSchema } from "../validators/admin.schemas";

const router = Router();

router.post(
  "/users",
  requireAuth(),
  requireRole("admin"),
  validate(createUserSchema),
  createUser
);

router.get(
  "/users",
  requireAuth(),
  requireRole("admin"),
  listUsers
);

router.delete(
  "/users/:id",
  requireAuth(),
  requireRole("admin"),
  deleteUser
);

router.post(
  "/users/assign-teacher",
  requireAuth(),
  requireRole("admin"),
  validate(assignTeacherSchema),
  assignTeacherRole
);

export default router;
