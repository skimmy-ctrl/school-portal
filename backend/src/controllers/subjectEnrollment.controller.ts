import type { NextFunction, Request, Response } from "express";
import { badRequest } from "../utils/errors";
import { sendSuccess } from "../utils/apiResponse";
import {
  getMySubjectEnrollment,
  updateMySubjectEnrollment,
} from "../services/subjectEnrollment.service";

export async function getMyEnrollment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw badRequest("Missing user context");
    }

    const classLevelQuery =
      typeof req.query.classLevel === "string" ? req.query.classLevel : undefined;

    const enrollment = await getMySubjectEnrollment(
      req.user.userId,
      classLevelQuery
    );

    return sendSuccess(res, { enrollment });
  } catch (error) {
    return next(error);
  }
}

export async function updateMyEnrollment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw badRequest("Missing user context");
    }

    const enrollment = await updateMySubjectEnrollment(req.user.userId, {
      classLevel: req.body.classLevel,
      subjectCodes: req.body.subjectCodes,
    });

    return sendSuccess(res, { enrollment }, "Enrollment updated");
  } catch (error) {
    return next(error);
  }
}
