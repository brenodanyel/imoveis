import { CompanyPresenter } from '../company/entities/company.presenter';

export class UserPresenter {
	id: number;
	email: string;
	name: string;
	cpf: string;
	createdAt: string;
	updatedAt?: string;
	active?: boolean;
	company?: CompanyPresenter;
	companies?: (CompanyPresenter | null)[] | null;

	constructor(user: any) {
		this.id = user.id;
		this.email = user.email;
		this.cpf = user.cpf;
		this.name = user.name;
		this.active = user.active;

		if (user.company) {
			this.company = new CompanyPresenter(user.company);
		}

		this.companies = user.userCompanies?.map((uc) => {
			return {
				id: uc.id,
				company: uc.company ? new CompanyPresenter(uc.company) : null,
				roles: uc.userCompaniesRoles?.map((ucr) => ucr.role) || [],
			};
		});
	}
}
