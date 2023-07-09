import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
	await prisma.plan.createMany({
		data: [
			{
				name: 'Teste gratuito',
				limit_users: 1,
				price: 0,
				public: false,
			},
			{
				name: 'Plano simples',
				limit_users: 5,
				price: 99,
			},
			{
				name: 'Plano profissional',
				limit_users: 10,
				price: 149,
			},
		],
		skipDuplicates: true,
	});
}
