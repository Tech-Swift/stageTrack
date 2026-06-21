-- CreateTable
CREATE TABLE "StageQueueCounter" (
    "stageId" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StageQueueCounter_pkey" PRIMARY KEY ("stageId")
);

-- AddForeignKey
ALTER TABLE "StageQueueCounter" ADD CONSTRAINT "StageQueueCounter_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
