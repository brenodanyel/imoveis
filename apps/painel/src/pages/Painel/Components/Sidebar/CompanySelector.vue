<template>
	<q-select
		v-model="empresaAtual"
		:options="empresas"
		option-value="id"
		:option-label="(item) => item.company?.name"
		@update:model-value="confirmarAlteracaoEmpresa"
		:loading="loading"
		style="border-radius: 4px; overflow: hidden"
	>
		<template v-slot:selected-item="scope">
			<q-item v-bind="scope.opt">
				<q-item-section avatar>
					<q-icon name="business" />
				</q-item-section>

				<q-item-section>
					<q-item-label>
						{{ scope.opt.company?.name || 'Carregando...' }}
					</q-item-label>
					<q-item-label caption>
						{{ scope.opt.company ? scope.opt.company.id + ' - ' + formatCNPJ(scope.opt.company.cnpj) : 'Carregando...' }}
					</q-item-label>
				</q-item-section>
			</q-item>
		</template>

		<template v-slot:option="scope">
			<q-item v-bind="scope.itemProps">
				<q-item-section avatar>
					<q-icon name="business" />
				</q-item-section>
				<q-item-section>
					<q-item-label>
						{{ scope.opt.company.name }}
					</q-item-label>
					<q-item-label caption> {{ scope.opt.company.id }} - {{ formatCNPJ(scope.opt.company.cnpj) }} </q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>

<script setup lang="ts">
import { QSelect, useQuasar } from 'quasar';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { formatCNPJ } from '@/services';
import { api } from '@/services/api';
import { HttpException } from '@/services/http-exception';

import { useAuthStore } from '@/boot/stores';

import { Empresa } from '../../AreaAdministrativa/Empresas/Empresas.types';
import DialogConfirmarTrocaPerfil from '../DialogConfirmarTrocaPerfil.vue';

const emit = defineEmits(['onSelectCompany']);

const $q = useQuasar();
const $router = useRouter();
const $authStore = useAuthStore();

type Role = {
	id: number;
	name: string;
	slug: string;
};

type UsuarioEmpresa = {
	company: Empresa;
	roles: Role[];
};

const empresas = ref<UsuarioEmpresa[]>([]);
const empresaAtual = ref<UsuarioEmpresa>({
	company: $authStore.user?.company,
	roles: [],
} as UsuarioEmpresa);
const empresaAnterior = ref<UsuarioEmpresa>({} as UsuarioEmpresa);

const loading = ref(false);

async function buscarEmpresas() {
	loading.value = true;

	const { status, data } = await api.get('/me/companies');

	loading.value = false;

	if (status !== 200) {
		HttpException(data);
		return;
	}

	empresas.value = data;

	const found = empresas.value.find((empresa) => empresa.company.id === $authStore.user?.company?.id);
	if (found) empresaAtual.value = found;
}

function confirmarAlteracaoEmpresa(value: UsuarioEmpresa) {
	emit('onSelectCompany');

	const dialog = $q.dialog({
		component: DialogConfirmarTrocaPerfil,
		componentProps: {
			empresa: value.company,
			perfis: value.roles.map((role) => role.name).join(', '),
			loading: false,
		},
	});

	dialog.onCancel(() => {
		empresaAtual.value = empresaAnterior.value;
	});

	dialog.onOk(async () => {
		dialog.update({ loading: true });

		const success = await $authStore.alterarEmpresa(value.company.id);

		dialog.update({ loading: false });

		if (!success) return;

		dialog.hide();

		$router.go(0);

		$q.notify({ message: 'Empresa alterada com sucesso!', type: 'positive' });
	});
}

onMounted(buscarEmpresas);

watch(empresaAtual, (_value, old) => {
	empresaAnterior.value = old;
});
</script>
