/*
  Warnings:

  - A unique constraint covering the columns `[vehicleId,status]` on the table `StageQueue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StageQueue_vehicleId_status_key" ON "StageQueue"("vehicleId", "status");
