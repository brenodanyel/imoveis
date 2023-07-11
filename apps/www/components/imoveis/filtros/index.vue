<template>
	<div class="relative h-full space-y-2">
		<Expandable label="Propósito">
			<ImoveisFiltrosPropositos :filter="filter" />
		</Expandable>

		<Expandable label="Tipos de imóvel">
			<ImoveisFiltrosTipos :filter="filter" />
		</Expandable>

		<Expandable label="Faixa de preço">
			<ImoveisFiltrosValor :filter="filter" />
		</Expandable>

		<Expandable label="Comodidades">
			<ImoveisFiltrosComodidades :filter="filter" />
		</Expandable>

		<!-- <div class="absolute bottom-5 left-0 w-full"> -->
		<div class="sticky bottom-5 space-y-2">
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

			<button class="w-full bg-neutral-500 hover:bg-neutral-700 duration-200 px-4 py-2 rounded-md font-medium text-white">
				<div class="flex justify-center items-center gap-2">
					<i class="bi bi-x-lg"></i>
					<span>Limpar filtros</span>
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
