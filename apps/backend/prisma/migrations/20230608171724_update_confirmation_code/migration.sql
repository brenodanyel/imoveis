/*
  Warnings:

  - The primary key for the `confirmation_codes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "confirmation_codes_token_key";

-- AlterTable
ALTER TABLE "confirmation_codes" DROP CONSTRAINT "confirmation_codes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "confirmation_codes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "confirmation_codes_id_seq";
