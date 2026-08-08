-- CreateEnum
CREATE TYPE "TenantApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "TenantApplication" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "saccoName" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "preferredCode" TEXT,
    "county" TEXT NOT NULL,
    "town" TEXT,
    "physicalAddress" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactPosition" TEXT,
    "status" "TenantApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "rejectionReason" TEXT,
    "approvedTenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantApplication_referenceNumber_key" ON "TenantApplication"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TenantApplication_approvedTenantId_key" ON "TenantApplication"("approvedTenantId");

-- AddForeignKey
ALTER TABLE "TenantApplication" ADD CONSTRAINT "TenantApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantApplication" ADD CONSTRAINT "TenantApplication_approvedTenantId_fkey" FOREIGN KEY ("approvedTenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
