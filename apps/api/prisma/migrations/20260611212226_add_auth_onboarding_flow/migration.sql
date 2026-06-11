/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `RegistrationRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RegistrationRequest_email_key" ON "RegistrationRequest"("email");
