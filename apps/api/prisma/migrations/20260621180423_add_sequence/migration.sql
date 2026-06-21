/*
  Warnings:

  - Added the required column `sequenceNumber` to the `StageQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StageQueue" ADD COLUMN     "sequenceNumber" INTEGER NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;
