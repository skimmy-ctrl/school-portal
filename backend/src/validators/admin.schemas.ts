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
