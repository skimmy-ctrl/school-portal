import { Router } from "express";
import {
  assignTeacherSubjects,
  assignTeacherRole,
  createUser,
  deleteUser,
  listUsers,
  promoteStudentClass,
} from "../controllers/admin.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  assignTeacherSchema,
  assignTeacherSubjectsSchema,
  createUserSchema,
  promoteStudentClassSchema,
} from "../validators/admin.schemas";

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

router.patch(
  "/teachers/:id/subjects",
  requireAuth(),
  requireRole("admin"),
  validate(assignTeacherSubjectsSchema),
  assignTeacherSubjects
);

router.patch(
  "/students/:studentId/class",
  requireAuth(),
  requireRole("admin"),
  validate(promoteStudentClassSchema),
  promoteStudentClass
);

export default router;
