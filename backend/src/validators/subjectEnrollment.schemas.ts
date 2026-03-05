import { z } from "zod";

const classLevelEnum = z.enum(["junior", "senior"]);

export const updateMySubjectEnrollmentSchema = z.object({
  body: z.object({
    classLevel: classLevelEnum,
    subjectCodes: z.array(z.string().trim().min(1)).max(11),
  }),
});

export const getMySubjectEnrollmentSchema = z.object({
  query: z
    .object({
      classLevel: classLevelEnum.optional(),
    })
    .optional(),
});
