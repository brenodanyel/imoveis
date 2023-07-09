import { Module } from '@nestjs/common';
import { CategoriaController } from './categorias.controller';
import * as UseCases from './usecases';

@Module({
	controllers: [CategoriaController],
	providers: Object.values(UseCases),
})
export class CategoriasModule {}
