/*
  Warnings:

  - You are about to drop the column `order` on the `Stage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[routeId,stageNumber]` on the table `Stage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[routeId,name]` on the table `Stage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stageNumber` to the `Stage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Stage_routeId_order_key";

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "order",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stageNumber" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Stage_tenantId_idx" ON "Stage"("tenantId");

-- CreateIndex
CREATE INDEX "Stage_routeId_idx" ON "Stage"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_routeId_stageNumber_key" ON "Stage"("routeId", "stageNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_routeId_name_key" ON "Stage"("routeId", "name");
