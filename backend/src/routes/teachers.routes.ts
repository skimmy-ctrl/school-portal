import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { getMySubjects, getStudentsForSubject, updateStudentScore } from "../controllers/teacher.controller";
import { teacherSubjectScoreSchema, teacherSubjectStudentsSchema } from "../validators/teacher.schemas";

const router = Router();

router.get("/me/subjects", requireAuth(), requireRole("teacher"), getMySubjects);
router.get(
  "/me/subjects/:subjectCode/students",
  requireAuth(),
  requireRole("teacher"),
  validate(teacherSubjectStudentsSchema),
  getStudentsForSubject
);

router.patch(
  "/me/subjects/:subjectCode/students/:studentId/score",
  requireAuth(),
  requireRole("teacher"),
  validate(teacherSubjectScoreSchema),
  updateStudentScore
);

export default router;
