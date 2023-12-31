import axios from 'axios';

import { useAuthStore } from '@/boot/stores';

import { router } from '../boot/router';

export const api = axios.create({
	baseURL: import.meta.env.DEV ? 'http://localhost:3000' : 'https://imoveis-backend.vercel.app/',
	validateStatus: () => true,
});

api.interceptors.request.use(async (request) => {
	const token = localStorage.getItem('imoveis:token');

	if (token) {
		request.headers.Authorization = `Bearer ${token}`;
	}

	// await new Promise((resolve) => setTimeout(resolve, 2000));

	return request;
});

api.interceptors.response.use((response) => {
	if (response.status === 403) {
		setTimeout(() => {
			const store = useAuthStore();
			store.logout();
			router.push('/login');
		}, 100);
	}

	return response;
});
