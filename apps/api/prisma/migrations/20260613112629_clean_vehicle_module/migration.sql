/*
  Warnings:

  - You are about to drop the column `isActive` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `plateSuffix` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleOwnerId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `VehicleOwner` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `VehicleOwner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `VehicleOwner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plateNumber` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `VehicleOwner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_vehicleOwnerId_fkey";

-- DropIndex
DROP INDEX "Vehicle_plateSuffix_idx";

-- DropIndex
DROP INDEX "Vehicle_registrationNumber_key";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "isActive",
DROP COLUMN "plateSuffix",
DROP COLUMN "vehicleOwnerId",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "plateNumber" TEXT NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "VehicleStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
ALTER COLUMN "capacity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VehicleOwner" DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOwner_userId_key" ON "VehicleOwner"("userId");

-- AddForeignKey
ALTER TABLE "VehicleOwner" ADD CONSTRAINT "VehicleOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "VehicleOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
