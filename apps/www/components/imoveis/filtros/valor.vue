<template>
	<div class="space-y-2">
		<div class="flex items-center justify-between gap-4">
			<div class="font-bold">De:</div>
			<CurrencyInput
				:options="{
					currency: 'BRL',
					hideCurrencySymbolOnFocus: false,
					hideGroupingSeparatorOnFocus: false,
					hideNegligibleDecimalDigitsOnFocus: false,
					autoDecimalDigits: true,
					useGrouping: true,
				}"
				type="text"
				v-model="filter.min_valor"
				class="px-4 py-2 border rounded-md"
			/>
		</div>

		<div class="flex items-center justify-between gap-4">
			<div class="font-bold">Até:</div>
			<CurrencyInput
				:options="{
					currency: 'BRL',
					hideCurrencySymbolOnFocus: false,
					hideGroupingSeparatorOnFocus: false,
					hideNegligibleDecimalDigitsOnFocus: false,
					autoDecimalDigits: true,
					useGrouping: true,
				}"
				type="text"
				v-model="filter.max_valor"
				class="px-4 py-2 border rounded-md"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Filtro } from '../../../types/anuncios';
defineProps<{ filter: Filtro }>();
</script>
