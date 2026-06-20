/*
  Warnings:

  - You are about to drop the column `status` on the `Arrival` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[queueEntryId]` on the table `Arrival` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('QUEUED', 'SKIPPED', 'REMOVED');

-- AlterTable
ALTER TABLE "Arrival" DROP COLUMN "status",
ADD COLUMN     "queueEntryId" TEXT;

-- DropEnum
DROP TYPE "ArrivalStatus";

-- CreateTable
CREATE TABLE "StageQueue" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "arrivalId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'QUEUED',
    "enqueuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispatchedAt" TIMESTAMP(3),

    CONSTRAINT "StageQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StageQueue_arrivalId_key" ON "StageQueue"("arrivalId");

-- CreateIndex
CREATE INDEX "StageQueue_stageId_position_idx" ON "StageQueue"("stageId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Arrival_queueEntryId_key" ON "Arrival"("queueEntryId");

-- AddForeignKey
ALTER TABLE "StageQueue" ADD CONSTRAINT "StageQueue_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageQueue" ADD CONSTRAINT "StageQueue_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageQueue" ADD CONSTRAINT "StageQueue_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "Arrival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
