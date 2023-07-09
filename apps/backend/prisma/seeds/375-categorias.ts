import { PrismaClient } from '@prisma/client';

export default async function seed(prisma: PrismaClient) {
	const categories = [
		{ name: 'Residencial', subcategories: ['Apartamento', 'Apartamento (Cobertura)', 'Casa', 'Casa (Condominio)', 'Kitnet', 'Sobrado'] },
		{
			name: 'Comercial',
			subcategories: [
				'Área',
				'Imóvel Comercial',
				'Galpão/Depósito',
				'Industria/Fábrica',
				'Ponto Comercial',
				'Pousada/Hotel/Motel',
				'Sala/Salão/Loja',
			],
		},
		{ name: 'Rural', subcategories: ['Chácara', 'Fazenda', 'Pesqueiro', 'Sitio'] },
	];

	for (const category of categories) {
		await prisma.categoria.upsert({
			where: { nome: category.name },
			update: {},
			create: { nome: category.name },
		});

		for (const subcategory of category.subcategories) {
			await prisma.subcategoria.upsert({
				where: { nome: subcategory },
				update: {},
				create: { nome: subcategory, categoria: { connect: { nome: category.name } } },
			});
		}
	}
}
