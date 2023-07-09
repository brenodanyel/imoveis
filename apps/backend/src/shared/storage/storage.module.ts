import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import * as UseCases from './usecases';

@Module({
	controllers: [StorageController],
	providers: [StorageService, ...Object.values(UseCases)],
	exports: [StorageService],
})
export class StorageModule {}
