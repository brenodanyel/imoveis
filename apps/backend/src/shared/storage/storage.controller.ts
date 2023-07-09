import { Controller, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { GuardRoute } from '../../modules/auth/auth.guard';
import { ValidateFileMaxSize, ValidateFileType } from '../../utils/commons.validator';
import { StorageService } from './storage.service';
import * as UseCases from './usecases';

@Controller('/storage')
export class StorageController {
	constructor(
		private readonly uploadFileUseCase: UseCases.UploadFileUseCase,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService,
	) {}

	@Post('/')
	@GuardRoute()
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new ValidateFileType({
						fileType: /\\image\/(jpg|jpeg|png|gif)$/i,
						message: 'Apenas arquivos .jpg, .jpeg, .png e .gif são aceitos.',
					}),
					new ValidateFileMaxSize({
						maxSize: 1 * 1024 * 1024, // 1MB
						message: (maxSize) => `O tamanho máximo do arquivo é de ${maxSize / 1024 / 1024}MB`,
					}),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		return this.uploadFileUseCase.execute(file);
	}

	@Post('/save')
	@GuardRoute()
	saveFile() {
		return this.storageService.moveFile(
			'https://idz-temp.s3.amazonaws.com/1688402247488.png',
			this.configService.getOrThrow('USE_AWS_S3_BUCKET_TEMP'),
			this.configService.getOrThrow('USE_AWS_S3_BUCKET'),
		);
	}
}
