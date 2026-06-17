-- CreateEnum
CREATE TYPE "CrewAssignmentStatus" AS ENUM ('ACTIVE', 'REMOVED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "VehicleCrew" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "conductorId" TEXT,
    "status" "CrewAssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),
    "assignedById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleCrew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleCrew_tenantId_idx" ON "VehicleCrew"("tenantId");

-- CreateIndex
CREATE INDEX "VehicleCrew_vehicleId_idx" ON "VehicleCrew"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleCrew_driverId_idx" ON "VehicleCrew"("driverId");

-- CreateIndex
CREATE INDEX "VehicleCrew_conductorId_idx" ON "VehicleCrew"("conductorId");

-- CreateIndex
CREATE INDEX "VehicleCrew_status_idx" ON "VehicleCrew"("status");

-- AddForeignKey
ALTER TABLE "VehicleCrew" ADD CONSTRAINT "VehicleCrew_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCrew" ADD CONSTRAINT "VehicleCrew_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCrew" ADD CONSTRAINT "VehicleCrew_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCrew" ADD CONSTRAINT "VehicleCrew_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
