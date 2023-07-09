import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		rawBody: true,
		cors: {
			origin: '*',
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		},
	});

	const configService = app.get(ConfigService);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
