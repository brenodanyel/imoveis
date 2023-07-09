/*
  Warnings:

  - You are about to drop the `company_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "company_addresses" DROP CONSTRAINT "company_addresses_companyId_fkey";

-- DropForeignKey
ALTER TABLE "company_plans" DROP CONSTRAINT "company_plans_companyId_fkey";

-- DropForeignKey
ALTER TABLE "company_plans" DROP CONSTRAINT "company_plans_planId_fkey";

-- DropTable
DROP TABLE "company_addresses";

-- DropTable
DROP TABLE "company_plans";

-- CreateTable
CREATE TABLE "companies_plans" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "paidAt" TIMESTAMP(3),
    "expires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "companies_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies_addresses" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "companies_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_plans_companyId_key" ON "companies_plans"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_addresses_companyId_key" ON "companies_addresses"("companyId");

-- AddForeignKey
ALTER TABLE "companies_plans" ADD CONSTRAINT "companies_plans_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies_plans" ADD CONSTRAINT "companies_plans_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies_addresses" ADD CONSTRAINT "companies_addresses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
