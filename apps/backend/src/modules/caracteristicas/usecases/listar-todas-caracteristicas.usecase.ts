import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CaracteristicaEntity } from '../entities/caracteristica.entity';

@Injectable()
export class ListarTodasCaracteristicas {
	constructor(private readonly prismaService: PrismaService) {}

	async execute() {
		const caracteristicas = await this.prismaService.caracteristica.findMany();
		return caracteristicas.map((caracteristica) => new CaracteristicaEntity(caracteristica));
	}
}
