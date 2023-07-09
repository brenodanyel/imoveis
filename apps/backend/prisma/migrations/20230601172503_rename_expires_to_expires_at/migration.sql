/*
  Warnings:

  - You are about to drop the column `expires` on the `companies_plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies_plans" DROP COLUMN "expires",
ADD COLUMN     "expiresAt" TIMESTAMP(3);
