-- CreateTable
CREATE TABLE "anuncios_imagens" (
    "id" SERIAL NOT NULL,
    "anuncioId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "anuncios_imagens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anuncios_imagens" ADD CONSTRAINT "anuncios_imagens_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "anuncios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
