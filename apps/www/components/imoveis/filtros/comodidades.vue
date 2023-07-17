<template>
	<ul>
		<li v-for="comodidade of data" :key="comodidade.id">
			<label class="flex gap-1 items-center cursor-pointer select-none">
				<input type="checkbox" name="categoria" v-model="filter.comodidades" :value="comodidade.id" />
				<span>{{ comodidade.nome }}</span>
			</label>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { Filtro } from '../../../types/anuncios';
const config = useRuntimeConfig();

defineProps<{ filter: Filtro }>();

type Response = {
	id: number;
	nome: string;
}[];

const { data } = useFetch<Response>('/comodidade', {
	baseURL: config.public.baseURL,
	server: true,
	mode: 'no-cors',
});
</script>
