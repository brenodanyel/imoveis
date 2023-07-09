import { Empresa } from '../Empresas/Empresas.types';

export type Role = {
	id: number;
	name: string;
	slug: string;
};

export type UsuarioCompanies = {
	id: number;
	company: Empresa;
	roles: Role[];
};

export type Usuario = {
	id: number;
	name: string;
	email: string;
	cpf: string;
	company: Empresa;
	companies: UsuarioCompanies[];
	active?: boolean;
};

export type UsuarioWithPassword = Usuario & {
	password: string;
};
