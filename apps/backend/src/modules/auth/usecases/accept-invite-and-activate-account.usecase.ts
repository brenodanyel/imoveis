import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AcceptInviteAndActivateAccountUseCaseDTO } from '../dtos';

@Injectable()
export class AcceptInviteAndActivateAccountUseCase {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService, //
	) {}

	async execute(data: AcceptInviteAndActivateAccountUseCaseDTO) {
		await this.prismaService.$transaction(async (trx) => {
			const confirmationCode = await trx.confirmationCode.findUnique({ where: { id: data.q } });

			if (!confirmationCode) {
				throw new NotFoundException('URL inválida ou expirada.');
			}

			const payload = this.jwtService.verify(confirmationCode.token);

			const user = await trx.user.findUnique({ where: { id: payload.userId } });

			if (!user) {
				throw new NotFoundException('Usuário não encontrado.');
			}

			await trx.user.update({ where: { id: user.id }, data: { active: true } });

			await trx.confirmationCode.delete({ where: { id: confirmationCode.id } });
		});
	}
}
