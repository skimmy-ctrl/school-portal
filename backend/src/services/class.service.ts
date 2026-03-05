import prisma from "../utils/prisma";
import {
  STANDARD_CLASSES,
  classNameToGradeLevel,
  isStandardClassName,
  normalizeClassName,
  type StandardClassName,
} from "../constants/classes";
import { badRequest } from "../utils/errors";

export async function ensureStandardClasses() {
  await prisma.class.createMany({
    data: STANDARD_CLASSES.map((name) => ({
      name,
      gradeLevel: classNameToGradeLevel(name),
      isActive: true,
    })),
    skipDuplicates: true,
  });
}

export async function getOrCreateClassByName(className: string) {
  const normalized = normalizeClassName(className);
  if (!isStandardClassName(normalized)) {
    throw badRequest("Invalid class name");
  }

  return prisma.class.upsert({
    where: { name: normalized },
    update: {
      gradeLevel: classNameToGradeLevel(normalized),
      isActive: true,
    },
    create: {
      name: normalized,
      gradeLevel: classNameToGradeLevel(normalized),
      isActive: true,
    },
  });
}

export async function getOrCreateClassByStandardName(className: StandardClassName) {
  return getOrCreateClassByName(className);
}
