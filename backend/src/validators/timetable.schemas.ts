import { z } from "zod";

const idParam = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

const entryIdParam = z.object({
  params: z.object({
    id: z.string().uuid(),
    entryId: z.coerce.number().int().positive(),
  }),
});

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:MM");

const dayEnum = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

export const createTimetableSchema = z.object({
  body: z.object({
    classId: z.string().uuid(),
    name: z.string().min(1).max(120),
    isActive: z.boolean().optional(),
  }),
});

export const updateTimetableSchema = idParam.merge(
  z.object({
    body: z
      .object({
        name: z.string().min(1).max(120).optional(),
        isActive: z.boolean().optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  })
);

export const getTimetableSchema = idParam;
export const deleteTimetableSchema = idParam;

export const createEntrySchema = entryIdParam
  .omit({ params: true })
  .merge(
    z.object({
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
      body: z.object({
        dayOfWeek: dayEnum,
        startTime: timeString,
        endTime: timeString,
        subject: z.string().min(1).max(120),
        room: z.string().min(1).max(50).optional(),
        teacherId: z.coerce.number().int().positive(),
      }),
    })
  );

export const updateEntrySchema = entryIdParam.merge(
  z.object({
    body: z
      .object({
        dayOfWeek: dayEnum.optional(),
        startTime: timeString.optional(),
        endTime: timeString.optional(),
        subject: z.string().min(1).max(120).optional(),
        room: z.string().min(1).max(50).optional(),
        teacherId: z.coerce.number().int().positive().optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  })
);

export const deleteEntrySchema = entryIdParam;
