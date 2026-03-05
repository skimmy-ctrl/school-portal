import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { badRequest } from "../utils/errors";
import {
  getTeacherAssignedSubjects,
  listStudentsForSubject,
  updateStudentSubjectScore,
} from "../services/teacher.service";

function getRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function getMySubjects(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw badRequest("Missing user context");
    }

    const subjects = await getTeacherAssignedSubjects(req.user.userId);
    return sendSuccess(res, { subjects });
  } catch (error) {
    return next(error);
  }
}

export async function getStudentsForSubject(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw badRequest("Missing user context");
    }

    const subjectCode = getRouteParam(req.params.subjectCode);
    if (!subjectCode) {
      throw badRequest("Missing subject code");
    }

    const students = await listStudentsForSubject(req.user.userId, subjectCode);
    return sendSuccess(res, { students });
  } catch (error) {
    return next(error);
  }
}

export async function updateStudentScore(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw badRequest("Missing user context");
    }

    const subjectCode = getRouteParam(req.params.subjectCode);
    const studentId = getRouteParam(req.params.studentId);
    if (!subjectCode || !studentId) {
      throw badRequest("Missing subject code or student id");
    }

    const score = await updateStudentSubjectScore(req.user.userId, subjectCode, studentId, {
      test1: req.body.test1 ?? null,
      test2: req.body.test2 ?? null,
      exam: req.body.exam ?? null,
    });

    return sendSuccess(res, { score }, "Score updated");
  } catch (error) {
    return next(error);
  }
}
