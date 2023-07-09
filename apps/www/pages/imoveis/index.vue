<template>
	<div class="flex h-full py-10">
		<div class="w-1/4 border-r-2 hidden md:block">
			<p>Filtros</p>
		</div>

		<div class="w-full md:px-12 space-y-2">
			<p class="text-gray-800 text-3xl font-bold">Imóveis:</p>

			<div class="flex justify-between gap-2 flex-wrap">
				<div class="flex items-center gap-2">
					<i class="bi bi-filter-left"></i>
					<p class="text-gray-500">Ordenar por:</p>

					<select class="p-1 border rounded-lg" v-model="ordenacao">
						<option v-for="opcao in opcoesOrdenacao" :key="opcao.label" :value="opcao.value">{{ opcao.label }}</option>
					</select>
				</div>

				<div class="flex items-center gap-1">
					<template v-if="pagination.rowsNumber">
						<i class="bi bi-check-circle text-gray-500"></i>
						<p class="text-gray-500">{{ pagination.rowsNumber }} {{ pagination.rowsNumber > 1 ? 'Imóveis encontrados' : 'Imóvel encontrado' }}</p>
					</template>
					<template v-else>
						<i class="bi bi-x-circle text-gray-500"></i>
						<p class="text-gray-500">Nenhum imóvel encontrado</p>
					</template>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-3" v-if="data?.data">
				<RouterLink
					class="border rounded-lg overflow-hidden hover:scale-[1.01] duration-200 text-left shadow-md h-96"
					:to="`/imoveis/${imovel.id}`"
					v-for="imovel in data.data"
					:key="imovel.id"
				>
					<img :src="imovel.thumbnail" alt="imagem imovel" class="w-full h-[60%] object-cover" />
					<div class="p-3 space-y-1">
						<p class="text-blue-500 uppercase">{{ imovel.proposito }}</p>
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
import useQueryPagination from '../../composables/useQueryPagination';

const { parsePaginationFromQueryUrl, syncPaginationWithQueryUrl } = useQueryPagination();

const pagination = ref(
	parsePaginationFromQueryUrl({
		sortBy: 'id',
		descending: false,
		page: 1,
		rowsPerPage: 5,
		rowsNumber: 0,
	}),
);

watch(() => pagination.value, syncPaginationWithQueryUrl, { deep: true });

type Response = {
	data: {
		id: number;
		createdAt: string;
		expiresAt: string | null;
		titulo: string;
		descricao: string;
		proposito: string;
		thumbnail: string;
		valor: number;
		valor_iptu: number;
		valor_condominio: number;
		area_total: number;
		area_construida: number;
		subcategoria: {
			id: number;
			nome: string;
			categoriaId: number;
		};
		endereco: {
			rua: string;
			numero: string;
			complemento: string;
			bairro: string;
			cidade: string;
			estado: string;
			pais: string;
			cep: string;
		};
		caracteristicas: Record<string, number>;
		comodidades: string[];
		imagens: { url: string }[];
	}[];
	meta: { rowsNumber: number };
};

const { data, refresh } = await useAsyncData<Response>('imoveis', () => {
	return $fetch('http://localhost:3000/anuncios', {
		method: 'GET',
		query: {
			...pagination.value,
		},
	});
});

pagination.value.rowsNumber = data.value?.meta.rowsNumber ?? 0;

const opcoesOrdenacao = [
	{ value: { key: 'createdAt', descending: false }, label: 'Mais recentes' },
	{ value: { key: 'valor', descending: false }, label: 'Menor preço' },
	{ value: { key: 'valor', descending: true }, label: 'Maior preço' },
];

const ordenacao = ref(opcoesOrdenacao[0].value);

watch(ordenacao, () => {
	pagination.value = {
		...pagination.value,
		sortBy: ordenacao.value.key,
		descending: ordenacao.value.descending,
	};
	refresh();
});
</script>
