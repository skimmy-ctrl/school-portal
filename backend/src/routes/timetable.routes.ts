import { Router } from "express";
import {
  create,
  createEntry,
  getById,
  list,
  remove,
  removeEntry,
  update,
  updateEntry,
} from "../controllers/timetable.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createEntrySchema,
  createTimetableSchema,
  deleteEntrySchema,
  deleteTimetableSchema,
  getTimetableSchema,
  updateEntrySchema,
  updateTimetableSchema,
} from "../validators/timetable.schemas";

const router = Router();

router.get(
  "/",
  requireAuth(),
  requireRole("admin", "teacher", "student"),
  list
);

router.get(
  "/:id",
  requireAuth(),
  requireRole("admin", "teacher", "student"),
  validate(getTimetableSchema),
  getById
);

router.post(
  "/",
  requireAuth(),
  requireRole("admin"),
  validate(createTimetableSchema),
  create
);

router.patch(
  "/:id",
  requireAuth(),
  requireRole("admin"),
  validate(updateTimetableSchema),
  update
);

router.delete(
  "/:id",
  requireAuth(),
  requireRole("admin"),
  validate(deleteTimetableSchema),
  remove
);

router.post(
  "/:id/entries",
  requireAuth(),
  requireRole("admin"),
  validate(createEntrySchema),
  createEntry
);

router.patch(
  "/:id/entries/:entryId",
  requireAuth(),
  requireRole("admin"),
  validate(updateEntrySchema),
  updateEntry
);

router.delete(
  "/:id/entries/:entryId",
  requireAuth(),
  requireRole("admin"),
  validate(deleteEntrySchema),
  removeEntry
);

export default router;
