<template>
	<div>
		<Title title="Área administrativa" icon="admin_panel_settings" />
		<div class="column q-gutter-sm no-wrap q-pa-sm">
			<q-card bordered>
				<q-tabs class="row" align="left">
					<q-route-tab
						v-for="item in items"
						:key="item.title"
						:to="item.to"
						class="q-px-md rounded-borders"
						active-class="text-primary"
						:icon="item.icon"
						:label="item.title"
					/>
				</q-tabs>
			</q-card>

			<div>
				<router-view v-slot="{ Component }">
					<component :is="Component" />
					<q-ajax-bar position="bottom" color="primary" size="0.3em" />
				</router-view>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';

import Title from '@/pages/Painel/Components/Title.vue';

import { acl } from '@/services/acl';

type Item = {
	to: RouteLocationRaw;
	title: string;
	icon: string;
	permission: keyof typeof acl.permissions;
};

let items: Item[] = [
	{
		to: { name: 'area-administrativa/usuarios' },
		title: 'Usuários',
		icon: 'groups',
		permission: 'area-administrativa.usuarios.access',
	},
	{
		to: { name: 'area-administrativa/empresas' },
		title: 'Empresas',
		icon: 'badge',
		permission: 'area-administrativa.empresas.access',
	},
	{
		to: { name: 'area-administrativa/planos' },
		title: 'Planos',
		icon: 'sell',
		permission: 'area-administrativa.planos.access',
	},
];

items = items.filter((item) => acl.hasPermission(item.permission));
</script>
