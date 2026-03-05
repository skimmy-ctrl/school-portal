-- AlterTable
ALTER TABLE "User"
ADD COLUMN "teachingSubjectCodes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
