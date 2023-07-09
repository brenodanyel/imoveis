<template>
	<q-btn>
		<div class="row items-center q-gutter-md no-wrap">
			<q-icon name="bi-person-fill" />
			<span v-if="expanded" class="text-weight-thin">{{ $authStore.user?.name }}</span>
		</div>

		<q-popup-proxy>
			<q-card bordered style="min-width: 20em; max-width: 50em">
				<div class="q-pa-md column no-wrap q-gutter-sm">
					<div>
						<div class="text-h6">{{ $authStore.user?.name }}</div>
						<div class="text-caption">{{ $authStore.user?.email }}</div>
						<div class="text-caption">{{ $authStore.roles?.map((r) => r.name).join(', ') }}</div>
					</div>

					<q-separator />

					<CompanySelector />

					<q-separator />

					<div>
						<q-list class="column q-gutter-xs no-wrap justify-between q-py-sm full-weight">
							<q-item v-for="item of items" clickable @click="item.action" class="rounded-borders">
								<q-item-section avatar>
									<q-icon :name="item.icon" />
								</q-item-section>
								<q-item-section>{{ item.label }}</q-item-section>
							</q-item>
						</q-list>
					</div>
				</div>
			</q-card>
		</q-popup-proxy>
	</q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/boot/stores';
import { useAppStore } from '@/boot/stores';

import CompanySelector from './CompanySelector.vue';

defineProps<{
	expanded: boolean;
}>();

const $appStore = useAppStore();
const $authStore = useAuthStore();
const $router = useRouter();

const items = computed(() => [
	{
		icon: $appStore.dark ? 'light_mode' : 'dark_mode',
		label: $appStore.dark ? 'Modo claro' : 'Modo escuro',
		action: () => $appStore.setDark(!$appStore.dark),
	},
	{
		icon: 'person',
		label: 'Meus dados',
		action: () => $router.push({ name: 'perfil' }),
	},
	{
		icon: 'logout',
		label: 'Logout',
		action: () => {
			$authStore.logout();
			$router.push('/login');
		},
	},
]);
</script>
