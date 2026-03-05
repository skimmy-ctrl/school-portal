import { Router } from "express";
import {
  create,
  getById,
  getMyRecord,
  getMyScores,
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
import {
  getMySubjectEnrollmentSchema,
  updateMySubjectEnrollmentSchema,
} from "../validators/subjectEnrollment.schemas";
import {
  getMyEnrollment,
  updateMyEnrollment,
} from "../controllers/subjectEnrollment.controller";

const router = Router();

router.get("/", requireAuth(), requireRole("admin", "teacher"), list);
router.get(
  "/me",
  requireAuth(),
  requireRole("student"),
  getMyRecord
);
router.get(
  "/me/scores",
  requireAuth(),
  requireRole("student"),
  getMyScores
);
router.get(
  "/me/enrollment",
  requireAuth(),
  requireRole("student"),
  validate(getMySubjectEnrollmentSchema),
  getMyEnrollment
);
router.put(
  "/me/enrollment",
  requireAuth(),
  requireRole("student"),
  validate(updateMySubjectEnrollmentSchema),
  updateMyEnrollment
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
