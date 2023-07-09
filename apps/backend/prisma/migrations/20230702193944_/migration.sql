/*
  Warnings:

  - You are about to drop the column `anuncioId` on the `anuncios_categorias` table. All the data in the column will be lost.
  - Added the required column `anuncioCategoriaId` to the `anuncios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "anuncios_categorias" DROP CONSTRAINT "anuncios_categorias_anuncioId_fkey";

-- AlterTable
ALTER TABLE "anuncios" ADD COLUMN     "anuncioCategoriaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "anuncios_categorias" DROP COLUMN "anuncioId";

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_anuncioCategoriaId_fkey" FOREIGN KEY ("anuncioCategoriaId") REFERENCES "anuncios_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
