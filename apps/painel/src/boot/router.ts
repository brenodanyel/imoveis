import { Notify } from 'quasar';
import { App } from 'vue';
import { RouteLocationRaw, createRouter, createWebHistory } from 'vue-router';

import { acl } from '@/services/acl';

import { useAuthStore } from './stores';

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '', redirect: (e) => (localStorage.getItem('imoveis:token') ? { name: 'inicio' } : { name: 'login' }) },
		{ path: '/login', name: 'login', component: () => import('@/pages/Login.vue') },
		{ path: '/cadastro', name: 'cadastro', component: () => import('@/pages/Cadastro.vue') },
		{
			path: '/confirmar-cadastro',
			name: 'confirmar-cadastro',
			component: () => import('@/pages/AceitarConvitePeloEmail.vue'),
			props: { icon: 'business', requestUrl: '/auth/confirm-account' },
		},
		{
			path: '/aceitar-convite-para-ativar-usuario',
			name: 'aceitar-convite-para-ativar-usuario',
			component: () => import('@/pages/AceitarConvitePeloEmail.vue'),
			props: { icon: 'account_circle', requestUrl: '/auth/accept-invite-and-activate-account' },
		},
		{
			path: '/aceitar-convite-de-empresa',
			name: 'aceitar-convite-de-empresa',
			component: () => import('@/pages/AceitarConvitePeloEmail.vue'),
			props: { icon: 'account_circle', requestUrl: '/auth/accept-invite-to-company' },
		},
		{
			path: '/',
			component: () => import('@/pages/Painel/PainelLayout.vue'),
			meta: { auth: ['inicio.access'] },
			children: [
				{ path: '', name: 'inicio', component: () => import('@/pages/Painel/Inicio/Index.vue'), meta: { auth: ['inicio.access'] } },
				{ path: 'anuncios', name: 'anuncios', component: () => import('@/pages/Painel/Anuncios/Index.vue'), meta: { auth: ['anuncios.access'] } },
				{ path: 'usuarios', name: 'usuarios', component: () => import('@/pages/Painel/Usuarios/Index.vue'), meta: { auth: ['usuarios.access'] } },
				{
					path: 'perfil',
					name: 'perfil',
					component: () => import('@/pages/Painel/Perfil/Index.vue'),
					redirect: { name: 'perfil/dados-pessoais' },
					meta: { auth: [] },
					children: [
						{
							path: 'dados-pessoais',
							name: 'perfil/dados-pessoais',
							component: () => import('@/pages/Painel/Perfil/DadosPessoais/Index.vue'),
							meta: { auth: [] },
						},
						{
							path: 'dados-da-empresa',
							name: 'perfil/dados-da-empresa',
							component: () => import('@/pages/Painel/Perfil/DadosDaEmpresa.vue'),
							meta: { auth: ['perfil.dados-da-empresa.access'] },
						},
						{
							path: 'plano-da-empresa',
							name: 'perfil/plano-da-empresa',
							component: () => import('@/pages/Painel/Perfil/PlanoDaEmpresa/Index.vue'),
							meta: { auth: ['perfil.plano-da-empresa.access'] },
						},
					],
				},
				{
					path: 'area-administrativa',
					component: () => import('@/pages/Painel/AreaAdministrativa/Index.vue'),
					meta: { auth: ['area-administrativa.access'] },
					children: [
						{
							path: '',
							redirect: { name: 'area-administrativa/usuarios' },
							meta: { auth: ['area-administrativa.access'] },
							name: 'area-administrativa',
						},
						{
							path: 'usuarios',
							component: () => import('@/pages/Painel/AreaAdministrativa/Usuarios/Index.vue'),
							meta: { auth: ['area-administrativa.usuarios.access'] },
							name: 'area-administrativa/usuarios',
						},
						{
							path: 'empresas',
							component: () => import('@/pages/Painel/AreaAdministrativa/Empresas/Index.vue'),
							meta: { auth: ['area-administrativa.empresas.access'] },
							name: 'area-administrativa/empresas',
						},
						{
							path: 'planos',
							component: () => import('@/pages/Painel/AreaAdministrativa/Planos/Index.vue'),
							meta: { auth: ['area-administrativa.planos.access'] },
							name: 'area-administrativa/planos',
						},
					],
				},
			],
		},
		{ path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFound.vue') },
	],
});

router.beforeEach(async (to, from, next) => {
	const { auth } = to.meta;

	if (!auth) {
		return next();
	}

	const previousPath = from.fullPath;
	const nextPath = to.fullPath;

	let target: RouteLocationRaw = {
		path: nextPath === previousPath || previousPath === '/' ? '/login' : previousPath,
		query: { redirect: nextPath !== '/' ? nextPath : undefined },
	};

	try {
		const authStore = useAuthStore();

		if (!localStorage.getItem('imoveis:token')) {
			throw new Error('Sessão expirada!');
		}

		if (!authStore.user) {
			const localStorageUser = localStorage.getItem('imoveis:user');
			const localStorageRoles = localStorage.getItem('sucatech:roles');

			const storedUser = localStorageUser && JSON.parse(localStorageUser);
			const storedRoles = localStorageRoles && JSON.parse(localStorageRoles);

			if (storedUser && storedRoles) {
				authStore.user = storedUser;
				authStore.roles = storedRoles;
				authStore.validateToken();
			} else {
				await authStore.validateToken();
			}
		}

		for (const permission of auth) {
			if (!acl.hasPermission(permission)) {
				target = { name: 'inicio' };
				throw new Error();
			}
		}

		next();
	} catch (e) {
		Notify.create({
			message: e instanceof Error && e.message ? e.message : 'Você não tem permissão para acessar essa página',
			type: 'negative',
		});

		next(target);
	}
});

declare module 'vue-router' {
	interface RouteMeta {
		auth?: Array<keyof typeof acl.permissions>;
	}
}

export function setup(app: App) {
	app.use(router);
}
