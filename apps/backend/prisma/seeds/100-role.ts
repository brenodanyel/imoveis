import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
	await prisma.role.createMany({
		data: [
			{ name: 'Admin Geral', slug: 'admin_geral' },
			{ name: 'Admin', slug: 'admin' },
			{ name: 'Operador', slug: 'operador' },
		],
		skipDuplicates: true,
	});
}
