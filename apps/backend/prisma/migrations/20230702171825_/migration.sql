/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `caracteristicas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `comodidades` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "caracteristicas_nome_key" ON "caracteristicas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "comodidades_nome_key" ON "comodidades"("nome");
