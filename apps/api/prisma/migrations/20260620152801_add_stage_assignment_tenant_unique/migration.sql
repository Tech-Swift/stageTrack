/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,userId,stageId]` on the table `StageAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StageAssignment_userId_stageId_key";

-- CreateIndex
CREATE UNIQUE INDEX "StageAssignment_tenantId_userId_stageId_key" ON "StageAssignment"("tenantId", "userId", "stageId");
