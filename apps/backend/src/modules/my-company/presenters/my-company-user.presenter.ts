import { RolePresenter } from '../../role/role.presenter';

export class MyCompanyUserPresenter {
	id: number;
	email: string;
	name: string;
	active: boolean;
	roles: RolePresenter[];

	constructor(user: any) {
		this.id = user.id;
		this.email = user.email;
		this.name = user.name;
		this.active = user.active;
		this.roles = user.userCompanies?.map((uc) => uc.userCompaniesRoles.map((ucr) => ucr.role)).reduce((acc, val) => acc.concat(val), []);
	}
}
