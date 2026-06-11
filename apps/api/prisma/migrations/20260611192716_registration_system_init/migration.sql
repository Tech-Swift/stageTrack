/*
  Warnings:

  - You are about to drop the column `logbookUrl` on the `RegistrationRequest` table. All the data in the column will be lost.
  - Added the required column `email` to the `RegistrationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegistrationRequest" DROP COLUMN "logbookUrl",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "goodConductUrl" TEXT,
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "vehicleLogbookUrl" TEXT;
