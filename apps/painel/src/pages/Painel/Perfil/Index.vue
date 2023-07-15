<template>
	<div>
		<Title title="Meu perfil" icon="person" />

		<div class="column no-wrap">
			<q-splitter v-model="splitter" unit="%" :horizontal="$q.screen.lt.md">
				<template v-slot:before>
					<q-tabs :vertical="!$q.screen.lt.sm" no-caps>
						<q-route-tab :to="{ name: 'perfil/dados-pessoais' }" label="Dados pessoais" icon="person" />
						<q-route-tab
							:to="{ name: 'perfil/dados-da-empresa' }"
							label="Dados da empresa"
							icon="badge"
							v-if="acl.hasPermission('perfil.dados-da-empresa.access') && $authStore.user?.company"
						/>
						<q-route-tab
							:to="{ name: 'perfil/plano-da-empresa' }"
							label="Plano da empresa"
							icon="sell"
							v-if="acl.hasPermission('perfil.plano-da-empresa.access') && $authStore.user?.company"
						/>
					</q-tabs>
				</template>
				<template v-slot:after>
					<router-view v-slot="{ Component }">
						<transition name="fade" mode="out-in">
							<component :is="Component" />
						</transition>
					</router-view>
				</template>
			</q-splitter>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { useAuthStore } from '@/boot/stores';
import Title from '@/pages/Painel/Components/Title.vue';
import { acl } from '@/services/acl';

const $q = useQuasar();
const $authStore = useAuthStore();

const splitter = ref(15);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: 100ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
