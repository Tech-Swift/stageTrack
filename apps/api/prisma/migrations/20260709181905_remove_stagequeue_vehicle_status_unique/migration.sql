-- DropIndex
DROP INDEX "StageQueue_vehicleId_status_key";

-- CreateIndex
CREATE INDEX "StageQueue_vehicleId_idx" ON "StageQueue"("vehicleId");
