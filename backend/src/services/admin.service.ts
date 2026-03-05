import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { badRequest, notFound } from "../utils/errors";
import type { RoleName } from "../types/auth";
import { emitUserCreated } from "../realtime/adminEvents";
import { ensureRole } from "./role.service";
import { ensureStandardClasses, getOrCreateClassByName } from "./class.service";
import { ensureStudentProfileForUser } from "./student.service";
import { isStandardClassName, normalizeClassName } from "../constants/classes";
import { ALL_SUBJECT_CODES } from "../constants/subjects";

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

export async function createUserAsAdmin(
  email: string,
  password: string,
  roleName: Exclude<RoleName, "admin">
) {
  await ensureStandardClasses();

  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) {
    throw badRequest("User already exists");
  }

  const role = await ensureRole(roleName);
  if (!role) {
    throw badRequest("Invalid role");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      roleId: role.id,
    },
    include: { role: true },
  });

  emitUserCreated({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    fullName: user.fullName,
    title: user.title,
    phone: user.phone,
    address: user.address,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    createdAt: user.createdAt,
    role: user.role.name as RoleName,
  });

  if (roleName === "student") {
    await ensureStudentProfileForUser(user.id, user.email);
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role.name,
  };
}

export async function listUsersByRole(roleName: RoleName) {
  const role = await ensureRole(roleName);
  if (!role) {
    throw badRequest("Invalid role");
  }

  const users = await prisma.user.findMany({
    where: { roleId: role.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      fullName: true,
      title: true,
      phone: true,
      address: true,
      avatarUrl: true,
      teachingSubjectCodes: true,
      isActive: true,
      createdAt: true,
      ...(roleName === "student"
        ? {
            student: {
              select: {
                id: true,
                class: { select: { id: true, name: true, gradeLevel: true } },
              },
            },
          }
        : {}),
    },
  });

  return users;
}

function sanitizeTeacherSubjectCodes(subjectCodes: string[]) {
  const normalizedCodes = Array.from(
    new Set(subjectCodes.map((code) => code.trim().toUpperCase()).filter(Boolean))
  );

  const invalidCodes = normalizedCodes.filter((code) => !ALL_SUBJECT_CODES.has(code));
  if (invalidCodes.length > 0) {
    throw badRequest("One or more subject codes are invalid", { invalidCodes });
  }

  return normalizedCodes;
}

export async function promoteStudentClassByStudentId(studentId: string, className: string) {
  const normalizedClassName = normalizeClassName(className);
  if (!isStandardClassName(normalizedClassName)) {
    throw badRequest("Invalid class name");
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });
  if (!student) {
    throw notFound("Student not found");
  }

  const classRecord = await getOrCreateClassByName(normalizedClassName);

  return prisma.student.update({
    where: { id: studentId },
    data: {
      classId: classRecord.id,
      gradeLevel: classRecord.name,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          fullName: true,
          avatarUrl: true,
          isActive: true,
          createdAt: true,
        },
      },
      class: { select: { id: true, name: true, gradeLevel: true } },
    },
  });
}

export async function deleteUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    throw notFound("User not found");
  }

  if (user.role.name === "admin") {
    throw badRequest("Admin users must be removed via manual database action");
  }

  await prisma.$transaction([
    prisma.refreshToken.deleteMany({ where: { userId } }),
    prisma.student.deleteMany({ where: { userId } }),
    prisma.teacher.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
}

export async function assignTeacherRoleByEmail(email: string) {
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { role: true },
  });

  if (!user) {
    throw notFound("User not found");
  }

  if (user.role.name === "admin") {
    throw badRequest("Admin role cannot be changed");
  }

  if (user.role.name === "teacher") {
    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };
  }

  const teacherRole = await ensureRole("teacher");
  if (!teacherRole) {
    throw badRequest("Role 'teacher' is not configured");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { roleId: teacherRole.id },
  });

  return {
    id: user.id,
    email: user.email,
    role: "teacher",
  };
}

export async function assignSubjectsToTeacherByUserId(userId: number, subjectCodes: string[]) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    throw notFound("User not found");
  }

  if (user.role.name !== "teacher") {
    throw badRequest("Subjects can only be assigned to teacher users");
  }

  const normalizedCodes = sanitizeTeacherSubjectCodes(subjectCodes);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      teachingSubjectCodes: normalizedCodes,
    },
    select: {
      id: true,
      email: true,
      teachingSubjectCodes: true,
    },
  });

  return updatedUser;
}
