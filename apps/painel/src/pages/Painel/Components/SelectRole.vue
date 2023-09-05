<template>
	<q-select
		:model-value="selected"
		:label="multiple ? 'Perfis' : 'Perfil'"
		:loading="isLoading"
		use-input
		:options="data"
		option-label="name"
		@filter="buscarRoles"
		@update:model-value="$emit('update:selected', $event)"
		@clear="$emit('update:selected', multiple ? [] : null)"
		clearable
		:multiple="multiple"
		:readonly="readonly"
	>
		<template v-slot:prepend>
			<q-icon name="security" color="primary" />
		</template>
		<template v-slot:option="scope">
			<q-item v-bind="scope.itemProps">
				<q-item-section avatar>
					<q-icon name="security" color="primary" />
				</q-item-section>
				<q-item-section>
					<q-item-label>{{ scope.opt.name }}</q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>

<script setup lang="ts">
import { api } from '@/services/api';

import { ref } from 'vue';
import { useQuery } from 'vue-query';
import { Role } from '../AreaAdministrativa/Usuarios/Usuarios.types';

defineEmits(['update:selected']);
defineProps<{
	selected: any;
	multiple?: boolean;
	readonly?: boolean;
}>();

const filter = ref('');

const { isLoading, data, refetch } = useQuery<Role[]>('select-roles', async () => {
	const { status, data } = await api.get('/role', { params: { filter: filter.value } });

	if (status !== 200) {
		throw new Error('Erro ao buscar perfis');
	}

	return data.data;
});

function buscarRoles(str: string, update: any) {
	if (str.trim().length < 2) return update();
	filter.value = str;
	refetch.value().then(update).catch(update);
}
</script>
