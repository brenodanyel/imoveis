import { Module } from '@nestjs/common';
import { CaracteristicasController } from './caracteristicas.controller';
import * as UseCases from './usecases';

@Module({
	controllers: [CaracteristicasController],
	providers: Object.values(UseCases),
})
export class CaracteristicasModule {}
