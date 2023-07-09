import { Module } from '@nestjs/common';
import { AnunciosController } from './anuncios.controller';
import * as UseCase from './use-cases';

@Module({
	controllers: [AnunciosController],
	providers: Object.values(UseCase),
})
export class AnunciosModule {}
