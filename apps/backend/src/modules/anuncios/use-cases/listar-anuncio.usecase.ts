import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AnuncioEntity } from '../anuncio.entity';
import { ListarAnuncioDTO } from '../dtos';

@Injectable()
export class ListarAnuncioUseCase {
	constructor(
		private readonly prismaService: PrismaService, //
	) {}

	async execute(data: ListarAnuncioDTO) {
		const anuncio = await this.prismaService.anuncio.findUnique({
			include: {
				endereco: true,
				caracteristicas: {
					include: { caracteristica: true },
				},
				subcategoria: true,
				comodidades: { include: { comodidade: true } },
				imagens: true,
			},
			where: { id: data.id },
		});

		if (!anuncio) {
			throw new NotFoundException('Anúncio não encontrado');
		}

		return new AnuncioEntity(anuncio);
	}
}
