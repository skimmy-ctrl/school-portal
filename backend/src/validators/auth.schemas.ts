import { z } from "zod";

const roleEnum = z.enum(["admin", "teacher", "student"]);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1).optional(),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1).optional(),
  }),
});
