<template>
	<q-select
		:model-value="selected"
		:label="multiple ? 'Perfis' : 'Perfil'"
		:loading="loading"
		use-input
		:options="roles"
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
					<q-item-label> {{ scope.opt.name }} </q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { api } from '@/services/api';

import { Role } from '../AreaAdministrativa/Usuarios/Usuarios.types';

defineEmits(['update:selected']);
defineProps<{
	selected: any;
	multiple?: boolean;
	readonly?: boolean;
}>();

const roles = ref<Role[]>([]);
const loading = ref(false);

async function buscarRoles(filter: string, update: any, abort: any) {
	loading.value = true;

	const { status, data } = await api.get('/role', { params: { filter } });

	loading.value = false;

	if (status !== 200) {
		abort();
		return;
	}

	roles.value = data.data;

	update();
}
</script>
