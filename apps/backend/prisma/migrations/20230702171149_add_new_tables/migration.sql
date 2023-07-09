-- CreateTable
CREATE TABLE "anuncios" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "proposito" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "valor_iptu" DOUBLE PRECISION NOT NULL,
    "valor_condominio" DOUBLE PRECISION NOT NULL,
    "area_total" DOUBLE PRECISION NOT NULL,
    "area_construida" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "anuncios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comodidades" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "comodidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anuncios_comodidades" (
    "id" SERIAL NOT NULL,
    "anuncioId" INTEGER NOT NULL,
    "comodidadeId" INTEGER NOT NULL,

    CONSTRAINT "anuncios_comodidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristicas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "caracteristicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anuncios_caracteristicas" (
    "id" SERIAL NOT NULL,
    "anuncioId" INTEGER NOT NULL,
    "caracteristicaId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "anuncios_caracteristicas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncios_comodidades" ADD CONSTRAINT "anuncios_comodidades_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "anuncios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncios_comodidades" ADD CONSTRAINT "anuncios_comodidades_comodidadeId_fkey" FOREIGN KEY ("comodidadeId") REFERENCES "comodidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncios_caracteristicas" ADD CONSTRAINT "anuncios_caracteristicas_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "anuncios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncios_caracteristicas" ADD CONSTRAINT "anuncios_caracteristicas_caracteristicaId_fkey" FOREIGN KEY ("caracteristicaId") REFERENCES "caracteristicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
