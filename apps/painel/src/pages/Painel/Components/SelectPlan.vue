<template>
	<q-select
		:model-value="selected"
		:label="multiple ? 'Planos' : 'Plano'"
		:loading="loading"
		use-input
		:options="plans"
		option-label="name"
		@filter="buscarPlans"
		@update:model-value="$emit('update:selected', $event)"
		@clear="$emit('update:selected', multiple ? [] : null)"
		clearable
		:multiple="multiple"
		:readonly="readonly"
		:emit-value="emitValue"
		:map-options="mapOptions"
	>
		<template v-slot:prepend>
			<q-icon name="sell" color="primary" />
		</template>

		<template v-slot:append>
			<slot name="append" />
		</template>

		<template v-slot:option="scope">
			<q-item v-bind="scope.itemProps">
				<q-item-section avatar>
					<q-icon name="sell" color="primary" />
				</q-item-section>
				<q-item-section>
					<q-item-label> {{ scope.opt.name }} </q-item-label>
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</template>

<script setup lang="ts">
import { QSelectProps } from 'quasar';
import { ref } from 'vue';

import { api } from '@/services/api';

import { Plano } from '../AreaAdministrativa/Planos/Plano.types';

defineEmits(['update:selected']);
defineProps<
	{
		selected: any;
	} & Omit<QSelectProps, 'modelValue'>
>();
defineSlots<{
	append(props: {}): any;
}>();

const plans = ref<Plano[]>([]);
const loading = ref(false);

async function buscarPlans(filter: string, update: any, abort: any) {
	loading.value = true;

	const { status, data } = await api.get('/plan', {
		params: {
			filter,
		},
	});

	loading.value = false;

	if (status !== 200) {
		abort();
		return;
	}

	plans.value = data.data;

	update();
}
</script>
