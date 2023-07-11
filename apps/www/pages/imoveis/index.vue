<template>
	<div class="flex h-full py-10">
		<div class="hidden w-1/3 border-r-2 md:block md:px-12">
			<ImoveisFiltros :filter="filtro" @apply-filter="refresh()" :loading="pending" />
		</div>

		<div class="w-full space-y-2 md:px-12">
			<p class="text-3xl font-bold text-gray-800">Imóveis:</p>

			<div class="flex flex-wrap justify-between gap-2">
				<div class="flex items-center gap-2">
					<i class="bi bi-filter-left"></i>
					<p class="text-gray-500">Ordenar por:</p>
					<select class="rounded-lg border p-1" v-model="ordenacao">
						<option v-for="opcao in opcoesOrdenacao" :key="opcao.label" :value="opcao.value">{{ opcao.label }}</option>
					</select>
				</div>
				<div class="flex items-center gap-1">
					<template v-if="data?.meta.rowsNumber">
						<i class="bi bi-check-circle text-gray-500"></i>
						<p class="text-gray-500">{{ data.meta.rowsNumber }} {{ data.meta.rowsNumber > 1 ? 'Imóveis encontrados' : 'Imóvel encontrado' }}</p>
					</template>
					<template v-else>
						<i class="bi bi-x-circle text-gray-500"></i>
						<p class="text-gray-500">Nenhum imóvel encontrado</p>
					</template>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" v-if="data?.data">
				<RouterLink
					class="h-96 overflow-hidden rounded-lg border text-left shadow-md duration-200 hover:scale-[1.01]"
					:to="`/imoveis/${imovel.id}`"
					v-for="imovel in data.data"
					:key="imovel.id"
				>
					<img :src="imovel.thumbnail" alt="imagem imovel" class="h-[60%] w-full object-cover" />
					<div class="space-y-1 p-3">
						<p class="uppercase text-blue-500">{{ imovel.proposito }}</p>
						<p class="font-medium">{{ imovel.subcategoria.nome }}</p>
						<p class="text-sm text-gray-500">{{ imovel.endereco.bairro }} ({{ imovel.endereco.cidade }})</p>
						<div class="flex items-center gap-1">
							<i class="bi bi-cash-stack text-gray-500"></i>
							<span class="font-medium text-blue-500">
								{{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.valor / 100) }}
							</span>
						</div>
					</div>
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useFilterQuery from '../../composables/useFilterQuery';
import usePaginationQuery from '../../composables/usePaginationQuery';
import { Anuncio } from '../../types/anuncios';

const filterQuery = useFilterQuery();
const paginationQuery = usePaginationQuery();

const pagination = ref(
	paginationQuery.parseURL({
		sortBy: 'createdAt',
		descending: false,
		page: 1,
		rowsPerPage: 5,
	}),
);

watch(
	() => pagination.value,
	() => paginationQuery.syncURL(pagination.value),
	{ deep: true },
);

const opcoesOrdenacao = [
	{ value: { key: 'createdAt', descending: false }, label: 'Mais recentes' },
	{ value: { key: 'valor', descending: false }, label: 'Menor preço' },
	{ value: { key: 'valor', descending: true }, label: 'Maior preço' },
];

const ordenacao = ref(opcoesOrdenacao[0].value);

pagination.value.sortBy = ordenacao.value.key;
pagination.value.descending = ordenacao.value.descending;

watch(
	() => ordenacao.value,
	() => {
		pagination.value.sortBy = ordenacao.value.key;
		pagination.value.descending = ordenacao.value.descending;
	},
	{ deep: true },
);

const filtro = ref(
	filterQuery.parseURL({
		max_valor: null,
		min_valor: null,
		proposito: null,
		comodidades: [],
		subcategorias: [],
	}),
);

watch(
	() => filtro.value,
	() => filterQuery.syncURL(filtro.value),
	{ deep: true },
);

type Response = { data: Anuncio[]; meta: { rowsNumber: number } };
const { data, refresh, pending } = await useAsyncData<Response>('imoveis', async () => {
	if (process.client) await new Promise((resolve) => setTimeout(resolve, 500));

	return $fetch('http://localhost:3000/anuncios', {
		method: 'GET',
		query: {
			...pagination.value,
			...filtro.value,
		},
	});
});

watch(
	() => pagination.value,
	() => refresh(),
	{ deep: true },
);
</script>
