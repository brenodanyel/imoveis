import { ForbiddenException, Global, Injectable, Module } from '@nestjs/common';
import { AuthPresenter } from '../modules/auth/auth.presenter';

export type actionName = keyof typeof ACLService.prototype.permissions;
type action = actionName | actionName[];

@Injectable()
export class ACLService {
	permissions = {
		'company.findAll': ['admin_geral'],
		'company.findById': ['admin_geral'],
		'company.create': ['admin_geral'],
		'company.update': ['admin_geral'],
		'company.remove': ['admin_geral'],

		'user.findAll': ['admin_geral'],
		'user.findById': ['admin_geral'],
		'user.create': ['admin_geral'],
		'user.update': ['admin_geral'],
		'user.remove': ['admin_geral'],

		'plan.findAll': ['admin_geral', 'admin'],
		'plan.findById': ['admin_geral'],
		'plan.create': ['admin_geral'],
		'plan.update': ['admin_geral'],
		'plan.remove': ['admin_geral'],
		'plan.list.private': ['admin_geral'],

		'my-company.update': ['admin', 'admin_geral'],
		'my-company.users.list': ['admin', 'admin_geral'],
		'my-company.users.remove': ['admin', 'admin_geral'],
		'my-company.users.update-roles': ['admin', 'admin_geral'],
		'my-company.users.attach': ['admin', 'admin_geral'],

		'my-company.plan.upgrade': ['admin', 'admin_geral'],

		'add-restrict-role-to-user': ['admin_geral'],
		'add-user-to-main-company': ['admin_geral'],
	};

	verifyPermission(action: action, auth: AuthPresenter, errorMessage?: string): boolean {
		if (Array.isArray(action)) {
			return action.some((action) => this.verifyPermission(action, auth)) || action.length === 0;
		}

		const allowedRoles = this.permissions[action];

		if (!allowedRoles) {
			throw new ForbiddenException('Ação desconhecida.');
		}

		const has = allowedRoles.some((slug) => auth.roles.some((role) => role.slug === slug));

		if (!has) {
			throw new ForbiddenException(errorMessage ?? 'Sem permissão.');
		}

		return true;
	}

	safeVerifyPermission(action: action, auth: AuthPresenter): boolean {
		try {
			return this.verifyPermission(action, auth);
		} catch (error) {
			return false;
		}
	}

	hasRole(auth: AuthPresenter, slug: string | string[]): boolean {
		if (Array.isArray(slug)) {
			return slug.some((slug) => this.hasRole(auth, slug)) || slug.length === 0;
		}

		return auth.roles.some((role) => role.slug === slug);
	}
}

@Global()
@Module({
	providers: [ACLService],
	exports: [ACLService],
})
export class ACLModule {}
