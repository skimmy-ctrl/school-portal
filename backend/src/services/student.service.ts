import prisma from "../utils/prisma";
import { badRequest, notFound } from "../utils/errors";
import { DEFAULT_STUDENT_CLASS } from "../constants/classes";
import { getOrCreateClassByStandardName } from "./class.service";

export async function listStudents() {
  return prisma.student.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { user: { select: { id: true, email: true } }, class: true },
  });
}

export async function getStudentById(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true } }, class: true },
  });
  if (!student) {
    throw notFound("Student not found");
  }
  return student;
}

export async function getStudentByUserId(userId: number) {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { user: { select: { id: true, email: true } }, class: true },
  });
  if (!student) {
    throw notFound("Student not found");
  }
  return student;
}

export async function getStudentScoresByUserId(userId: number) {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!student) {
    throw notFound("Student not found");
  }

  const scores = await prisma.studentSubjectScore.findMany({
    where: { studentId: student.id },
    orderBy: { updatedAt: "desc" },
  });

  return scores.map((score) => ({
    studentId: score.studentId,
    subjectCode: score.subjectCode,
    test1: score.test1 ?? null,
    test2: score.test2 ?? null,
    exam: score.exam ?? null,
    updatedAt: score.updatedAt,
  }));
}

function deriveNamesFromEmail(email: string) {
  const local = email.split("@")[0] || "student";
  const parts = local
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  const firstName = capitalize(parts[0] || "Student");
  const lastName = capitalize(parts[1] || "User");
  return { firstName, lastName };
}

export async function ensureStudentProfileForUser(userId: number, email: string) {
  const existing = await prisma.student.findUnique({
    where: { userId },
    include: { user: { select: { id: true, email: true } }, class: true },
  });
  if (existing) {
    return existing;
  }

  const classRecord = await getOrCreateClassByStandardName(DEFAULT_STUDENT_CLASS);
  const { firstName, lastName } = deriveNamesFromEmail(email);

  return prisma.student.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      userId,
      classId: classRecord.id,
      gradeLevel: classRecord.name,
      isActive: true,
    },
    include: { user: { select: { id: true, email: true } }, class: true },
  });
}

export async function createStudent(data: {
  firstName: string;
  lastName: string;
  userId: number;
  classId: string;
  gradeLevel?: string;
  isActive?: boolean;
}) {
  const classRecord = await prisma.class.findUnique({
    where: { id: data.classId },
  });
  if (!classRecord) {
    throw badRequest("Class not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    include: { role: true },
  });

  if (!user) {
    throw badRequest("User not found");
  }

  if (user.role.name !== "student") {
    throw badRequest("User role must be student");
  }

  const existingStudent = await prisma.student.findUnique({
    where: { userId: data.userId },
  });
  if (existingStudent) {
    throw badRequest("Student record already exists for this user");
  }

  const email = user.email.toLowerCase();

  return prisma.student.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email,
      userId: data.userId,
      classId: data.classId,
      gradeLevel: data.gradeLevel,
      isActive: data.isActive ?? true,
    },
    include: { user: { select: { id: true, email: true } }, class: true },
  });
}

export async function updateStudent(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    gradeLevel?: string;
    isActive?: boolean;
    classId?: string;
  }
) {
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) {
    throw notFound("Student not found");
  }

  if (data.classId) {
    const classRecord = await prisma.class.findUnique({
      where: { id: data.classId },
    });
    if (!classRecord) {
      throw badRequest("Class not found");
    }
  }

  return prisma.student.update({
    where: { id },
    data,
    include: { user: { select: { id: true, email: true } }, class: true },
  });
}

export async function deleteStudent(id: string) {
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) {
    throw notFound("Student not found");
  }

  await prisma.student.delete({ where: { id } });
}
