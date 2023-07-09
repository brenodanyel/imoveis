<template>
	<select class="select select-bordered w-full px-4 py-2 border rounded-md" v-model="filter.proposito">
		<option v-for="proposito in propositos" :key="proposito.label" :value="proposito.value" :selected="filter.proposito === proposito.value">
			{{ proposito.label }}
		</option>
	</select>
</template>

<script setup lang="ts">
import { Filtro } from '../../../types/anuncios';

defineProps<{
	filter: Filtro;
}>();

const propositos = [
	{ value: null, label: 'Todos' },
	{ value: 'Venda', label: 'Venda' },
	{ value: 'Aluguel', label: 'Aluguel' },
	{ value: 'Aluguel por temporada', label: 'Aluguel por temporada' },
];
</script>
