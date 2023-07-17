<template>
	<div v-for="categoria of data" :key="categoria.id">
		<div class="font-bold">{{ categoria.nome }}</div>

		<ul class="ml-2">
			<li v-for="subcategoria of categoria.subcategorias" :key="subcategoria.id">
				<label class="flex gap-1 items-center cursor-pointer select-none">
					<input type="checkbox" name="categoria" v-model="filter.subcategorias" :value="subcategoria.id" />
					<span>{{ subcategoria.nome }}</span>
				</label>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { Filtro } from '../../../types/anuncios';
const config = useRuntimeConfig();

defineProps<{ filter: Filtro }>();

type Response = {
	id: number;
	nome: string;
	subcategorias: {
		id: number;
		nome: string;
	}[];
}[];

const { data } = useFetch<Response>(`${config.public.baseURL}/categorias`, {
	server: true,
});
</script>
