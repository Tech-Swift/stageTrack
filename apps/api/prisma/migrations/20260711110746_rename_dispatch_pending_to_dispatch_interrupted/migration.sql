/*
  Warnings:

  - You are about to drop the column `dispatchPending` on the `StageQueue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StageQueue" DROP COLUMN "dispatchPending",
ADD COLUMN     "dispatchInterrupted" BOOLEAN NOT NULL DEFAULT false;
