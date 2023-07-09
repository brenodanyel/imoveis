import { Injectable } from '@nestjs/common';
import { Anuncio, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { paginate } from '../../../../utils/pagination';
import { AuthPresenter } from '../../../auth/auth.presenter';
import { BuscarMeusAnunciosDTO } from '../dtos';
import { AnuncioEntity } from '../entities/anuncio.entity';

@Injectable()
export class BuscarMeusAnunciosUseCase {
	constructor(private readonly prismaService: PrismaService) {}

	async execute(auth: AuthPresenter, data: BuscarMeusAnunciosDTO) {
		const query: Prisma.AnuncioFindManyArgs = {
			where: { userId: auth.user.id },
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
