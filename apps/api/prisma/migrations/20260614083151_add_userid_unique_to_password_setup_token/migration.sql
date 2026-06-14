/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PasswordSetupToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordSetupToken_userId_key" ON "PasswordSetupToken"("userId");
