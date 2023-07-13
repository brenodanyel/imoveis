import { Controller, Get, Param, Query } from '@nestjs/common';

import * as DTOs from './dtos';
import * as UseCase from './use-cases';

@Controller('anuncios')
export class AnunciosController {
	constructor(
		private readonly listarAnuncioUseCase: UseCase.ListarAnuncioUseCase,
		private readonly listarAnunciosUseCase: UseCase.ListarAnunciosUseCase, //
	) {}

	@Get('/')
	listarAnuncios(@Query() data: DTOs.ListarAnunciosDTO) {
		return this.listarAnunciosUseCase.execute(data);
	}

	@Get('/:id')
	listaAnuncio(@Param() data: DTOs.ListarAnuncioDTO) {
		return this.listarAnuncioUseCase.execute(data);
	}
}
