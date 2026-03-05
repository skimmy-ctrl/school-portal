-- This migration can run before StudentSubjectEnrollment is created on fresh databases.
-- Guard it so shadow database creation does not fail.
ALTER TABLE IF EXISTS "StudentSubjectEnrollment"
ALTER COLUMN "subjectCodes" DROP DEFAULT;
