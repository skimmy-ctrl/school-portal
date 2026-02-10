import type { Request, Response, NextFunction } from "express";
import {
  createTimetable,
  createTimetableEntry,
  deleteTimetable,
  deleteTimetableEntry,
  getTimetableByIdForUser,
  listTimetablesForUser,
  updateTimetable,
  updateTimetableEntry,
} from "../services/timetable.service";
import { sendSuccess } from "../utils/apiResponse";
import { badRequest } from "../utils/errors";

function getAuthContext(req: Request) {
  if (!req.user) {
    throw badRequest("Missing user context");
  }

  return { userId: req.user.userId, role: req.user.role };
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = getAuthContext(req);
    const timetables = await listTimetablesForUser(role, userId);
    return sendSuccess(res, { timetables });
  } catch (error) {
    return next(error);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = getAuthContext(req);
    const timetableId = req.params.id;
    const timetable = await getTimetableByIdForUser(role, userId, timetableId);
    return sendSuccess(res, { timetable });
  } catch (error) {
    return next(error);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const timetable = await createTimetable(req.body);
    return sendSuccess(res, { timetable }, "Timetable created", 201);
  } catch (error) {
    return next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const timetableId = req.params.id;
    const timetable = await updateTimetable(timetableId, req.body);
    return sendSuccess(res, { timetable }, "Timetable updated");
  } catch (error) {
    return next(error);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const timetableId = req.params.id;
    await deleteTimetable(timetableId);
    return sendSuccess(res, { deleted: true }, "Timetable deleted");
  } catch (error) {
    return next(error);
  }
}

export async function createEntry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const timetableId = req.params.id;
    const entry = await createTimetableEntry(timetableId, req.body);
    return sendSuccess(res, { entry }, "Timetable entry created", 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateEntry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const timetableId = req.params.id;
    const entryId = Number(req.params.entryId);
    const entry = await updateTimetableEntry(timetableId, entryId, req.body);
    return sendSuccess(res, { entry }, "Timetable entry updated");
  } catch (error) {
    return next(error);
  }
}

export async function removeEntry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const timetableId = req.params.id;
    const entryId = Number(req.params.entryId);
    await deleteTimetableEntry(timetableId, entryId);
    return sendSuccess(res, { deleted: true }, "Timetable entry deleted");
  } catch (error) {
    return next(error);
  }
}
