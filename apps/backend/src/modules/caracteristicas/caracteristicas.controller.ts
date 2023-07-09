import { Controller, Get } from '@nestjs/common';
import * as UseCases from './usecases';

@Controller('caracteristica')
export class CaracteristicasController {
	constructor(private readonly listarTodasCaracteristicasUseCase: UseCases.ListarTodasCaracteristicas) {}

	@Get('/')
	async listarTodasCaracteristicas() {
		return this.listarTodasCaracteristicasUseCase.execute();
	}
}
