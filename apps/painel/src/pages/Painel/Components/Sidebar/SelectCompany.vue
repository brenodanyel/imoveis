<template>
	<q-select
		:model-value="selected"
		:label="multiple ? 'Empresas' : 'Empresa'"
		:loading="loading"
		use-input
		:options="companies"
		option-label="name"
		@filter="buscarEmpresas"
		@update:model-value="$emit('update:selected', $event)"
		@clear="$emit('update:selected', multiple ? [] : null)"
		clearable
		:multiple="multiple"
		:readonly="readonly"
	>
		<template v-slot:prepend>
			<q-icon name="business" color="primary" />
		</template>
		<template v-slot:option="scope">
			<q-item v-bind="scope.itemProps">
				<q-item-section avatar>
					<q-icon name="business" color="primary" />
				</q-item-section>
				<q-item-section>
					<q-item-label>
						{{ scope.opt.name }}
					</q-item-label>
					<q-item-label caption> {{ scope.opt.id }} - {{ scope.opt.cnpj }} </q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { Empresa } from '@/pages/Painel/AreaAdministrativa/Empresas/Empresas.types';

import { api } from '@/services/api';

defineEmits(['update:selected']);
defineProps<{
	selected: any;
	multiple?: boolean;
	readonly?: boolean;
}>();

const companies = ref<Empresa[]>([]);
const loading = ref(false);

async function buscarEmpresas(filter: string, update: any, abort: any) {
	loading.value = true;

	const { status, data } = await api.get('/company', { params: { filter } });

	loading.value = false;

	if (status !== 200) {
		abort();
		return;
	}

	companies.value = data.data;

	update();
}
</script>
