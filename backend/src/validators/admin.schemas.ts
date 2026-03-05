import { z } from "zod";

const roleEnum = z.enum(["teacher", "student"]);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: passwordSchema,
    role: roleEnum,
  }),
});

export const assignTeacherSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const promoteStudentClassSchema = z.object({
  params: z.object({
    studentId: z.string().uuid(),
  }),
  body: z.object({
    className: z.enum(["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"]),
  }),
});

export const assignTeacherSubjectsSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    subjectCodes: z.array(z.string().trim().toUpperCase().min(1)).max(20),
  }),
});
