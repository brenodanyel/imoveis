/*
  Warnings:

  - You are about to drop the `anuncios_categorias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "anuncios" DROP CONSTRAINT "anuncios_subcategoriaId_fkey";

-- DropForeignKey
ALTER TABLE "anuncios_categorias" DROP CONSTRAINT "anuncios_categorias_subcategoriaId_fkey";

-- DropTable
DROP TABLE "anuncios_categorias";

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "subcategorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
