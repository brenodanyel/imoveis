import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { StorageService } from '../../../../shared/storage/storage.service';
import { AuthPresenter } from '../../../auth/auth.presenter';
import { CriarAnuncioDTO } from '../dtos';

@Injectable()
export class CriarAnuncioUseCase {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly storageService: StorageService, //
	) {}

	async execute(auth: AuthPresenter, data: CriarAnuncioDTO) {
		return this.prismaService.$transaction(async (trx) => {
			const anuncio = await trx.anuncio.create({
				data: {
					area_construida: data.area_construida,
					area_total: data.area_total,
					descricao: data.descricao,
					proposito: data.proposito,

					thumbnail: data.thumbnail,

					titulo: data.titulo,
					valor: data.valor,
					valor_condominio: data.valor_condominio,
					valor_iptu: data.valor_iptu,

					endereco: { create: data.endereco },
					subcategoria: { connect: { id: data.subcategoria.id } },

					user: { connect: { id: auth.user.id } },
					company: { connect: { id: auth.user.company.id } },

					caracteristicas: {
						create: Object.entries(data.caracteristicas).map(([key, value]) => ({
							caracteristica: { connect: { nome: key } },
							qty: value,
						})),
					},

					comodidades: {
						create: data.comodidades.map((comodidade) => ({
							comodidade: { connect: { nome: comodidade } },
						})),
					},
				},
			});

			const tempBucket = this.configService.getOrThrow('USE_AWS_S3_BUCKET_TEMP');
			const bucket = this.configService.getOrThrow('USE_AWS_S3_BUCKET');

			if (data.thumbnail?.includes(tempBucket)) {
				this.storageService.moveFile(data.thumbnail, tempBucket, bucket);

				await trx.anuncio.update({
					where: { id: anuncio.id },
					data: {
						thumbnail: data.thumbnail.replace(tempBucket, bucket),
					},
				});
			}

			for (const imagem of data.imagens) {
				if (imagem.url.includes(tempBucket)) {
					this.storageService.moveFile(imagem.url, tempBucket, bucket);
				}
			}

			await trx.anuncio.update({
				where: { id: anuncio.id },
				data: {
					imagens: {
						create: data.imagens.map((imagem) => ({
							url: imagem.url.replace(tempBucket, bucket),
						})),
					},
				},
			});

			return { message: 'Anúncio criado com sucesso' };
		});
	}
}
