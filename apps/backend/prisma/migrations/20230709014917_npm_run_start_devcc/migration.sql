-- DropForeignKey
ALTER TABLE "anuncios" DROP CONSTRAINT "anuncios_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "anuncios" DROP CONSTRAINT "anuncios_subcategoriaId_fkey";

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "subcategorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "endereco"("id") ON DELETE CASCADE ON UPDATE CASCADE;
