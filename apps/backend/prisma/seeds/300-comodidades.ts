import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
	await prisma.comodidade.createMany({
		data: [
			{ nome: 'Portaria' },
			{ nome: 'Interfone' },
			{ nome: 'Alarme' },
			{ nome: 'Cameras de Segurança' },
			{ nome: 'Cerca Elétrica' },
			{ nome: 'Estacionamento Coberto' },
			{ nome: 'Estacionamento para Visitante' },
			{ nome: 'Sauna' },
			{ nome: 'Lavanderia' },
			{ nome: 'Academia' },
			{ nome: 'Salão de Jogos' },
			{ nome: 'Campo de Futebol' },
			{ nome: 'Quadra Poliesportiva' },
			{ nome: 'Quadra de Areia' },
			{ nome: 'Piscina' },
			{ nome: 'Piscina Aquecida' },
			{ nome: 'Cozinha Planejada' },
			{ nome: 'Asfalto' },
			{ nome: 'Aquecedor Solar' },
			{ nome: 'Energia Fotovoltaica' },
		],
		skipDuplicates: true,
	});
}
