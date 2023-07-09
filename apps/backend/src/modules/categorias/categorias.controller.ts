import { Controller, Get } from '@nestjs/common';
import * as UseCases from './usecases';

@Controller('categorias')
export class CategoriaController {
	constructor(private readonly listarTodasCategoriasUseCase: UseCases.ListarTodasCategoriasUseCases) {}

	@Get('/')
	async listarTodasCategorias() {
		return this.listarTodasCategoriasUseCase.execute();
	}
}
