/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,userId,stageId,startDate]` on the table `StageAssignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `startDate` to the `StageAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "StageAssignment_tenantId_userId_stageId_key";

-- AlterTable
ALTER TABLE "StageAssignment" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StageAssignment_tenantId_userId_stageId_startDate_key" ON "StageAssignment"("tenantId", "userId", "stageId", "startDate");
