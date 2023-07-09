/*
  Warnings:

  - You are about to drop the column `anuncioCategoriaId` on the `anuncios` table. All the data in the column will be lost.
  - Added the required column `subcategoriaId` to the `anuncios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "anuncios" DROP CONSTRAINT "anuncios_anuncioCategoriaId_fkey";

-- AlterTable
ALTER TABLE "anuncios" DROP COLUMN "anuncioCategoriaId",
ADD COLUMN     "subcategoriaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "anuncios_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
