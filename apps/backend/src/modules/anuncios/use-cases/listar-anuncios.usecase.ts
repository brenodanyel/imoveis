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
			where: {},
		};

		if (data.proposito) {
			query.where = { ...query.where, proposito: data.proposito };
		}

		if (data.subcategorias) {
			query.where = { ...query.where, subcategoriaId: { in: data.subcategorias } };
		}

		if (data.min_valor) {
			query.where = { ...query.where, valor: { gte: +data.min_valor } };
		}

		if (data.max_valor) {
			query.where = { ...query.where, valor: { lte: +data.max_valor } };
		}

		if (data.comodidades) {
			query.where = { ...query.where, comodidades: { some: { comodidadeId: { in: data.comodidades } } } };
		}

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
