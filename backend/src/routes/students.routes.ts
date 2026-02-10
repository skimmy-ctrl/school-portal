import { Router } from "express";
import {
  create,
  getById,
  getMyRecord,
  list,
  remove,
  update,
} from "../controllers/students.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createStudentSchema,
  deleteStudentSchema,
  getStudentSchema,
  updateStudentSchema,
} from "../validators/student.schemas";

const router = Router();

router.get("/", requireAuth(), requireRole("admin", "teacher"), list);
router.get(
  "/me",
  requireAuth(),
  requireRole("student"),
  getMyRecord
);
router.get(
  "/:id",
  requireAuth(),
  requireRole("admin", "teacher"),
  validate(getStudentSchema),
  getById
);

router.post(
  "/",
  requireAuth(),
  requireRole("admin"),
  validate(createStudentSchema),
  create
);

router.patch(
  "/:id",
  requireAuth(),
  requireRole("admin"),
  validate(updateStudentSchema),
  update
);

router.delete(
  "/:id",
  requireAuth(),
  requireRole("admin"),
  validate(deleteStudentSchema),
  remove
);

export default router;
