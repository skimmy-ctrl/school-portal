import { z } from "zod";

export const teacherSubjectStudentsSchema = z.object({
  params: z.object({
    subjectCode: z.string().trim().min(1).max(10),
  }),
});

export const teacherSubjectScoreSchema = z.object({
  params: z.object({
    subjectCode: z.string().trim().min(1).max(10),
    studentId: z.string().uuid(),
  }),
  body: z.object({
    test1: z.number().min(0).max(20).nullable().optional(),
    test2: z.number().min(0).max(20).nullable().optional(),
    exam: z.number().min(0).max(60).nullable().optional(),
  }),
});
