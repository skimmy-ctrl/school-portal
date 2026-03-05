-- CreateEnum
CREATE TYPE "SubjectClassLevel" AS ENUM ('JUNIOR', 'SENIOR');

-- CreateTable
CREATE TABLE "StudentSubjectEnrollment" (
    "id" SERIAL NOT NULL,
    "studentId" UUID NOT NULL,
    "classLevel" "SubjectClassLevel" NOT NULL,
    "subjectCodes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentSubjectEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentSubjectEnrollment_studentId_classLevel_key" ON "StudentSubjectEnrollment"("studentId", "classLevel");

-- CreateIndex
CREATE INDEX "StudentSubjectEnrollment_studentId_idx" ON "StudentSubjectEnrollment"("studentId");

-- AddForeignKey
ALTER TABLE "StudentSubjectEnrollment" ADD CONSTRAINT "StudentSubjectEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
