<template>
	<div class="column no-wrap justify-between full-height">
		<div>
			<div class="column no-wrap q-gutter-sm">
				<router-link to="/" style="text-decoration: none">
					<div class="row justify-center no-wrap">
						<Logo :small="!expanded" />
					</div>
				</router-link>

				<q-separator />

				<q-btn
					:icon="expanded ? 'keyboard_arrow_left' : 'keyboard_arrow_right'"
					:label="expanded ? 'Minimizar menu' : ''"
					class="text-grey-7"
					@click="emit('onToggle')"
				/>

				<q-separator />

				<div>
					<template v-for="(section, index) in sections" key="section.name">
						<div class="text-grey-7" v-if="expanded">{{ section.name }}</div>

						<q-list class="column q-gutter-xs justify-between q-py-sm full-weight">
							<template v-for="item of section.children" :key="item.key">
								<q-item @click="item.action" clickable :exact="item.exact" :to="item.to" class="rounded-borders" :dense="$q.screen.lt.md">
									<q-item-section avatar>
										<q-icon :name="item.icon" />
									</q-item-section>
									<q-item-section>{{ item.label }}</q-item-section>
									<q-tooltip v-if="!expanded" anchor="center right" self="center left" :offset="[10, 10]">
										{{ item.label }}
									</q-tooltip>
								</q-item>
							</template>
						</q-list>

						<q-separator spaced v-if="index !== sections.length - 1" />
					</template>
				</div>
			</div>
		</div>

		<ProfileDropdown :expanded="expanded" />
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { acl } from '@/services/acl';

import Logo from '@/components/Logo.vue';

import ProfileDropdown from './ProfileDropdown.vue';

const emit = defineEmits(['onToggle']);
defineProps<{
	expanded: boolean;
}>();

const $router = useRouter();

const sections = [
	{
		name: 'Navegação',
		children: [
			{
				icon: 'bi-pie-chart-fill',
				label: 'Dashboard',
				exact: true,
				to: { name: 'inicio' },
				hide: !acl.hasPermission('inicio.access'),
				action: () => $router.push({ name: 'inicio' }),
			},
			{
				icon: 'real_estate_agent',
				label: 'Meus Anúncios',
				exact: false,
				to: { name: 'anuncios' },
				hide: !acl.hasPermission('anuncios.access'),
				action: () => $router.push({ name: 'anuncios' }),
			},
			{
				icon: 'bi-person-fill-gear',
				label: 'Usuários',
				exact: false,
				to: { name: 'usuarios' },
				hide: !acl.hasPermission('usuarios.access'),
				action: () => $router.push({ name: 'usuarios' }),
			},
		].filter((item) => !item.hide),
	},
	{
		name: 'Restrito',
		children: [
			{
				icon: 'admin_panel_settings',
				label: 'Área administrativa',
				exact: false,
				to: { name: 'area-administrativa' },
				hide: !acl.hasPermission('area-administrativa.access'),
				action: () => $router.push({ name: 'area-administrativa' }),
			},
		].filter((item) => !item.hide),
	},
].filter((section) => section.children.length > 0);
</script>
