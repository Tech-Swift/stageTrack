/*
  Warnings:

  - The `endedById` column on the `VehicleCrew` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "VehicleCrew" DROP COLUMN "endedById",
ADD COLUMN     "endedById" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
