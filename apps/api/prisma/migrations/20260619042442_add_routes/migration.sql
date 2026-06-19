/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,name]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimatedDistance" DOUBLE PRECISION,
ADD COLUMN     "estimatedDuration" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Route_tenantId_name_key" ON "Route"("tenantId", "name");
