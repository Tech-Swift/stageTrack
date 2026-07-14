-- AddForeignKey
ALTER TABLE "StageQueue" ADD CONSTRAINT "StageQueue_removedById_fkey" FOREIGN KEY ("removedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
