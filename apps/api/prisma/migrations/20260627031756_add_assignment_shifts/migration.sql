/*
  Warnings:

  - You are about to alter the column `shiftEnd` on the `StageAssignment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - You are about to alter the column `shiftStart` on the `StageAssignment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.

*/
-- DropIndex
DROP INDEX "StageAssignment_tenantId_userId_stageId_startDate_key";

-- AlterTable
ALTER TABLE "StageAssignment" ALTER COLUMN "shiftEnd" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "shiftStart" SET DATA TYPE VARCHAR(5);

-- CreateIndex
CREATE INDEX "StageAssignment_userId_stageId_idx" ON "StageAssignment"("userId", "stageId");

-- CreateIndex
CREATE INDEX "StageAssignment_endDate_idx" ON "StageAssignment"("endDate");
