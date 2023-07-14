/*
  Warnings:

  - Added the required column `companyId` to the `anuncios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "anuncios" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
