/*
  Warnings:

  - You are about to drop the column `companyId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `companies` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone_ddd` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_companyId_fkey";

-- DropIndex
DROP INDEX "addresses_companyId_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "phone",
ADD COLUMN     "addressId" INTEGER NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ALTER COLUMN "phone_ddd" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
