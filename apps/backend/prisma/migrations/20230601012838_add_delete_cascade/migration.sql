-- DropForeignKey
ALTER TABLE "companies_addresses" DROP CONSTRAINT "companies_addresses_companyId_fkey";

-- AddForeignKey
ALTER TABLE "companies_addresses" ADD CONSTRAINT "companies_addresses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
