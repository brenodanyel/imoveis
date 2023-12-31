<template>
	<div class="flex h-full py-10">
		<div class="hidden w-1/3 border-r-2 md:block md:pr-12">
			<ImoveisFiltros :filter="filtro" @apply-filter="refresh()" :loading="pending" @reset="filtro = { ...initialFilter }" />
		</div>

		<div class="w-full space-y-2 md:pl-12">
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

			<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" v-if="data?.data?.length">
				<RouterLink
					class="h-96 overflow-hidden rounded-lg border text-left shadow-md duration-200 hover:scale-[1.01]"
					:to="`/imoveis/${imovel.id}`"
					v-for="imovel in data.data"
					:key="imovel.id"
				>
					<img :src="imovel.thumbnail" alt="imagem imóvel" class="h-[60%] w-full object-cover" />
					<div class="space-y-1 p-3">
						<div class="flex justify-between gap-3">
							<p class="uppercase text-blue-500">{{ imovel.proposito }}</p>
							<p class="text-gray-500">{{ imovel.subcategoria.nome }}</p>
						</div>
						<p class="font-medium first-letter:capitalize text-ellipsis whitespace-nowrap overflow-hidden">{{ imovel.titulo }}</p>
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

			<div v-else>
				<p class="text-gray-500">Nenhum imóvel encontrado com os filtros selecionados</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useFilterQuery from '../../composables/useFilterQuery';
import usePaginationQuery from '../../composables/usePaginationQuery';
import { Anuncio, Filtro } from '../../types/anuncios';

useHead({
	title: 'Imóveis',
});

const filterQuery = useFilterQuery();
const paginationQuery = usePaginationQuery();
const config = useRuntimeConfig();

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

const initialFilter: Filtro = {
	max_valor: null,
	min_valor: null,
	proposito: null,
	comodidades: [],
	subcategorias: [],
};

const filtro = ref(filterQuery.parseURL(initialFilter));

watch(
	() => filtro.value,
	() => filterQuery.syncURL(filtro.value),
	{ deep: true },
);

type Response = { data: Anuncio[]; meta: { rowsNumber: number } };
const { data, refresh, pending } = await useLazyAsyncData<Response>('imoveis', async () => {
	return $fetch('/anuncios/', {
		baseURL: config.public.baseURL,
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
