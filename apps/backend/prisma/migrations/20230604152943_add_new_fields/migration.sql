/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "deletedAt",
ADD COLUMN     "active" BOOLEAN DEFAULT true;
