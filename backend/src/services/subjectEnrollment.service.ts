import { SubjectClassLevel } from "@prisma/client";
import prisma from "../utils/prisma";
import { badRequest, notFound } from "../utils/errors";
import {
  MAX_SUBJECTS,
  SUBJECTS_BY_CLASS_LEVEL,
  type SubjectClassLevelApi,
} from "../constants/subjects";
import { classNameToGradeLevel, isStandardClassName, normalizeClassName } from "../constants/classes";
import { ensureStudentProfileForUser } from "./student.service";

interface EnrollmentPayload {
  classLevel: SubjectClassLevelApi;
  subjectCodes: string[];
}

function toPrismaClassLevel(value: SubjectClassLevelApi): SubjectClassLevel {
  return value === "senior" ? SubjectClassLevel.SENIOR : SubjectClassLevel.JUNIOR;
}

function fromPrismaClassLevel(value: SubjectClassLevel): SubjectClassLevelApi {
  return value === SubjectClassLevel.SENIOR ? "senior" : "junior";
}

async function findStudentByUserId(userId: number) {
  let student = await prisma.student.findUnique({
    where: { userId },
    include: { class: true },
  });

  if (!student) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: { select: { name: true } } },
    });
    if (!user || user.role.name !== "student") {
      throw notFound("Student not found");
    }

    student = await ensureStudentProfileForUser(user.id, user.email);
  }

  return student;
}

function resolveClassLevelFromClassName(className: string): SubjectClassLevelApi {
  const normalized = normalizeClassName(className);
  if (!isStandardClassName(normalized)) {
    throw badRequest("Student class is invalid");
  }

  return classNameToGradeLevel(normalized);
}

function sanitizeSubjectCodes(classLevel: SubjectClassLevelApi, subjectCodes: string[]) {
  const normalizedCodes = Array.from(
    new Set(subjectCodes.map((code) => code.trim().toUpperCase()).filter(Boolean))
  );

  if (normalizedCodes.length > MAX_SUBJECTS) {
    throw badRequest(`A maximum of ${MAX_SUBJECTS} subjects can be enrolled`);
  }

  const allowedCodes = new Set(
    SUBJECTS_BY_CLASS_LEVEL[classLevel].map((subject) => subject.code)
  );

  const invalidCodes = normalizedCodes.filter((code) => !allowedCodes.has(code));
  if (invalidCodes.length > 0) {
    throw badRequest("One or more subject codes are invalid for this class level", {
      invalidCodes,
    });
  }

  return normalizedCodes;
}

export async function getMySubjectEnrollment(
  userId: number,
  _classLevelQuery?: string
) {
  const student = await findStudentByUserId(userId);
  const className = student.class?.name || student.gradeLevel;
  if (!className) {
    throw badRequest("Student class is not assigned");
  }
  const classLevel = resolveClassLevelFromClassName(className);

  const enrollment = await prisma.studentSubjectEnrollment.findUnique({
    where: {
      studentId_classLevel: {
        studentId: student.id,
        classLevel: toPrismaClassLevel(classLevel),
      },
    },
  });

  return {
    classLevel,
    className: normalizeClassName(className),
    subjectCodes: enrollment?.subjectCodes ?? [],
    maxSubjects: MAX_SUBJECTS,
    availableSubjects: SUBJECTS_BY_CLASS_LEVEL[classLevel],
  };
}

export async function updateMySubjectEnrollment(
  userId: number,
  payload: EnrollmentPayload
) {
  const student = await findStudentByUserId(userId);
  const className = student.class?.name || student.gradeLevel;
  if (!className) {
    throw badRequest("Student class is not assigned");
  }
  const classLevel = resolveClassLevelFromClassName(className);
  if (payload.classLevel !== classLevel) {
    throw badRequest("Selected subjects do not match your class level");
  }
  const subjectCodes = sanitizeSubjectCodes(classLevel, payload.subjectCodes);

  const updated = await prisma.studentSubjectEnrollment.upsert({
    where: {
      studentId_classLevel: {
        studentId: student.id,
        classLevel: toPrismaClassLevel(classLevel),
      },
    },
    create: {
      studentId: student.id,
      classLevel: toPrismaClassLevel(classLevel),
      subjectCodes,
    },
    update: {
      subjectCodes,
    },
  });

  return {
    classLevel: fromPrismaClassLevel(updated.classLevel),
    className: normalizeClassName(className),
    subjectCodes: updated.subjectCodes,
    maxSubjects: MAX_SUBJECTS,
    availableSubjects: SUBJECTS_BY_CLASS_LEVEL[classLevel],
  };
}
