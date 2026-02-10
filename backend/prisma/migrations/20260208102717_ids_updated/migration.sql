/*
  Warnings:

  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Timetable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Class` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `classId` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Timetable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `classId` on the `Timetable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timetableId` on the `TimetableEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "Timetable" DROP CONSTRAINT "Timetable_classId_fkey";

-- DropForeignKey
ALTER TABLE "TimetableEntry" DROP CONSTRAINT "TimetableEntry_timetableId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "classId",
ADD COLUMN     "classId" UUID NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Timetable" DROP CONSTRAINT "Timetable_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "classId",
ADD COLUMN     "classId" UUID NOT NULL,
ADD CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TimetableEntry" DROP COLUMN "timetableId",
ADD COLUMN     "timetableId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Student_classId_idx" ON "Student"("classId");

-- CreateIndex
CREATE INDEX "Timetable_classId_idx" ON "Timetable"("classId");

-- CreateIndex
CREATE INDEX "TimetableEntry_timetableId_idx" ON "TimetableEntry"("timetableId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableEntry" ADD CONSTRAINT "TimetableEntry_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
