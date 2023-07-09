import { Module } from '@nestjs/common';
import { StorageModule } from '../../../shared/storage/storage.module';
import { MeAnunciosController } from './me.anuncios.controller';
import * as UseCases from './usecases';

@Module({
	imports: [StorageModule],
	controllers: [MeAnunciosController],
	providers: Object.values(UseCases),
})
export class MeAnunciosModule {}
