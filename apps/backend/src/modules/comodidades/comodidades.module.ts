import { Module } from '@nestjs/common';
import { ComodidadesController } from './comodidades.controller';
import * as UseCases from './usecases';

@Module({
	controllers: [ComodidadesController],
	providers: Object.values(UseCases),
})
export class ComodidadesModule {}
