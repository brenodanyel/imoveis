import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

export default async function seed(prisma: PrismaClient) {
	await prisma.$transaction(async (trx) => {
		const adminRole = await trx.role.findFirstOrThrow({ where: { slug: 'admin_geral' } });
		const mainCompany = await trx.company.findFirstOrThrow({ where: { cnpj: '00000000000000' } });

		const user = await trx.user.upsert({
			where: { email: 'admin@admin.com' },
			create: {
				name: 'Admin',
				email: 'admin@admin.com',
				cpf: '00000000000',
				password: randomUUID(),
				companyId: mainCompany.id,
			},
			update: {},
		});

		const foundUserCompany = await trx.userCompanies.findFirst({ where: { userId: user.id } });

		const userCompany = foundUserCompany || (await trx.userCompanies.create({ data: { userId: user.id, companyId: mainCompany.id } }));

		const foundAdminRoleUserCompany = await trx.userCompaniesRoles.findFirst({
			where: { userCompanyId: userCompany.id, roleId: adminRole.id },
		});

		if (!foundAdminRoleUserCompany) {
			await trx.userCompaniesRoles.create({
				data: { userCompanyId: userCompany.id, roleId: adminRole.id },
			});
		}
	});
}
