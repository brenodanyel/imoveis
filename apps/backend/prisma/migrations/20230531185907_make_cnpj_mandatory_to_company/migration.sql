/*
  Warnings:

  - Made the column `cnpj` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "cnpj" SET NOT NULL;
