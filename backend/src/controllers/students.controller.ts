import type { Request, Response, NextFunction } from "express";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudentByUserId,
  listStudents,
  updateStudent,
} from "../services/student.service";
import { sendSuccess } from "../utils/apiResponse";
import { badRequest } from "../utils/errors";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const students = await listStudents();
    return sendSuccess(res, { students });
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
    const id = req.params.id;
    const student = await getStudentById(id);
    return sendSuccess(res, { student });
  } catch (error) {
    return next(error);
  }
}

export async function getMyRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw badRequest("Missing user context");
    }

    const student = await getStudentByUserId(req.user.userId);
    return sendSuccess(res, { student });
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
    const student = await createStudent(req.body);
    return sendSuccess(res, { student }, "Student created", 201);
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
    const id = req.params.id;
    const student = await updateStudent(id, req.body);
    return sendSuccess(res, { student }, "Student updated");
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
    const id = req.params.id;
    await deleteStudent(id);
    return sendSuccess(res, { deleted: true }, "Student deleted");
  } catch (error) {
    return next(error);
  }
}
