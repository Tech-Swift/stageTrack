/*
  Warnings:

  - The values [REMOVED] on the enum `CrewAssignmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CrewAssignmentStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
ALTER TABLE "public"."VehicleCrew" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "VehicleCrew" ALTER COLUMN "status" TYPE "CrewAssignmentStatus_new" USING ("status"::text::"CrewAssignmentStatus_new");
ALTER TYPE "CrewAssignmentStatus" RENAME TO "CrewAssignmentStatus_old";
ALTER TYPE "CrewAssignmentStatus_new" RENAME TO "CrewAssignmentStatus";
DROP TYPE "public"."CrewAssignmentStatus_old";
ALTER TABLE "VehicleCrew" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
