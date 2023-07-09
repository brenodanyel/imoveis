import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CompanyPresenter } from '../company/entities/company.presenter';
import { UserPresenter } from '../user/user.presenter';
import { UpdateMyUserDto } from './dto/update-my-user.dto';

@Injectable()
export class MeService {
	constructor(private prismaService: PrismaService) {}

	async listMyCompanies(userId: number) {
		const userCompanies = await this.prismaService.userCompanies.findMany({
			where: { userId },
			include: {
				company: true,
				userCompaniesRoles: {
					include: { role: true },
				},
			},
		});

		return userCompanies.map((userCompany) => {
			return {
				company: userCompany.company ? new CompanyPresenter(userCompany.company) : null,
				roles: userCompany.userCompaniesRoles.map((userCompanyRole) => {
					return userCompanyRole.role;
				}),
			};
		});
	}

	async updateMyUser(userId: number, updateMyUserDto: UpdateMyUserDto) {
		const foundOtherUser = await this.prismaService.user.findFirst({
			where: {
				id: { not: userId },
				OR: [{ email: updateMyUserDto.email }, { cpf: updateMyUserDto.cpf }],
			},
		});

		if (foundOtherUser) {
			throw new ConflictException('Já existe um outro usuário com o mesmo email ou CPF.');
		}

		const user = await this.prismaService.user.findUnique({ where: { id: userId } });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (updateMyUserDto.password) {
			if (!updateMyUserDto.oldPassword) {
				throw new BadRequestException('Você precisa informar a senha antiga para alterar a senha.');
			}

			const oldPasswordMatches = await compare(updateMyUserDto.oldPassword, user.password);

			if (!oldPasswordMatches) {
				throw new BadRequestException('A senha antiga não confere.');
			}
		}

		const updatedUser = await this.prismaService.user.update({
			where: { id: userId },
			data: {
				name: updateMyUserDto.name,
				email: updateMyUserDto.email,
				cpf: updateMyUserDto.cpf,
				password: updateMyUserDto.password ? await hash(updateMyUserDto.password, 10) : undefined,
			},
		});

		return new UserPresenter(updatedUser);
	}
}
