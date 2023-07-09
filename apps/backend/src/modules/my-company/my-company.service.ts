import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { MailerService } from '../../shared/mailer/mailer.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { generateRandomPassword, isMainCompany, verifyIfUserIsSettingRestrictRole } from '../../utils';
import { paginate } from '../../utils/pagination';
import { AuthPresenter } from '../auth/auth.presenter';
import { CompanyPresenter } from '../company/entities/company.presenter';
import { UserPresenter } from '../user/user.presenter';
import { AttachExistingUserDto } from './dto/attach-existing-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateMyCompanyDto } from './dto/update-my-company.dto';
import { UpdateUsersRolesDto } from './dto/update-users-roles.dto';
import { MyCompanyUserPresenter } from './presenters/my-company-user.presenter';

@Injectable()
export class MyCompanyService {
	constructor(private prismaService: PrismaService, private mailerService: MailerService, private jwtService: JwtService) {}

	async getMyCompanyInfo(companyId: number) {
		const company = await this.prismaService.company.findUnique({
			where: { id: companyId },
			include: {
				companyAddress: true,
				companyPlan: { include: { plan: true } },
			},
		});

		if (!company) {
			throw new NotFoundException('Empresa não encontrada.');
		}

		return new CompanyPresenter(company);
	}

	async listUsers(companyId: number, params: ListUsersDto) {
		const query: Prisma.UserFindManyArgs = {
			where: {
				userCompanies: {
					some: { companyId },
				},
			},
			include: {
				userCompanies: {
					where: { companyId },
					include: {
						userCompaniesRoles: {
							include: { role: true },
						},
					},
				},
			},
		};

		if (params.filter) {
			query.where.OR = [];
			query.where.OR.push({ name: { contains: params.filter } });
			if (Number(params.filter)) {
				query.where.OR.push({ id: { equals: Number(params.filter) } });
			}
		}

		if (params.roles) {
			query.where.userCompanies = {
				some: {
					companyId,
					userCompaniesRoles: {
						some: {
							roleId: { in: params.roles.map(Number) },
						},
					},
				},
			};
		}

		const result = await paginate<User, Prisma.UserFindManyArgs>(this.prismaService.user, query, {
			page: params?.page,
			rowsPerPage: params?.rowsPerPage,
			descending: params?.descending,
			sortBy: params?.sortBy,
		});

		return {
			...result,
			data: result.data.map((user) => new MyCompanyUserPresenter(user)),
		};
	}

	async removeUser(companyId: number, userId: number) {
		await this.prismaService.$transaction(async (trx) => {
			const user = await trx.user.findUnique({ where: { id: userId } });

			if (!user) {
				throw new BadRequestException('Usuário não encontrado.');
			}

			const userCompany = await trx.userCompanies.findFirst({
				where: { companyId, userId },
			});

			if (!userCompany) {
				throw new BadRequestException('Usuário não vinculado com a empresa.');
			}

			await trx.userCompanies.deleteMany({ where: { userId, companyId } });

			if (user.companyId === companyId) {
				const otherCompany = await trx.userCompanies.findFirst({ where: { userId } });
				await trx.user.update({
					where: { id: userId },
					data: { companyId: otherCompany?.companyId || null },
				});
			}
		});
	}

	async updateUserRoles(auth: AuthPresenter, userId: number, updateUserRolesDto: UpdateUsersRolesDto) {
		await this.prismaService.$transaction(async (trx) => {
			const user = await trx.user.findUnique({ where: { id: userId } });

			if (!user) {
				throw new BadRequestException('Usuário não encontrado.');
			}

			const userCompany = await trx.userCompanies.findFirst({
				where: { companyId: auth.user.company.id, userId },
			});

			if (!userCompany) {
				throw new BadRequestException('Usuário não vinculado com a empresa.');
			}

			await verifyIfUserIsSettingRestrictRole(updateUserRolesDto.roles, auth);

			await trx.userCompaniesRoles.deleteMany({
				where: { userCompanyId: userCompany.id },
			});

			await trx.userCompaniesRoles.createMany({
				data: updateUserRolesDto.roles.map((roleId) => ({ roleId, userCompanyId: userCompany.id })),
			});
		});
	}

	async verificaSePodeVincularUsuario(auth: AuthPresenter, userId: number) {
		const user = await this.prismaService.user.findUnique({ where: { id: userId } });

		if (!user) {
			throw new NotFoundException('Usuário não encontrado.');
		}

		const userCompany = await this.prismaService.userCompanies.findFirst({
			where: { companyId: auth.user.company.id, userId },
		});

		if (userCompany) {
			throw new ConflictException('Usuário já vinculado com a empresa.');
		}
	}

	async cadastrarUsuario(auth: AuthPresenter, createUserDto: CreateUserDto, origin: string) {
		const user = await this.prismaService.$transaction(async (trx) => {
			await this.verifyAddUserLimit(auth.user.company.id);

			const foundUser = await trx.user.findFirst({ where: { OR: [{ email: createUserDto.email }, { cpf: createUserDto.cpf }] } });

			if (foundUser) {
				throw new ConflictException('Já existe um usuário com esse e-mail ou CPF.');
			}

			await verifyIfUserIsSettingRestrictRole(createUserDto.roles, auth);

			const password = generateRandomPassword();

			const user = await trx.user.create({
				data: {
					email: createUserDto.email,
					name: createUserDto.name,
					cpf: createUserDto.cpf,
					password: await hash(password, 10),
					companyId: auth.user.company.id,
					active: false,
				},
			});

			await trx.userCompanies.create({
				data: {
					companyId: auth.user.company.id,
					userId: user.id,
					userCompaniesRoles: {
						createMany: {
							data: createUserDto.roles.map((roleId) => ({ roleId })),
						},
					},
				},
			});

			try {
				const company = await trx.company.findUniqueOrThrow({ where: { id: auth.user.company.id } });

				const confirmationCode = await trx.confirmationCode.create({
					data: {
						token: this.jwtService.sign({ userId: user.id }),
					},
				});

				await this.mailerService.sendMail({
					subject: 'Convite para ingressar no sistema',
					to: user.email,
					payload: {
						template: 'accept-invite-and-register-user',
						props: {
							name: user.name,
							email: user.email,
							company: company.name,
							password,
							link: `${origin}/aceitar-convite-para-ativar-usuario?q=${confirmationCode.id}`,
						},
					},
				});
			} catch (error) {
				console.log(error);
				throw new InternalServerErrorException('Erro ao enviar e-mail de confirmação.');
			}

			return user;
		});

		return new UserPresenter(user);
	}

	async vincularUsuarioExistente(auth: AuthPresenter, userId: number, attachExistingUserDto: AttachExistingUserDto, origin: string) {
		await this.prismaService.$transaction(async (trx) => {
			await this.verifyAddUserLimit(auth.user.company.id);

			const user = await trx.user.findUnique({ where: { id: userId } });

			if (!user) {
				throw new NotFoundException('Usuário não encontrado.');
			}

			await verifyIfUserIsSettingRestrictRole(attachExistingUserDto.roles, auth);

			const foundUserCompany = await trx.userCompanies.findFirst({
				where: { companyId: auth.user.company.id, userId },
			});

			if (foundUserCompany) {
				throw new ConflictException('Usuário já vinculado com a empresa.');
			}

			try {
				const company = await trx.company.findUniqueOrThrow({ where: { id: auth.user.company.id } });

				const confirmationCode = await trx.confirmationCode.create({
					data: {
						token: this.jwtService.sign({
							userId: user.id,
							companyId: auth.user.company.id,
							roles: attachExistingUserDto.roles,
						}),
					},
				});

				const roles = await trx.role.findMany({ where: { id: { in: attachExistingUserDto.roles } } });

				await this.mailerService.sendMail({
					subject: 'Convite para ingressar no sistema',
					to: user.email,
					payload: {
						template: 'accept-invite-to-company',
						props: {
							name: user.name,
							company: company.name,
							convidado_por: auth.user.name,
							perfis: roles.length ? roles.map((role) => role.name).join(', ') : '*Nenhum perfil atribuido',
							link: `${origin}/aceitar-convite-de-empresa?q=${confirmationCode.id}`,
						},
					},
				});
			} catch (error) {
				console.log(error);
				throw new InternalServerErrorException('Erro ao enviar e-mail de confirmação.');
			}
		});
	}

	private async verifyAddUserLimit(companyId: number) {
		const companyPlan = await this.prismaService.companyPlan.findFirst({ where: { companyId }, include: { plan: true } });

		if (!companyPlan?.plan) {
			throw new BadRequestException('Não é possível realizar essa ação pois a sua empresa não possui um plano ativo.');
		}

		if (dayjs(companyPlan.expiresAt).isBefore(dayjs())) {
			throw new BadRequestException('Não é possível realizar essa ação pois o seu plano está expirado.');
		}

		const usersCount = await this.prismaService.userCompanies.count({ where: { companyId } });

		if (usersCount >= (companyPlan.plan.limit_users || 0)) {
			throw new BadRequestException('A sua empresa já atingiu o limite de usuários permitidos no seu plano atual.');
		}
	}

	async updateMyCompanyInfo(auth: AuthPresenter, updateMyCompanyDto: UpdateMyCompanyDto) {
		const foundOtherCompany = await this.prismaService.company.findFirst({
			where: {
				id: { not: auth.user.company.id },
				OR: [{ cnpj: updateMyCompanyDto.cnpj }, { name: updateMyCompanyDto.name }],
			},
		});

		if (foundOtherCompany) {
			throw new ConflictException('Já existe outra empresa com este nome, ou com este CNPJ.');
		}

		if (await isMainCompany(auth.user.company.id)) {
			updateMyCompanyDto.cnpj = undefined;
		}

		const company = await this.prismaService.company.update({
			where: { id: auth.user.company.id },
			data: {
				name: updateMyCompanyDto.name,
				cnpj: updateMyCompanyDto.cnpj,
				phone_number: updateMyCompanyDto.phone_number,
				companyAddress: {
					upsert: {
						create: updateMyCompanyDto.address,
						update: updateMyCompanyDto.address,
					},
				},
			},
		});

		return new CompanyPresenter(company);
	}
}
