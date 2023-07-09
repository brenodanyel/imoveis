import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Plan, Prisma } from '@prisma/client';
import { ACLService } from '../../shared/acl.module';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { paginate } from '../../utils/pagination';
import { AuthPresenter } from '../auth/auth.presenter';
import { CreatePlanDto } from './dto/create-plan.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanPresenter } from './plan.presenter';

@Injectable()
export class PlanService {
	constructor(private readonly prismaService: PrismaService, private readonly aclService: ACLService) {}

	async create(createPlanDto: CreatePlanDto) {
		const planExists = await this.prismaService.plan.findFirst({ where: { name: createPlanDto.name } });

		if (planExists) {
			throw new ConflictException('Já existe um plano com este nome.');
		}

		const plan = await this.prismaService.plan.create({
			data: {
				name: createPlanDto.name,
				price: createPlanDto.price,
				public: createPlanDto.public,

				limit_users: createPlanDto.limit_users,
			},
		});

		return new PlanPresenter(plan);
	}

	async findAll(auth: AuthPresenter, params?: FindAllDto) {
		const query: Prisma.PlanFindManyArgs = {
			where: {},
		};

		if (params?.filter) {
			query.where.OR = [];
			query.where.OR.push({ name: { contains: params.filter } });
		}

		if (params.active) {
			query.where.active = params.active === 'true';
		}

		if (params.public) {
			query.where.public = params.public === 'true';
		}

		if (!this.aclService.safeVerifyPermission('plan.list.private', auth)) {
			query.where.public = true;
		}

		const result = await paginate<Plan, Prisma.PlanFindManyArgs>(this.prismaService.plan, query, {
			page: params?.page,
			rowsPerPage: params?.rowsPerPage,
			descending: params?.descending,
			sortBy: params?.sortBy,
		});

		return {
			...result,
			data: result.data.map((plan) => new PlanPresenter(plan)),
		};
	}

	async findOne(id: number) {
		const plan = await this.prismaService.plan.findUnique({ where: { id } });

		if (!plan) {
			throw new NotFoundException('Plano não encontrado.');
		}

		return new PlanPresenter(plan);
	}

	async update(id: number, updatePlanDto: UpdatePlanDto) {
		await this.findOne(id);

		if (updatePlanDto.name) {
			const planExists = await this.prismaService.plan.findFirst({
				where: {
					AND: [{ name: updatePlanDto.name }, { id: { not: id } }],
				},
			});

			if (planExists) {
				throw new ConflictException('Já existe um plano com este nome.');
			}
		}

		const plan = await this.prismaService.plan.update({
			where: { id },
			data: {
				name: updatePlanDto.name,
				price: updatePlanDto.price,
				public: updatePlanDto.public,
				active: updatePlanDto.active,

				limit_users: updatePlanDto.limit_users,
			},
		});

		return new PlanPresenter(plan);
	}

	async remove(id: number) {
		await this.findOne(id);

		const plan = await this.prismaService.plan.delete({ where: { id } });

		return new PlanPresenter(plan);
	}
}
