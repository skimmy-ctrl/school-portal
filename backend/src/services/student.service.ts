import prisma from "../utils/prisma";
import { badRequest, notFound } from "../utils/errors";

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
