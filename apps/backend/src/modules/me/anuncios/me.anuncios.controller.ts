import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Auth, GuardRoute } from '../../auth/auth.guard';
import { AuthPresenter } from '../../auth/auth.presenter';

import * as DTOs from './dtos';
import * as UseCases from './usecases';

@Controller('me/anuncios')
export class MeAnunciosController {
	constructor(
		private readonly buscarMeusAnunciosUseCase: UseCases.BuscarMeusAnunciosUseCase,
		private readonly criarAnuncioUseCase: UseCases.CriarAnuncioUseCase,
		private readonly atualizarAnuncioUseCase: UseCases.AtualizarAnuncioUseCase,
	) {}

	@Get('/')
	@GuardRoute()
	buscarMeusAnuncios(@Auth() auth: AuthPresenter, @Query() query: DTOs.BuscarMeusAnunciosDTO) {
		return this.buscarMeusAnunciosUseCase.execute(auth, query);
	}

	@Post('/')
	@GuardRoute()
	criarAnuncio(@Auth() auth: AuthPresenter, @Body() data: DTOs.CriarAnuncioDTO) {
		return this.criarAnuncioUseCase.execute(auth, data);
	}

	@Patch('/:id')
	@GuardRoute()
	atualizarAnuncio(@Auth() auth: AuthPresenter, @Param('id') id: number, @Body() data: DTOs.AtualizarAnuncioDTO) {
		return this.atualizarAnuncioUseCase.execute(auth, +id, data);
	}
}
