import prisma from "../utils/prisma";
import type { RoleName } from "../types/auth";

const DEFAULT_ROLES: RoleName[] = ["admin", "teacher", "student"];

export async function ensureDefaultRoles() {
  await prisma.role.createMany({
    data: DEFAULT_ROLES.map((name) => ({ name })),
    skipDuplicates: true,
  });
}

export async function ensureRole(roleName: RoleName) {
  return prisma.role.upsert({
    where: { name: roleName },
    update: {},
    create: { name: roleName },
  });
}
