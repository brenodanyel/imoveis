/*
  Warnings:

  - Made the column `paidAt` on table `companies_plans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expiresAt` on table `companies_plans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies_plans" ALTER COLUMN "paidAt" SET NOT NULL,
ALTER COLUMN "paidAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "expiresAt" SET NOT NULL;
