import { Injectable } from '@nestjs/common';
import { Anuncio, Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginate } from '../../../utils/pagination';
import { AnuncioEntity } from '../anuncio.entity';
import { ListarAnunciosDTO } from '../dtos';

@Injectable()
export class ListarAnunciosUseCase {
	constructor(
		private readonly prismaService: PrismaService, //
	) {}

	async execute(data: ListarAnunciosDTO) {
		const query: Prisma.AnuncioFindManyArgs = {
			include: {
				endereco: true,
				caracteristicas: {
					include: { caracteristica: true },
				},
				subcategoria: true,
				comodidades: { include: { comodidade: true } },
				imagens: true,
			},
		};

		const result = await paginate<Anuncio, Prisma.AnuncioFindManyArgs>(this.prismaService.anuncio, query, {
			page: data?.page,
			rowsPerPage: data?.rowsPerPage,
			descending: data?.descending,
			sortBy: data?.sortBy,
		});

		return {
			...result,
			data: result.data.map((anuncio) => new AnuncioEntity(anuncio)),
		};
	}
}
