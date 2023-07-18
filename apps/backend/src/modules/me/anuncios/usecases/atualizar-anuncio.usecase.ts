import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { StorageService } from '../../../../shared/storage/storage.service';
import { AuthPresenter } from '../../../auth/auth.presenter';
import { AtualizarAnuncioDTO } from '../dtos';

@Injectable()
export class AtualizarAnuncioUseCase {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService, //
	) {}

	async execute(auth: AuthPresenter, id: number, data: AtualizarAnuncioDTO) {
		return this.prismaService.$transaction(async (trx) => {
			const anuncio = await trx.anuncio.findFirst({ where: { id, userId: auth.user.id } });

			if (!anuncio) {
				throw new NotFoundException('Anúncio não encontrado');
			}

			await trx.anuncio.update({
				where: { id },
				data: {
					area_construida: data.area_construida,
					area_total: data.area_total,
					descricao: data.descricao,
					proposito: data.proposito,
					titulo: data.titulo,
					valor: data.valor,
					valor_condominio: data.valor_condominio,
					valor_iptu: data.valor_iptu,
					thumbnail: data.thumbnail,

					endereco: { upsert: { create: data.endereco, update: data.endereco } },

					...(data.subcategoria.id ? { subcategoria: { connect: { id: data.subcategoria.id } } } : undefined),

					caracteristicas: {
						deleteMany: { anuncioId: id },
						create: Object.entries(data.caracteristicas).map(([key, value]) => ({
							caracteristica: { connect: { nome: key } },
							qty: value,
						})),
					},

					comodidades: {
						deleteMany: { anuncioId: id },
						create: data.comodidades.map((comodidade) => ({
							comodidade: { connect: { nome: comodidade } },
						})),
					},
				},
			});

			const tempBucket = this.configService.getOrThrow('USE_AWS_S3_BUCKET_TEMP');
			const bucket = this.configService.getOrThrow('USE_AWS_S3_BUCKET');

			if (data.thumbnail?.includes(tempBucket)) {
				await this.storageService.moveFile(data.thumbnail, tempBucket, bucket);

				await trx.anuncio.update({
					where: { id },
					data: {
						thumbnail: data.thumbnail.replace(tempBucket, bucket),
					},
				});
			}

			if (!data.thumbnail && anuncio.thumbnail) {
				this.storageService.deleteFile(anuncio.thumbnail, bucket);
			}

			for (const imagem of data.imagens) {
				if (imagem.url.includes(tempBucket)) {
					this.storageService.moveFile(imagem.url, tempBucket, bucket);
				}
			}

			const previousImages = await trx.anuncioImagem.findMany({ where: { anuncioId: id } });

			for (const previousImage of previousImages) {
				if (!data.imagens.find((imagem) => imagem.url === previousImage.url)) {
					this.storageService.deleteFile(previousImage.url, bucket);
				}
			}

			await trx.anuncio.update({
				where: { id },
				data: {
					imagens: {
						deleteMany: { anuncioId: id },
						create: data.imagens.map((imagem) => ({
							url: imagem.url.replace(tempBucket, bucket),
						})),
					},
				},
			});

			return { message: 'Anúncio atualizado com sucesso' };
		});
	}
}
