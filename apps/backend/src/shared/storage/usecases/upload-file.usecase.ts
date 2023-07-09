import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../storage.service';

@Injectable()
export class UploadFileUseCase {
	constructor(private readonly storageService: StorageService, private readonly configService: ConfigService) {}

	async execute(file: Express.Multer.File) {
		const result = await this.storageService.uploadFile(
			{
				data: file.buffer,
				mimetype: file.mimetype,
				name: file.originalname,
			},
			this.configService.getOrThrow('USE_AWS_S3_BUCKET_TEMP'),
		);

		return { url: result };
	}
}
