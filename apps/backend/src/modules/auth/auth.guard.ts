import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	SetMetadata,
	UnauthorizedException,
	UseGuards,
	applyDecorators,
	createParamDecorator,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ACLService, actionName } from '../../shared/acl.module';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserPresenter } from '../user/user.presenter';
import { AuthPresenter } from './auth.presenter';

export function GuardRoute(...actions: actionName[]) {
	return applyDecorators(
		SetMetadata('actions', actions),
		UseGuards(AuthGuard, ActionGuard), //
	);
}

export const Auth = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.auth;
});

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new ForbiddenException();
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.getOrThrow<string>('JWT_SECRET'),
			});

			const auth = await this.getAuth(payload.id);

			request['auth'] = auth;
		} catch (e) {
			throw new ForbiddenException(e instanceof ForbiddenException ? e.message : 'Token inválido.');
		}

		return true;
	}

	private async getAuth(userId: number) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
			include: { company: true },
		});

		if (!user) {
			throw new ForbiddenException('Usuário não encontrado.');
		}

		if (!user.active) {
			throw new ForbiddenException('Este usuário está inativo.');
		}

		if (!user.companyId) {
			throw new ForbiddenException('Este usuário não está vinculado a nenhuma empresa.');
		}

		const userCompany = await this.prismaService.userCompanies.findFirst({
			where: { userId: user.id, companyId: user.companyId },
			include: {
				userCompaniesRoles: {
					include: { role: true },
				},
			},
		});

		let roles = [];

		if (userCompany) {
			roles = userCompany.userCompaniesRoles.map((ucr) => ucr.role);
		}

		return new AuthPresenter({ user: new UserPresenter(user), roles });
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}

@Injectable()
class ActionGuard implements CanActivate {
	constructor(
		private readonly aclService: ACLService, //
	) {}

	canActivate(context: ExecutionContext): boolean {
		const actions = Reflect.getMetadata('actions', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const { auth } = request;

		if (!auth) {
			throw new UnauthorizedException('Sem request auth.');
		}

		return this.aclService.verifyPermission(actions, auth);
	}
}
