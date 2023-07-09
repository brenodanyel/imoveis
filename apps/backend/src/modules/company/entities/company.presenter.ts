import { CompanyAddressPresenter } from './company-address.presenter';
import { CompanyPlanPresenter } from './company-plan.presenter';

export class CompanyPresenter {
	id: number;
	name: string;
	cnpj: string;
	phone_number: string;
	address?: CompanyAddressPresenter;
	companyPlan?: any;

	constructor(company: any) {
		this.id = company.id;
		this.name = company.name;
		this.cnpj = company.cnpj;
		this.phone_number = company.phone_number;

		if (company.companyAddress) this.address = new CompanyAddressPresenter(company.companyAddress);
		if (company.companyPlan) this.companyPlan = new CompanyPlanPresenter(company.companyPlan);
	}
}
