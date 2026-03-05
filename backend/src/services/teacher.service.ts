import prisma from "../utils/prisma";
import { ALL_SUBJECT_CODES, ALL_SUBJECT_OPTIONS } from "../constants/subjects";
import { badRequest, forbidden, notFound } from "../utils/errors";

function normalizeSubjectCode(subjectCode: string) {
  return subjectCode.trim().toUpperCase();
}

export async function getTeacherAssignedSubjects(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: { select: { name: true } }, teachingSubjectCodes: true },
  });

  if (!user) {
    throw notFound("Teacher not found");
  }

  if (user.role.name !== "teacher") {
    throw forbidden("User is not a teacher");
  }

  const subjectCodes = user.teachingSubjectCodes || [];
  const optionsByCode = new Map(ALL_SUBJECT_OPTIONS.map((subject) => [subject.code, subject]));

  return subjectCodes.map((code) => ({
    code,
    name: optionsByCode.get(code)?.name || code,
  }));
}

export async function listStudentsForSubject(userId: number, subjectCode: string) {
  const normalizedCode = normalizeSubjectCode(subjectCode);

  if (!ALL_SUBJECT_CODES.has(normalizedCode)) {
    throw badRequest("Invalid subject code");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: { select: { name: true } }, teachingSubjectCodes: true },
  });

  if (!user) {
    throw notFound("Teacher not found");
  }

  if (user.role.name !== "teacher") {
    throw forbidden("User is not a teacher");
  }

  if (!user.teachingSubjectCodes.includes(normalizedCode)) {
    throw forbidden("Subject is not assigned to this teacher");
  }

  const students = await prisma.student.findMany({
    where: {
      isActive: true,
      subjectEnrollments: {
        some: {
          subjectCodes: {
            has: normalizedCode,
          },
        },
      },
    },
    include: {
      class: true,
      user: { select: { id: true, email: true } },
      subjectScores: {
        where: { subjectCode: normalizedCode },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return students.map((student) => ({
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    userId: student.userId,
    class: student.class
      ? { id: student.class.id, name: student.class.name, gradeLevel: student.class.gradeLevel }
      : null,
    gradeLevel: student.gradeLevel,
    score: student.subjectScores[0]
      ? {
          test1: student.subjectScores[0].test1 ?? null,
          test2: student.subjectScores[0].test2 ?? null,
          exam: student.subjectScores[0].exam ?? null,
          updatedAt: student.subjectScores[0].updatedAt,
        }
      : null,
  }));
}

export async function updateStudentSubjectScore(
  userId: number,
  subjectCode: string,
  studentId: string,
  scores: { test1?: number | null; test2?: number | null; exam?: number | null }
) {
  const normalizedCode = normalizeSubjectCode(subjectCode);

  if (!ALL_SUBJECT_CODES.has(normalizedCode)) {
    throw badRequest("Invalid subject code");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: { select: { name: true } }, teachingSubjectCodes: true },
  });

  if (!user) {
    throw notFound("Teacher not found");
  }

  if (user.role.name !== "teacher") {
    throw forbidden("User is not a teacher");
  }

  if (!user.teachingSubjectCodes.includes(normalizedCode)) {
    throw forbidden("Subject is not assigned to this teacher");
  }

  const enrollment = await prisma.studentSubjectEnrollment.findFirst({
    where: {
      studentId,
      subjectCodes: {
        has: normalizedCode,
      },
    },
  });

  if (!enrollment) {
    throw forbidden("Student is not enrolled in this subject");
  }

  const updated = await prisma.studentSubjectScore.upsert({
    where: {
      studentId_subjectCode: {
        studentId,
        subjectCode: normalizedCode,
      },
    },
    create: {
      studentId,
      subjectCode: normalizedCode,
      test1: scores.test1 ?? null,
      test2: scores.test2 ?? null,
      exam: scores.exam ?? null,
      updatedById: userId,
    },
    update: {
      test1: scores.test1 ?? null,
      test2: scores.test2 ?? null,
      exam: scores.exam ?? null,
      updatedById: userId,
    },
  });

  return {
    studentId: updated.studentId,
    subjectCode: updated.subjectCode,
    test1: updated.test1 ?? null,
    test2: updated.test2 ?? null,
    exam: updated.exam ?? null,
    updatedAt: updated.updatedAt,
  };
}
