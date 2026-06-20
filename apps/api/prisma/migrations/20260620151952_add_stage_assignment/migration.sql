-- CreateTable
CREATE TABLE "StageAssignment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StageAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StageAssignment_tenantId_idx" ON "StageAssignment"("tenantId");

-- CreateIndex
CREATE INDEX "StageAssignment_userId_idx" ON "StageAssignment"("userId");

-- CreateIndex
CREATE INDEX "StageAssignment_stageId_idx" ON "StageAssignment"("stageId");

-- CreateIndex
CREATE UNIQUE INDEX "StageAssignment_userId_stageId_key" ON "StageAssignment"("userId", "stageId");

-- AddForeignKey
ALTER TABLE "StageAssignment" ADD CONSTRAINT "StageAssignment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageAssignment" ADD CONSTRAINT "StageAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageAssignment" ADD CONSTRAINT "StageAssignment_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
