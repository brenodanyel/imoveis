import { CopyObjectCommand, DeleteObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

@Injectable()
export class StorageService {
	private readonly client: S3Client;
	private readonly region: string;

	constructor(private readonly configService: ConfigService) {
		this.region = configService.getOrThrow('USE_AWS_REGION');

		this.client = new S3Client({
			region: this.region,
			credentials: {
				accessKeyId: configService.getOrThrow('USE_AWS_ACCESS_KEY_ID'),
				secretAccessKey: configService.getOrThrow('USE_AWS_SECRET_ACCESS_KEY'),
			},
		});
	}

	async uploadFile(file: { name: string; data: Buffer; mimetype: string }, bucketName: string) {
		const ext = file.name.split('.').pop();
		const key = `${randomUUID()}.${ext}`;

		await this.client.send(
			new PutObjectCommand({
				ACL: 'public-read',
				Bucket: bucketName,
				Body: file.data,
				Key: key,
				ContentType: file.mimetype,
			}),
		);

		return `https://${bucketName}.s3.amazonaws.com/${key}`;
	}

	async deleteFile(url: string, bucketName: string) {
		const key = url.split('/').pop();
		await this.client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
	}

	async moveFile(url: string, fromBucketName: string, toBucketName: string) {
		const key = url.split('/').pop();

		await this.client.send(
			new CopyObjectCommand({
				Bucket: toBucketName,
				CopySource: `${fromBucketName}/${key}`,
				ACL: 'public-read',
				Key: key,
			}),
		);

		await this.client.send(
			new DeleteObjectCommand({
				Bucket: fromBucketName,
				Key: key,
			}),
		);
	}

	@Cron('0 * * * *')
	async deleteExpiredTempFiles() {
		console.log('Deleting expired temp files...');

		const { Contents } = await this.client.send(
			new ListObjectsCommand({
				Bucket: this.configService.getOrThrow('USE_AWS_S3_BUCKET_TEMP'),
			}),
		);

		if (!Contents?.length) return;

		await Promise.all(
			Contents.filter((content) => dayjs().diff(dayjs(content.LastModified), 'minute') >= 0).map((content) =>
				this.client.send(new DeleteObjectCommand({ Bucket: this.configService.getOrThrow('USE_AWS_S3_BUCKET_TEMP'), Key: content.Key })),
			),
		);
	}
}
