import { Controller, Get, Query } from '@nestjs/common';

import * as DTOs from './dtos';
import * as UseCase from './use-cases';

@Controller('anuncios')
export class AnunciosController {
	constructor(
		private readonly listarAnunciosUseCase: UseCase.ListarAnunciosUseCase, //
	) {}

	@Get('/')
	listarAnuncios(@Query() data: DTOs.ListarAnunciosDTO) {
		return this.listarAnunciosUseCase.execute(data);
	}
}
