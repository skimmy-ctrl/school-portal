import prisma from "../utils/prisma";
import { badRequest, notFound, unauthorized } from "../utils/errors";
import type { RoleName } from "../types/auth";

async function getTeacherByUserId(userId: number) {
  return prisma.teacher.findUnique({ where: { userId } });
}

async function getStudentByUserId(userId: number) {
  return prisma.student.findUnique({ where: { userId } });
}

export async function listTimetablesForUser(role: RoleName, userId: number) {
  if (role === "admin") {
    return prisma.timetable.findMany({
      include: {
        class: true,
        entries: {
          include: { teacher: { include: { user: { select: { id: true, email: true } } } } },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }

  if (role === "teacher") {
    const teacher = await getTeacherByUserId(userId);
    if (!teacher) {
      throw unauthorized("Teacher profile not found");
    }

    return prisma.timetable.findMany({
      where: { entries: { some: { teacherId: teacher.id } } },
      include: {
        class: true,
        entries: {
          where: { teacherId: teacher.id },
          include: { teacher: { include: { user: { select: { id: true, email: true } } } } },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }

  const student = await getStudentByUserId(userId);
  if (!student) {
    throw unauthorized("Student profile not found");
  }

  return prisma.timetable.findMany({
    where: { classId: student.classId },
    include: {
      class: true,
      entries: {
        include: { teacher: { include: { user: { select: { id: true, email: true } } } } },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function getTimetableByIdForUser(
  role: RoleName,
  userId: number,
  timetableId: string
) {
  if (role === "admin") {
    const timetable = await prisma.timetable.findUnique({
      where: { id: timetableId },
      include: {
        class: true,
        entries: {
          include: { teacher: { include: { user: { select: { id: true, email: true } } } } },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
      },
    });

    if (!timetable) {
      throw notFound("Timetable not found");
    }

    return timetable;
  }

  if (role === "teacher") {
    const teacher = await getTeacherByUserId(userId);
    if (!teacher) {
      throw unauthorized("Teacher profile not found");
    }

    const timetable = await prisma.timetable.findFirst({
      where: { id: timetableId, entries: { some: { teacherId: teacher.id } } },
      include: {
        class: true,
        entries: {
          where: { teacherId: teacher.id },
          include: { teacher: { include: { user: { select: { id: true, email: true } } } } },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
      },
    });

    if (!timetable) {
      throw notFound("Timetable not found");
    }

    return timetable;
  }

  const student = await getStudentByUserId(userId);
  if (!student) {
    throw unauthorized("Student profile not found");
  }

  const timetable = await prisma.timetable.findFirst({
    where: { id: timetableId, classId: student.classId },
    include: {
      class: true,
      entries: {
        include: { teacher: { include: { user: { select: { id: true, email: true } } } } },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });

  if (!timetable) {
    throw notFound("Timetable not found");
  }

  return timetable;
}

export async function createTimetable(data: {
  classId: string;
  name: string;
  isActive?: boolean;
}) {
  const classRecord = await prisma.class.findUnique({
    where: { id: data.classId },
  });

  if (!classRecord) {
    throw badRequest("Class not found");
  }

  return prisma.timetable.create({
    data: {
      classId: data.classId,
      name: data.name,
      isActive: data.isActive ?? true,
    },
    include: { class: true, entries: true },
  });
}

export async function updateTimetable(
  timetableId: string,
  data: { name?: string; isActive?: boolean }
) {
  const existing = await prisma.timetable.findUnique({
    where: { id: timetableId },
  });

  if (!existing) {
    throw notFound("Timetable not found");
  }

  return prisma.timetable.update({
    where: { id: timetableId },
    data,
    include: { class: true, entries: true },
  });
}

export async function deleteTimetable(timetableId: string) {
  const existing = await prisma.timetable.findUnique({
    where: { id: timetableId },
  });

  if (!existing) {
    throw notFound("Timetable not found");
  }

  await prisma.timetable.delete({ where: { id: timetableId } });
}

export async function createTimetableEntry(
  timetableId: string,
  data: {
    dayOfWeek:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
    startTime: string;
    endTime: string;
    subject: string;
    room?: string;
    teacherId: number;
  }
) {
  const timetable = await prisma.timetable.findUnique({
    where: { id: timetableId },
  });
  if (!timetable) {
    throw notFound("Timetable not found");
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: data.teacherId },
  });
  if (!teacher) {
    throw badRequest("Teacher not found");
  }

  if (data.startTime >= data.endTime) {
    throw badRequest("Start time must be before end time");
  }

  return prisma.timetableEntry.create({
    data: {
      timetableId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      subject: data.subject,
      room: data.room,
      teacherId: data.teacherId,
    },
    include: { teacher: { include: { user: { select: { id: true, email: true } } } } },
  });
}

export async function updateTimetableEntry(
  timetableId: string,
  entryId: number,
  data: {
    dayOfWeek?:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
    startTime?: string;
    endTime?: string;
    subject?: string;
    room?: string;
    teacherId?: number;
  }
) {
  const existing = await prisma.timetableEntry.findFirst({
    where: { id: entryId, timetableId },
  });
  if (!existing) {
    throw notFound("Timetable entry not found");
  }

  if (data.teacherId) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: data.teacherId },
    });
    if (!teacher) {
      throw badRequest("Teacher not found");
    }
  }

  const startTime = data.startTime ?? existing.startTime;
  const endTime = data.endTime ?? existing.endTime;
  if (startTime >= endTime) {
    throw badRequest("Start time must be before end time");
  }

  return prisma.timetableEntry.update({
    where: { id: entryId },
    data,
    include: { teacher: { include: { user: { select: { id: true, email: true } } } } },
  });
}

export async function deleteTimetableEntry(
  timetableId: string,
  entryId: number
) {
  const existing = await prisma.timetableEntry.findFirst({
    where: { id: entryId, timetableId },
  });
  if (!existing) {
    throw notFound("Timetable entry not found");
  }

  await prisma.timetableEntry.delete({ where: { id: entryId } });
}
