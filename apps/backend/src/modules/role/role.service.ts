import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { ACLService } from '../../shared/acl.module';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { paginate } from '../../utils/pagination';
import { AuthPresenter } from '../auth/auth.presenter';
import { FindAllDto } from './dto/find-all.dto';
import { RolePresenter } from './role.presenter';

@Injectable()
export class RoleService {
	constructor(private readonly prismaService: PrismaService, private readonly aclService: ACLService) {}

	async findAll(auth: AuthPresenter, params?: FindAllDto) {
		const rolesRestrictToAdmin = ['admin_geral'];

		const query: Prisma.RoleFindManyArgs = {
			where: {
				slug: {
					notIn: [...rolesRestrictToAdmin].filter(() => !this.aclService.hasRole(auth, ['admin_geral'])),
				},
			},
		};

		if (params.filter) {
			query.where.OR = [];
			query.where.OR.push({ name: { contains: params.filter } });
			query.where.OR.push({ slug: { contains: params.filter } });
			if (Number(params.filter)) {
				query.where.OR.push({ id: { equals: Number(params.filter) } });
			}
		}

		const result = await paginate<Role, Prisma.RoleFindManyArgs>(this.prismaService.role, query, {
			page: params?.page,
			rowsPerPage: params?.rowsPerPage,
			descending: params?.descending,
			sortBy: params?.sortBy,
		});

		return {
			...result,
			data: result.data.map((role) => new RolePresenter(role)),
		};
	}
}
