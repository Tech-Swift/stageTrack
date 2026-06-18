/*
  Warnings:

  - You are about to drop the column `removedAt` on the `VehicleCrew` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VehicleCrew" DROP COLUMN "removedAt",
ADD COLUMN     "endedAt" TEXT,
ADD COLUMN     "endedById" TEXT;
