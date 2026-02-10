import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(1).max(80).optional(),
    fullName: z.string().min(1).max(120).optional(),
    title: z.string().min(1).max(80).optional(),
    phone: z.string().min(5).max(30).optional(),
    address: z.string().min(1).max(200).optional(),
  }),
});
