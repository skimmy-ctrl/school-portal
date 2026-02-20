import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { badRequest, notFound } from "../utils/errors";
import type { RoleName } from "../types/auth";
import { emitUserCreated } from "../realtime/adminEvents";

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

export async function createUserAsAdmin(
  email: string,
  password: string,
  roleName: Exclude<RoleName, "admin">
) {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) {
    throw badRequest("User already exists");
  }

  const role = await prisma.role.findUnique({ where: { name: roleName } });
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

  return {
    id: user.id,
    email: user.email,
    role: user.role.name,
  };
}

export async function listUsersByRole(roleName: RoleName) {
  const role = await prisma.role.findUnique({ where: { name: roleName } });
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
      isActive: true,
      createdAt: true,
    },
  });

  return users;
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

  const teacherRole = await prisma.role.findUnique({ where: { name: "teacher" } });
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
