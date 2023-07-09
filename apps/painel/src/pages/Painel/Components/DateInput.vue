<template>
	<q-field :label="label" stack-label :readonly="readonly" :rules="[(v) => isValidDate(v) || 'Data inválida']" class="cursor-pointer">
		<template v-slot:control>
			<div>{{ formatted }}</div>
		</template>

		<template v-slot:append>
			<q-icon name="event" color="accent" />
		</template>

		<q-popup-proxy>
			<q-date v-model="input" mask="YYYY-MM-DD" flat transition-show="scale" transition-hide="scale" :disable="readonly">
				<div class="row items-center justify-end" v-if="!readonly">
					<q-btn v-close-popup label="Fechar" class="bg-primary text-white" />
				</div>
			</q-date>
		</q-popup-proxy>
	</q-field>
</template>

<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import { computed, ref, watch } from 'vue';

import { isValidDate } from '@/services/common.validators';
import { dayjs } from '@/services/dayjs';

const props = defineProps<{
	date: string;
	label?: string;
	readonly?: boolean;
}>();

const emit = defineEmits(['update:selected']);

const input = ref(dayjs(props.date).format('YYYY-MM-DD'));
const formatted = computed(() => dayjs(props.date).format('DD/MM/YYYY'));

watch(
	() => input.value,
	(value) => emit('update:selected', dayjs(value).toISOString()),
);
</script>
