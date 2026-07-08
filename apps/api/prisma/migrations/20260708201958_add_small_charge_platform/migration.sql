/*
  Warnings:

  - You are about to drop the column `paid` on the `PlatformCharge` table. All the data in the column will be lost.
  - Added the required column `expectedRevenue` to the `PlatformCharge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlatformChargeStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'WAIVED');

-- AlterTable
ALTER TABLE "PlatformCharge" DROP COLUMN "paid",
ADD COLUMN     "expectedRevenue" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "status" "PlatformChargeStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "PlatformCharge_tenantId_idx" ON "PlatformCharge"("tenantId");

-- CreateIndex
CREATE INDEX "PlatformCharge_status_idx" ON "PlatformCharge"("status");
