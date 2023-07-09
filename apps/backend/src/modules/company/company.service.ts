import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { isMainCompany } from '../../utils';
import { paginate } from '../../utils/pagination';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyPresenter } from './entities/company.presenter';

@Injectable()
export class CompanyService {
	constructor(private prismaService: PrismaService) {}

	async create(createCompanyDto: CreateCompanyDto) {
		const companyExists = await this.prismaService.company.findFirst({
			where: { OR: [{ name: createCompanyDto.name }, { cnpj: createCompanyDto.cnpj }] },
		});

		if (companyExists) {
			throw new HttpException('Já existe uma empresa com este nome ou CNPJ.', 409);
		}

		const query: Prisma.CompanyCreateArgs = {
			data: {
				name: createCompanyDto.name,
				cnpj: createCompanyDto.cnpj,
				phone_number: createCompanyDto.phone_number,

				companyAddress: {
					create: { ...createCompanyDto.address },
				},
			},
		};

		if (createCompanyDto.companyPlan) {
			if (dayjs(createCompanyDto.companyPlan.expiresAt).isBefore(dayjs(createCompanyDto.companyPlan.paidAt))) {
				throw new BadRequestException('A data de expiração não pode ser menor que a data de pagamento.');
			}

			if (dayjs(createCompanyDto.companyPlan.expiresAt).isBefore(dayjs())) {
				throw new BadRequestException('A data de expiração não pode ser menor que a data atual.');
			}

			const plan = await this.prismaService.plan.findUnique({ where: { id: createCompanyDto.companyPlan.planId } });

			if (!plan) {
				throw new BadRequestException('Plano não encontrado.');
			}

			query.data.companyPlan = {
				create: {
					paidAt: createCompanyDto.companyPlan.paidAt,
					expiresAt: createCompanyDto.companyPlan.expiresAt,
					planId: createCompanyDto.companyPlan.planId,
				},
			};
		}

		const company = await this.prismaService.company.create(query);

		return new CompanyPresenter(company);
	}

	async findAll(params?: FindAllDto) {
		const query: Prisma.CompanyFindManyArgs = {
			where: {},
		};

		if (params?.includeAddress) {
			if (!query.include) query.include = {};
			query.include.companyAddress = true;
		}

		if (params?.includePlan) {
			if (!query.include) query.include = {};
			query.include.companyPlan = {
				include: {
					plan: true,
				},
			};
		}

		if (params?.filter) {
			query.where.OR = [];
			query.where.OR.push({ name: { contains: params.filter, mode: 'insensitive' } });
			query.where.OR.push({ cnpj: { equals: params.filter } });
			if (Number(params.filter)) {
				query.where.OR.push({ id: { equals: Number(params.filter) } });
			}
		}

		if (params?.plans) {
			query.where.companyPlan = { planId: { in: params.plans.map((plan) => Number(plan)) } };
		}

		const result = await paginate<Company, Prisma.CompanyFindManyArgs>(this.prismaService.company, query, {
			page: params?.page,
			rowsPerPage: params?.rowsPerPage,
			descending: params?.descending,
			sortBy: params?.sortBy,
		});

		return {
			...result,
			data: result.data.map((company) => new CompanyPresenter(company)),
		};
	}

	async findOne(id: number) {
		const company = await this.prismaService.company.findUnique({
			where: { id },
		});

		if (!company) {
			throw new HttpException('Empresa não encontrada.', 404);
		}

		return new CompanyPresenter(company);
	}

	async update(id: number, updateCompanyDto: UpdateCompanyDto) {
		await this.findOne(id);

		if (updateCompanyDto.name) {
			const companyExists = await this.prismaService.company.findFirst({
				where: { OR: [{ name: updateCompanyDto.name }, { cnpj: updateCompanyDto.cnpj }] },
			});

			if (companyExists && companyExists.id !== id) {
				throw new HttpException('Já existe uma outra empresa com este nome ou CNPJ.', 409);
			}
		}

		if (await isMainCompany(id)) {
			updateCompanyDto.cnpj = undefined;
		}

		const query: Prisma.CompanyUpdateArgs = {
			where: { id },
			data: {
				name: updateCompanyDto.name,
				cnpj: updateCompanyDto.cnpj,
				phone_number: updateCompanyDto.phone_number,
				companyAddress: {
					upsert: {
						create: { ...updateCompanyDto.address },
						update: { ...updateCompanyDto.address },
					},
				},
			},
		};

		if (updateCompanyDto.companyPlan) {
			const plan = await this.prismaService.plan.findUnique({ where: { id: updateCompanyDto.companyPlan.planId } });

			if (!plan) {
				throw new BadRequestException('Plano não encontrado.');
			}

			query.data.companyPlan = {
				upsert: {
					create: {
						paidAt: updateCompanyDto.companyPlan.paidAt,
						expiresAt: updateCompanyDto.companyPlan.expiresAt,
						planId: updateCompanyDto.companyPlan.planId,
					},
					update: {
						paidAt: updateCompanyDto.companyPlan.paidAt,
						expiresAt: updateCompanyDto.companyPlan.expiresAt,
						planId: updateCompanyDto.companyPlan.planId,
					},
				},
			};
		}

		if (updateCompanyDto.companyPlan === null) {
			query.data.companyPlan = { delete: true };
		}

		const company = await this.prismaService.company.update(query);

		return new CompanyPresenter(company);
	}

	async remove(id: number) {
		await this.findOne(id);

		const company = await this.prismaService.company.delete({
			where: { id },
		});

		return new CompanyPresenter(company);
	}
}
