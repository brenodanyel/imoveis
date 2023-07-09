import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
	await prisma.caracteristica.createMany({
		data: [
			{ nome: 'Quartos' },
			{ nome: 'Quartos com ar-condicionados' },
			{ nome: 'Suítes' },
			{ nome: 'Suítes com ar-condicionados' },
			{ nome: 'Banheiros' },
			{ nome: 'Banheiros Sociais' },
			{ nome: 'Salas de TV' },
			{ nome: 'Salas de Estar' },
			{ nome: 'Garagens cobertas' },
			{ nome: 'Garagens descobertas' },
		],
		skipDuplicates: true,
	});
}
