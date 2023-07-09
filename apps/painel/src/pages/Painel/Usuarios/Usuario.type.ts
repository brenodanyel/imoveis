export type Usuario = {
	id: number;
	email: string;
	cpf: string;
	name: string;
	active: boolean;
	roles: Role[];
};

export type Role = {
	id: number;
	name: string;
	slug: string;
};
