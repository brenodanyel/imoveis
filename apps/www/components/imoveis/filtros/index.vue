<template>
	<div class="relative h-full space-y-2">
		<Expandable label="Propósito">
			<ImoveisFiltrosPropositos :filter="filter" />
		</Expandable>
		<Expandable label="Tipos de imóvel">
			<input class="w-full rounded-md border px-4 py-2" />
		</Expandable>
		<Expandable label="Faixa de preço">
			<input class="w-full rounded-md border px-4 py-2" />
		</Expandable>
		<Expandable label="Comodidades">
			<input class="w-full rounded-md border px-4 py-2" />
		</Expandable>

		<div class="absolute bottom-5 left-0 w-full">
			<button
				class="w-full bg-blue-500 hover:bg-blue-700 duration-200 px-4 py-2 rounded-md text-white font-medium"
				@click="$emit('apply-filter')"
				:disable="loading"
				:class="loading && ['opacity-50 cursor-not-allowed']"
			>
				<div class="flex justify-center items-center gap-2">
					<template v-if="loading">
						<i class="bi bi-arrow-clockwise animate-spin"></i>
						<span>Aplicando filtros</span>
					</template>

					<template v-else>
						<i class="bi bi-check-circle"></i>
						<span>Aplicar filtros</span>
					</template>
				</div>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Filtro } from '../../../types/anuncios';

defineEmits(['apply-filter']);

defineProps<{
	filter: Filtro;
	loading: boolean;
}>();
</script>
