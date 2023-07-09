import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AcceptInviteToCompanyDTO } from '../dtos';

@Injectable()
export class AcceptInviteToCompanyUseCase {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService, //
	) {}

	async execute(data: AcceptInviteToCompanyDTO) {
		await this.prismaService.$transaction(async (trx) => {
			const confirmationCode = await trx.confirmationCode.findUnique({ where: { id: data.q } });

			if (!confirmationCode) {
				throw new NotFoundException('URL inválida ou expirada.');
			}

			const payload = this.jwtService.verify(confirmationCode.token);

			const { userId, companyId, roles } = payload;

			const user = await trx.user.findUnique({ where: { id: userId } });

			if (!user) {
				throw new NotFoundException('Usuário não encontrado.');
			}

			const company = await trx.company.findUnique({ where: { id: companyId } });

			if (!company) {
				throw new NotFoundException('Empresa não encontrada.');
			}

			await trx.userCompanies.create({
				data: {
					companyId,
					userId,
					userCompaniesRoles: {
						createMany: { data: roles.map((roleId: number) => ({ roleId })) },
					},
				},
			});

			if (!user.companyId) {
				await trx.user.update({ where: { id: userId }, data: { companyId } });
			}

			await trx.confirmationCode.delete({ where: { id: confirmationCode.id } });
		});
	}
}
