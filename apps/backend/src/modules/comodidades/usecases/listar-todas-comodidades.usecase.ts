import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ComodidadeEntity } from '../entities/comodidade.entity';

@Injectable()
export class ListarTodasComodidadesUseCases {
	constructor(private readonly prismaService: PrismaService) {}

	async execute() {
		const comodidades = await this.prismaService.comodidade.findMany();
		return comodidades.map((comodidade) => new ComodidadeEntity(comodidade));
	}
}
