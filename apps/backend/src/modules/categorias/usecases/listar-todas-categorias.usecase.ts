import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CategoriaEntity } from '../entities/categoria.entity';

@Injectable()
export class ListarTodasCategoriasUseCases {
	constructor(private readonly prismaService: PrismaService) {}

	async execute() {
		const categorias = await this.prismaService.categoria.findMany({
			include: {
				subcategorias: true,
			},
		});
		return categorias.map((comodidade) => new CategoriaEntity(comodidade));
	}
}
