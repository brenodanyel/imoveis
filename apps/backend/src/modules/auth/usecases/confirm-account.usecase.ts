import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ConfirmAccountDTO } from '../dtos';

@Injectable()
export class ConfirmAccountUseCase {
	constructor(
		private prismaService: PrismaService,
		private jwtService: JwtService, //
	) {}

	async execute(q: ConfirmAccountDTO) {
		await this.prismaService.$transaction(async (trx) => {
			const confirmationCode = await trx.confirmationCode.findUnique({ where: { id: q.q } });

			if (!confirmationCode) {
				throw new NotFoundException('URL inválida ou expirada.');
			}

			const payload = this.jwtService.verify(confirmationCode.token);

			const user = await trx.user.findUnique({ where: { id: payload.userId } });

			if (!user) {
				throw new NotFoundException('Usuário não encontrado.');
			}

			if (user.active) return;

			const company = await trx.company.findUnique({ where: { id: user.companyId } });

			if (!company) {
				throw new NotFoundException('Empresa não encontrada.');
			}

			if (company.active) return;

			await trx.user.update({ where: { id: user.id }, data: { active: true } });
			await trx.company.update({ where: { id: company.id }, data: { active: true } });

			await trx.companyPlan.update({
				where: { companyId: company.id },
				data: {
					paidAt: dayjs().toISOString(),
					expiresAt: dayjs().add(7, 'day').toISOString(),
				},
			});

			await trx.confirmationCode.delete({ where: { id: confirmationCode.id } });
		});
	}
}
