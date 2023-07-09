import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { MailerService } from '../../../shared/mailer/mailer.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { generateRandomPassword } from '../../../utils';
import { SignUpDTO } from '../dtos';

@Injectable()
export class SignUpUseCase {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService, //
	) {}

	async execute(data: SignUpDTO, origin: string) {
		await this.prismaService.$transaction(async (trx) => {
			const userExists = await trx.user.findFirst({ where: { OR: [{ email: data.user.email }, { cpf: data.user.cpf }] } });

			if (userExists) {
				throw new ConflictException('Já existe um usuário com este e-mail ou cpf.');
			}

			const companyExists = await trx.company.findFirst({ where: { OR: [{ cnpj: data.company.cnpj }, { name: data.company.name }] } });

			if (companyExists) {
				throw new ConflictException('Já existe uma empresa com este nome ou cnpj.');
			}

			const company = await trx.company.create({
				data: {
					name: data.company.name,
					cnpj: data.company.cnpj,
					phone_number: data.company.phone_number,
					active: false,
					companyAddress: {
						create: data.company.address,
					},
				},
			});

			const password = generateRandomPassword();

			const user = await trx.user.create({
				data: {
					name: data.user.name,
					cpf: data.user.cpf,
					email: data.user.email,
					password: await hash(password, 10),
					companyId: company.id,
					active: false,
				},
			});

			const freePlan = await trx.plan.findUnique({ where: { name: 'Teste gratuito' } });

			if (!freePlan) {
				throw new NotFoundException('Plano free não encontrado.');
			}

			await trx.companyPlan.create({
				data: {
					companyId: company.id,
					planId: freePlan.id,
					paidAt: dayjs().toISOString(),
					expiresAt: dayjs().add(7, 'day').toISOString(),
				},
			});

			const userCompany = await trx.userCompanies.create({ data: { companyId: company.id, userId: user.id } });

			const adminRole = await trx.role.findUnique({ where: { slug: 'admin' } });

			if (!adminRole) {
				throw new NotFoundException('Perfil admin não encontrado.');
			}

			await trx.userCompaniesRoles.create({ data: { userCompanyId: userCompany.id, roleId: adminRole.id } });

			const confirmationCode = await trx.confirmationCode.create({
				data: {
					token: this.jwtService.sign({ userId: user.id }),
				},
			});

			try {
				await this.mailerService.sendMail({
					subject: 'Confirmação de conta',
					to: data.user.email,
					payload: {
						template: 'confirm-account',
						props: {
							name: data.user.name,
							email: data.user.email,
							password,
							link: `${origin}/confirmar-cadastro?q=${confirmationCode.id}`,
						},
					},
				});
			} catch (error) {
				console.log(error);
				throw new InternalServerErrorException('Erro ao enviar e-mail de confirmação.');
			}
		});
	}
}
