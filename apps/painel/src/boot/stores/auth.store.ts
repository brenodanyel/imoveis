import { defineStore } from 'pinia';

import { api } from '@/services/api';
import { HttpException } from '@/services/http-exception';

export type User = {
	id: number;
	name: string;
	cpf: string;
	email: string;

	company?: {
		id: number;
		name: string;
		cnpj: string;
		phone_number: string;
	};
};

export type Role = {
	id: number;
	name: string;
	slug: string;
};

type State = {
	user: User | null;
	roles: Role[];
};

export const useAuthStore = defineStore('auth', {
	state(): State {
		return {
			user: null,
			roles: [],
		};
	},
	actions: {
		async login(email: string, password: string) {
			const { status, data } = await api.post('/auth/login', { email, password });

			if (status !== 200) {
				HttpException(data);
				return false;
			}

			localStorage.setItem('imoveis:token', data.token);

			return this.validateToken();
		},

		async validateToken() {
			const token = localStorage.getItem('imoveis:token');

			if (!token) {
				return false;
			}

			const { status, data } = await api.get('/me');

			if (status !== 200) {
				HttpException(data);
				return false;
			}

			this.user = data.user;
			this.roles = data.roles;

			localStorage.setItem('imoveis:user', JSON.stringify(data.user));
			localStorage.setItem('sucatech:roles', JSON.stringify(data.roles));

			return true;
		},

		logout() {
			localStorage.removeItem('imoveis:token');
			localStorage.removeItem('imoveis:user');
			localStorage.removeItem('sucatech:roles');
			this.user = null;
			this.roles = [];
		},

		async alterarEmpresa(companyId: number) {
			const { status, data } = await api.post('/auth/switch-company', { companyId });

			if (status !== 200) {
				HttpException(data);
				return false;
			}

			localStorage.setItem('imoveis:token', data.token);

			return this.validateToken();
		},
	},
});
