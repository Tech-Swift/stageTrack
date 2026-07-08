/*
  Warnings:

  - You are about to drop the column `fare` on the `Dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `paymentConfirmed` on the `Dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `stageFee` on the `Dispatch` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[arrivalId]` on the table `Dispatch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[queueId]` on the table `Dispatch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `arrivalId` to the `Dispatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `busFare` to the `Dispatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Dispatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marshalId` to the `Dispatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queueId` to the `Dispatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Dispatch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DispatchStatus" AS ENUM ('DISPATCHED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Dispatch" DROP COLUMN "fare",
DROP COLUMN "paymentConfirmed",
DROP COLUMN "stageFee",
ADD COLUMN     "arrivalId" TEXT NOT NULL,
ADD COLUMN     "busFare" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "marshalId" TEXT NOT NULL,
ADD COLUMN     "queueId" TEXT NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "saccoFee" DECIMAL(10,2),
ADD COLUMN     "status" "DispatchStatus" NOT NULL DEFAULT 'DISPATCHED',
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dispatch_arrivalId_key" ON "Dispatch"("arrivalId");

-- CreateIndex
CREATE UNIQUE INDEX "Dispatch_queueId_key" ON "Dispatch"("queueId");

-- CreateIndex
CREATE INDEX "Dispatch_tenantId_idx" ON "Dispatch"("tenantId");

-- CreateIndex
CREATE INDEX "Dispatch_stageId_idx" ON "Dispatch"("stageId");

-- CreateIndex
CREATE INDEX "Dispatch_routeId_idx" ON "Dispatch"("routeId");

-- CreateIndex
CREATE INDEX "Dispatch_vehicleId_idx" ON "Dispatch"("vehicleId");

-- CreateIndex
CREATE INDEX "Dispatch_dispatchTime_idx" ON "Dispatch"("dispatchTime");

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "Arrival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "StageQueue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_marshalId_fkey" FOREIGN KEY ("marshalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
