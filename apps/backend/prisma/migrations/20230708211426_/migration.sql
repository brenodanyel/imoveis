/*
  Warnings:

  - Added the required column `thumbnail` to the `anuncios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "anuncios" ADD COLUMN     "thumbnail" TEXT NOT NULL;
