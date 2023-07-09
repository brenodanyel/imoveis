import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { ACLService } from '../../shared/acl.module';
import { MailerService } from '../../shared/mailer/mailer.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { generateRandomPassword, isMainCompany, verifyIfUserIsSettingRestrictRole } from '../../utils';
import { paginate } from '../../utils/pagination';
import { AuthPresenter } from '../auth/auth.presenter';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllDto } from './dto/find-all.dto';
import { FindByDto } from './dto/find-by.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPresenter } from './user.presenter';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly aclService: ACLService,
		private readonly mailerService: MailerService,
	) {}

	private verifyIfUserIsSettingUserToMainCompany = async (userCompanies: CreateUserDto['userCompanies'], auth: AuthPresenter) => {
		for (const company of userCompanies) {
			if (isMainCompany(company.id)) {
				this.aclService.verifyPermission('add-user-to-main-company', auth, 'Você não tem permissão para colocar o usuário na empresa principal.');
			}
		}
	};

	async create(createUserDto: CreateUserDto, auth: AuthPresenter, origin: string) {
		const userExists = await this.prismaService.user.findFirst({
			where: {
				OR: [{ email: createUserDto.email }, { cpf: createUserDto.cpf }],
			},
			include: { company: true },
		});

		if (userExists) {
			throw new HttpException('Já existe um usuário cadastrado com este e-mail ou CPF.', 409);
		}

		const foundCompanies = await this.prismaService.company.findMany({
			where: { id: { in: createUserDto.userCompanies.map((company) => company.id) } },
		});

		if (foundCompanies.length !== createUserDto.userCompanies.length) {
			throw new HttpException('Alguma das empresas informadas não existe.', 404);
		}

		const user = await this.prismaService.$transaction(async (trx) => {
			const password = generateRandomPassword();

			const user = await trx.user.create({
				data: {
					email: createUserDto.email,
					name: createUserDto.name,
					active: createUserDto.active,
					cpf: createUserDto.cpf,
					password: await hash(password, 10),
					companyId: createUserDto.userCompanies.at(0)?.id || null,
				},
			});

			const roleIds = createUserDto.userCompanies.reduce((acc, curr) => {
				acc.push(...curr.roleIds);
				return acc;
			}, []);

			await verifyIfUserIsSettingRestrictRole(roleIds, auth);
			await this.verifyIfUserIsSettingUserToMainCompany(createUserDto.userCompanies, auth);

			for (const userCompany of createUserDto.userCompanies) {
				await trx.userCompanies.create({
					data: {
						userId: user.id,
						companyId: userCompany.id,
						userCompaniesRoles: {
							createMany: {
								data: userCompany.roleIds.map((roleId) => ({ roleId })),
								skipDuplicates: true,
							},
						},
					},
				});
			}

			try {
				await this.mailerService.sendMail({
					subject: 'Criação de conta',
					to: user.email,
					payload: {
						template: 'account-created-by-admin',
						props: {
							convidado_por: auth.user.name,
							name: user.name,
							email: user.email,
							password,
							link: `${origin}/login`,
						},
					},
				});
			} catch (error) {
				console.log(error);
				throw new InternalServerErrorException('Erro ao enviar e-mail de confirmação.');
			}

			throw new HttpException('Cancelamento forçado.', 404);

			return user;
		});

		return new UserPresenter(user);
	}

	async findAll(params?: FindAllDto) {
		const query: Prisma.UserFindManyArgs = {
			include: {
				company: true,
				userCompanies: {
					include: {
						company: true,
						userCompaniesRoles: {
							include: {
								role: true,
							},
						},
					},
				},
			},
			where: {},
		};

		if (params.filter) {
			query.where.OR = [];
			query.where.OR.push({ name: { contains: params.filter } });
			query.where.OR.push({ email: { contains: params.filter } });
			if (Number(params.filter)) {
				query.where.OR.push({ id: { equals: Number(params.filter) } });
			}
		}

		if (params.companies) {
			const companies = params.companies.map((companyId) => Number(companyId));
			query.where.userCompanies = {
				some: {
					companyId: { in: companies.filter((c) => Number(c)) },
				},
			};
		}

		if (params.roles) {
			if (!query.where.userCompanies) query.where.userCompanies = {};
			query.where.userCompanies = {
				some: {
					userCompaniesRoles: {
						some: {
							roleId: { in: params.roles.map((roleId) => Number(roleId)) },
						},
					},
				},
			};
		}

		const result = await paginate<User, Prisma.UserFindManyArgs>(this.prismaService.user, query, {
			page: params?.page,
			rowsPerPage: params?.rowsPerPage,
			sortBy: params?.sortBy,
			descending: params?.descending,
		});

		return {
			...result,
			data: result.data.map((user) => new UserPresenter(user)),
		};
	}

	async findBy(findByDto: FindByDto) {
		const query: Prisma.UserFindFirstArgs = {
			include: { company: true },
		};

		if (findByDto.email) {
			query.where = { email: findByDto.email };
		}

		const user = await this.prismaService.user.findFirst(query);

		if (!user) {
			throw new HttpException('User not found', 404);
		}

		return new UserPresenter(user);
	}

	async findOne(id: number) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: { company: true },
		});

		if (!user) {
			throw new HttpException('User not found', 404);
		}

		return new UserPresenter(user);
	}

	async update(id: number, updateUserDto: UpdateUserDto, auth: AuthPresenter) {
		await this.findOne(id);

		if (updateUserDto.email) {
			const userByEmail = await this.prismaService.user.findFirst({
				where: { email: updateUserDto.email },
			});

			if (userByEmail && userByEmail.id !== id) {
				throw new HttpException('Já existe outro usuário com este e-mail.', 409);
			}
		}

		const user = await this.prismaService.$transaction(async (trx) => {
			const user = await trx.user.update({
				where: { id },
				include: { company: true },
				data: {
					name: updateUserDto.name,
					email: updateUserDto.email,
					active: updateUserDto.active,
					password: updateUserDto.password ? await hash(updateUserDto.password, 10) : undefined,
				},
			});

			const roleIds = updateUserDto.userCompanies.reduce((acc, curr) => {
				acc.push(...curr.roleIds);
				return acc;
			}, []);

			await verifyIfUserIsSettingRestrictRole(roleIds, auth);
			await this.verifyIfUserIsSettingUserToMainCompany(updateUserDto.userCompanies, auth);

			await trx.userCompanies.deleteMany({ where: { userId: user.id } });

			for (const userCompany of updateUserDto.userCompanies) {
				await trx.userCompanies.create({
					data: {
						userId: user.id,
						companyId: userCompany.id,
						userCompaniesRoles: {
							createMany: {
								data: userCompany.roleIds.map((roleId) => ({ roleId })),
								skipDuplicates: true,
							},
						},
					},
				});
			}

			if (!updateUserDto.userCompanies.map((item) => item.id).includes(user.company?.id)) {
				await trx.user.update({
					data: { companyId: updateUserDto.userCompanies.at(1)?.id || null },
					where: { id: user.id },
				});
			}

			return user;
		});

		return new UserPresenter(user);
	}

	async remove(id: number) {
		await this.findOne(id);

		const user = await this.prismaService.user.delete({
			where: { id },
			include: { company: true },
		});

		return new UserPresenter(user);
	}
}
