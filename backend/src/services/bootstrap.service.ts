import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { ensureRole } from "./role.service";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

export async function bootstrapAdminUser() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return;
  }

  const adminRole = await ensureRole("admin");
  const existingUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        passwordHash,
        roleId: adminRole.id,
        isActive: true,
      },
    });
    console.log("Admin bootstrap: created admin user");
    return;
  }

  if (existingUser.roleId !== adminRole.id || !existingUser.isActive) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        roleId: adminRole.id,
        isActive: true,
      },
    });
  }

  console.log("Admin bootstrap: admin user already exists");
}
