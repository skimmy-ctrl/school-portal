import { z } from "zod";

const idParam = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

const baseStudent = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  userId: z.coerce.number().int().positive(),
  classId: z.string().uuid(),
  gradeLevel: z.string().min(1).max(50).optional(),
  isActive: z.boolean().optional(),
});

export const createStudentSchema = z.object({
  body: baseStudent,
});

export const updateStudentSchema = idParam.merge(
  z.object({
    body: baseStudent
      .omit({ userId: true })
      .partial()
      .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
  })
);

export const getStudentSchema = idParam;
export const deleteStudentSchema = idParam;
