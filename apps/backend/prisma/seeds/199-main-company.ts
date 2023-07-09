import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
	const company = await prisma.company.findUnique({ where: { cnpj: '00000000000000' } });

	if (!company) {
		await prisma.company.create({
			data: {
				name: 'Empresa mãe',
				cnpj: '00000000000000',
				phone_number: '',
			},
		});
		return;
	}
}
