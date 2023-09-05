<template>
	<q-select
		:model-value="selected"
		:label="multiple ? 'Empresas' : 'Empresa'"
		:loading="isLoading"
		use-input
		:options="data"
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
					<q-item-label caption>{{ scope.opt.id }} - {{ scope.opt.cnpj }}</q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>

<script setup lang="ts">
import { Empresa } from '@/pages/Painel/AreaAdministrativa/Empresas/Empresas.types';

import { api } from '@/services/api';
import { ref } from 'vue';
import { useQuery } from 'vue-query';

defineEmits(['update:selected']);
defineProps<{
	selected: any;
	multiple?: boolean;
	readonly?: boolean;
}>();

const filter = ref('');

const { isLoading, data, refetch } = useQuery<Empresa[]>('select-empresas', async () => {
	const { status, data } = await api.get('/company', { params: { filter: filter.value } });

	if (status !== 200) {
		throw new Error('Erro ao buscar empresas');
	}

	return data.data;
});

function buscarEmpresas(str: string, update: any, abort: any) {
	filter.value = str;
	refetch.value().then(update).catch(abort);
}
</script>
