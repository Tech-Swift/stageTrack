-- AlterEnum
ALTER TYPE "VehicleStatus" ADD VALUE 'INSPECTION_SCHEDULED';

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "inspectionById" TEXT,
ADD COLUMN     "inspectionDate" TIMESTAMP(3),
ADD COLUMN     "inspectionNotes" TEXT;
