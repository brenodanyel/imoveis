/*
  Warnings:

  - You are about to drop the column `addressId` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId]` on the table `company_plans` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `company_plans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_addressId_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_planId_fkey";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "addressId",
DROP COLUMN "planId";

-- AlterTable
ALTER TABLE "company_plans" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "addresses_companyId_key" ON "addresses"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "company_plans_companyId_key" ON "company_plans"("companyId");

-- AddForeignKey
ALTER TABLE "company_plans" ADD CONSTRAINT "company_plans_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
