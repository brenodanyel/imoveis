-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "subcategorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anuncios_categorias" (
    "id" SERIAL NOT NULL,
    "anuncioId" INTEGER NOT NULL,
    "subcategoriaId" INTEGER NOT NULL,

    CONSTRAINT "anuncios_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "subcategorias_nome_key" ON "subcategorias"("nome");

-- AddForeignKey
ALTER TABLE "subcategorias" ADD CONSTRAINT "subcategorias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncios_categorias" ADD CONSTRAINT "anuncios_categorias_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "anuncios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncios_categorias" ADD CONSTRAINT "anuncios_categorias_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "subcategorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
