import prisma from "../utils/prisma";
import { notFound, badRequest } from "../utils/errors";

export async function updateUserProfile(
  userId: number,
  data: {
    displayName?: string;
    fullName?: string;
    title?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
  }
) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    throw notFound("User not found");
  }

  if (data.displayName && data.displayName.trim().length === 0) {
    throw badRequest("Display name cannot be empty");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: data.displayName ?? existing.displayName,
      fullName: data.fullName ?? existing.fullName,
      title: data.title ?? existing.title,
      phone: data.phone ?? existing.phone,
      address: data.address ?? existing.address,
      avatarUrl: data.avatarUrl ?? existing.avatarUrl,
    },
    select: {
      id: true,
      email: true,
      role: { select: { name: true } },
      displayName: true,
      fullName: true,
      title: true,
      phone: true,
      address: true,
      avatarUrl: true,
    },
  });

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
