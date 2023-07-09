import { Plano } from '../Planos/Plano.types';

export type Empresa = {
	id: number;
	name: string;
	phone_number: string;
	cnpj: string;
	address?: Address | null;
	companyPlan?: CompanyPlan | null;
};

type Address = {
	city: string;
	complement: string;
	country: string;
	district: string;
	number: string;
	state: string;
	street: string;
	zipCode: string;
};

type CompanyPlan = {
	expiresAt: string;
	paidAt: string;
	plan: Plano;
};
