/*
  Warnings:

  - Added the required column `planId` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Made the column `addressId` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "planId" INTEGER NOT NULL,
ALTER COLUMN "addressId" SET NOT NULL;

-- CreateTable
CREATE TABLE "plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "limit_users" INTEGER NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_plans" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "paidAt" TIMESTAMP(3),
    "expires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_planId_fkey" FOREIGN KEY ("planId") REFERENCES "company_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_plans" ADD CONSTRAINT "company_plans_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
