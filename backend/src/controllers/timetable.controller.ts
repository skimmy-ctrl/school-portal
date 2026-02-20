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

function getRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

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
    const timetableId = getRouteParam(req.params.id);
    if (!timetableId) {
      throw badRequest("Missing timetable id");
    }
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
    const timetableId = getRouteParam(req.params.id);
    if (!timetableId) {
      throw badRequest("Missing timetable id");
    }
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
    const timetableId = getRouteParam(req.params.id);
    if (!timetableId) {
      throw badRequest("Missing timetable id");
    }
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
    const timetableId = getRouteParam(req.params.id);
    if (!timetableId) {
      throw badRequest("Missing timetable id");
    }
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
    const timetableId = getRouteParam(req.params.id);
    if (!timetableId) {
      throw badRequest("Missing timetable id");
    }
    const entryIdRaw = getRouteParam(req.params.entryId);
    const entryId = Number(entryIdRaw);
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
    const timetableId = getRouteParam(req.params.id);
    if (!timetableId) {
      throw badRequest("Missing timetable id");
    }
    const entryIdRaw = getRouteParam(req.params.entryId);
    const entryId = Number(entryIdRaw);
    await deleteTimetableEntry(timetableId, entryId);
    return sendSuccess(res, { deleted: true }, "Timetable entry deleted");
  } catch (error) {
    return next(error);
  }
}
