import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { badRequest, unauthorized } from "../utils/errors";
import type { AuthJwtPayload, RoleName } from "../types/auth";
import { emitUserCreated } from "../realtime/adminEvents";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const ACCESS_TTL = (process.env.JWT_ACCESS_TTL || "15m") as jwt.SignOptions["expiresIn"];
const REFRESH_TTL_DAYS = Number(process.env.JWT_REFRESH_TTL_DAYS || 30);
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

function ensureSecrets() {
  if (!ACCESS_SECRET) {
    throw badRequest("JWT_ACCESS_SECRET is not configured");
  }
}

function signAccessToken(payload: AuthJwtPayload) {
  ensureSecrets();
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("base64url");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function refreshExpiry() {
  const ttlDays = Number.isFinite(REFRESH_TTL_DAYS) ? REFRESH_TTL_DAYS : 30;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);
  return expiresAt;
}

export async function registerUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) {
    throw badRequest("User already exists");
  }

  const role = await prisma.role.findUnique({ where: { name: "student" } });
  if (!role) {
    throw badRequest("Role 'student' is not configured");
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

  const accessToken = signAccessToken({
    userId: user.id,
  });

  const refreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: refreshExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role.name,
      displayName: user.displayName,
      fullName: user.fullName,
      title: user.title,
      phone: user.phone,
      address: user.address,
      avatarUrl: user.avatarUrl,
    },
  };
}

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    throw unauthorized("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw unauthorized("Invalid credentials");
  }

  const accessToken = signAccessToken({
    userId: user.id,
  });

  const refreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: refreshExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role.name,
      displayName: user.displayName,
      fullName: user.fullName,
      title: user.title,
      phone: user.phone,
      address: user.address,
      avatarUrl: user.avatarUrl,
    },
  };
}

export async function refreshSession(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: { include: { role: true } } },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw unauthorized("Invalid refresh token");
  }

  if (!stored.user.isActive) {
    throw unauthorized("User is inactive");
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const nextRefreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(nextRefreshToken),
      userId: stored.userId,
      expiresAt: refreshExpiry(),
    },
  });

  const accessToken = signAccessToken({
    userId: stored.userId,
  });

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    user: {
      id: stored.user.id,
      email: stored.user.email,
      role: stored.user.role.name,
      displayName: stored.user.displayName,
      fullName: stored.user.fullName,
      title: stored.user.title,
      phone: stored.user.phone,
      address: stored.user.address,
      avatarUrl: stored.user.avatarUrl,
    },
  };
}

export async function revokeRefreshToken(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw unauthorized("Invalid refresh token");
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      fullName: true,
      title: true,
      phone: true,
      address: true,
      avatarUrl: true,
      role: { select: { name: true } },
    },
  });

  if (!user) {
    throw unauthorized("User not found");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role.name,
    displayName: user.displayName,
    fullName: user.fullName,
    title: user.title,
    phone: user.phone,
    address: user.address,
    avatarUrl: user.avatarUrl,
  };
}
