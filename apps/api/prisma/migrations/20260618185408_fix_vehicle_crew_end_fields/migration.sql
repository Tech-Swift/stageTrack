/*
  Warnings:

  - The `endedAt` column on the `VehicleCrew` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "VehicleCrew" DROP COLUMN "endedAt",
ADD COLUMN     "endedAt" TIMESTAMP(3),
ALTER COLUMN "endedById" DROP NOT NULL,
ALTER COLUMN "endedById" DROP DEFAULT,
ALTER COLUMN "endedById" SET DATA TYPE TEXT;
