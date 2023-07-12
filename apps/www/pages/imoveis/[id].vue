<template>
	<div class="py-5 md:w-2/3 mx-auto" v-if="data">
		<div class="space-y-3">
			<div class="flex flex-col md:flex-row md:items-center gap-3 justify-between">
				<div class="space-y-1">
					<p class="text-4xl text-neutral-500 font-medium">{{ data.titulo }}</p>
					<p class="text-xl text-neutral-500">{{ data.endereco.bairro }} - {{ data.endereco.cidade }}/{{ data.endereco.estado }}</p>
					<p class="text-sm text-neutral-500">Publicado em {{ dayjs(data.createdAt).format('DD/MM/YYYY [às] HH[h]:MM') }}</p>
				</div>
				<div class="flex flex-row gap-1 md:flex-col justify-between items-end">
					<p class="bg-green-500 w-min py-1 px-2 text-white rounded-md cursor-default">{{ data.proposito }}</p>
					<p class="text-neutral-500 text-3xl font-medium">
						{{ new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(data.valor) }}
					</p>
				</div>
			</div>

			<div class="flex flex-col gap-2 overflow-hidden">
				<img
					:src="data.thumbnail"
					:alt="`imagem principal do anuncio ${data.id}`"
					class="rounded-lg aspect-video object-center object-cover cursor-pointer h-3/4"
				/>
				<div class="grid grid-flow-col gap-3">
					<img
						:src="imagem.url"
						:alt="`imagem do anuncio ${data.id}`"
						class="rounded-lg aspect-video object-center object-cover cursor-pointer"
						v-for="imagem of data.imagens.slice(0, 3)"
					/>
				</div>
			</div>

			<div class="space-y-1 border-b pb-5">
				<p class="bg-green-500 w-min py-1 px-2 text-white rounded-md cursor-default">{{ data.proposito }}</p>
				<p class="text-neutral-500 text-3xl font-medium">
					{{ new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(data.valor) }}
				</p>
			</div>

			<div class="space-y-1 border-b pb-5">
				<p class="text-2xl text-neutral-500 font-medium">Descrição</p>
				<p class="text-neutral-500">{{ data.descricao }}</p>
			</div>

			<div class="space-y-1 border-b pb-5">
				<p class="text-2xl text-neutral-500 font-medium">Detalhes do Imóvel</p>
				<p class="text-neutral-500" v-if="data.valor_condominio">
					<b>Valor do condomínio:</b>
					{{ new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(data.valor_condominio) }}
				</p>
				<p class="text-neutral-500" v-if="data.valor_iptu">
					<b>Valor do IPTU:</b>
					{{ new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(data.valor_iptu) }}
				</p>
				<p class="text-neutral-500">
					<b>Tipo:</b>
					{{ data.subcategoria.nome }}
				</p>
				<p class="text-neutral-500">
					<b>Área:</b>
					{{ data.area_total / 10 }}m²
				</p>
				<p class="text-neutral-500">
					<b>Área construída:</b>
					{{ data.area_construida / 10 }}m²
				</p>
				<p class="text-neutral-500" v-for="[key, value] of Object.entries(data.caracteristicas)" :key="key">
					<b>{{ key }}:</b>
					{{ value }}
				</p>
			</div>

			<div class="space-y-1">
				<p class="text-2xl text-neutral-500 font-medium">Comodidades</p>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-1">
					<div class="text-neutral-500 flex gap-2" v-for="comodidade of data.comodidades" :key="comodidade">
						<i class="bi bi-check-circle"></i>
						<p>{{ comodidade }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { Anuncio } from '../../types/anuncios';

const route = useRoute();
const { data } = useFetch<Anuncio>(`http://localhost:3000/anuncios/${route.params.id}`);
</script>
