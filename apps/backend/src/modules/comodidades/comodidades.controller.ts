import { Controller, Get } from '@nestjs/common';
import * as UseCases from './usecases';

@Controller('comodidade')
export class ComodidadesController {
	constructor(private readonly listarTodasComodidadesUseCase: UseCases.ListarTodasComodidadesUseCases) {}

	@Get('/')
	async listarTodasComodidades() {
		return this.listarTodasComodidadesUseCase.execute();
	}
}
