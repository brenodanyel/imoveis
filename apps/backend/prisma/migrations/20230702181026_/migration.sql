/*
  Warnings:

  - Added the required column `enderecoId` to the `anuncios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "anuncios" ADD COLUMN     "enderecoId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "anuncio_enderecos" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anuncio_enderecos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "anuncio_enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
