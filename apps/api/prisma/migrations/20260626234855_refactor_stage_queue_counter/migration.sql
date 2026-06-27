/*
  Warnings:

  - The primary key for the `StageQueueCounter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[stageId,date]` on the table `StageQueueCounter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `StageQueueCounter` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `StageQueueCounter` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "StageQueueCounter" DROP CONSTRAINT "StageQueueCounter_pkey",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "StageQueueCounter_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "StageQueueCounter_stageId_date_key" ON "StageQueueCounter"("stageId", "date");
