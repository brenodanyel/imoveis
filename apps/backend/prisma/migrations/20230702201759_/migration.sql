/*
  Warnings:

  - You are about to drop the `anuncio_enderecos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "anuncios" DROP CONSTRAINT "anuncios_enderecoId_fkey";

-- DropTable
DROP TABLE "anuncio_enderecos";

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
