import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AuthPresenter } from '../auth.presenter';
import { SwitchCompanyDTO } from '../dtos';

@Injectable()
export class SwitchCompanyUseCase {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService, //
	) {}

	async execute(auth: AuthPresenter, data: SwitchCompanyDTO) {
		const userCompany = await this.prismaService.userCompanies.findFirst({
			where: { userId: auth.user.id, companyId: data.companyId },
		});

		if (!userCompany) {
			throw new HttpException('Você não está vinculado com esta empresa.', 401);
		}

		await this.prismaService.user.update({
			where: { id: auth.user.id },
			data: { companyId: data.companyId },
		});

		return {
			token: this.jwtService.sign({ id: auth.user.id }),
		};
	}
}
