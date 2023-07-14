<template>
	<div>
		<Title title="Meus anúncios" icon="real_estate_agent" />

		<q-form class="column q-gutter-sm no-wrap q-pa-sm" @submit.prevent="buscarAnuncios()">
			<div>
				<div class="row q-col-gutter-sm">
					<div class="col-xs-12">
						<q-input v-model.trim="filter.search" label="Filtro" clearable>
							<template v-slot:prepend>
								<q-icon name="search" />
							</template>
						</q-input>
					</div>

					<div class="col-xs-12">
						<div>
							<div class="row q-col-gutter-sm justify-between">
								<div class="col-xs-12 col-sm-auto">
									<q-btn label="Buscar" icon="search" class="bg-positive text-white full-width" type="submit" :loading="loading" />
								</div>

								<div class="col-xs-12 col-sm-auto">
									<q-btn label="Criar anúncio" icon="add" class="bg-accent text-white full-width" @click="onClickCreate()" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div>
				<q-table
					:rows="anuncios"
					:columns="[
						{ label: 'Ações', align: 'center', name: 'actions', field: (item: Anuncio) => item, style: 'width: 10%' },
						{ label: '#', align: 'center', name: 'id', field: (item: Anuncio) => item.id, sortable: true, style: 'width: 10%' },

						{ label: 'Titulo', align: 'left', name: 'titulo', field: (item: Anuncio) => item.titulo, sortable: true, style: 'width: 25%' },

						{ label: 'Tipo', align: 'left', name: 'tipo', field: (item: Anuncio) => item.subcategoria.nome, sortable: true, style: 'width: 15%' },
						{ label: 'Propósito', align: 'left', name: 'proposito', field: (item: Anuncio) => item.proposito, sortable: true, style: 'width: 10%' },

						{
							label: 'Valor',
							align: 'left',
							name: 'valor',
							field: (item: Anuncio) => formatCurrency(item.valor / 100),
							sortable: true,
							style: 'width: 10%',
						},
						{
							label: 'IPTU',
							align: 'left',
							name: 'valor_iptu',
							field: (item: Anuncio) => formatCurrency(item.valor_iptu / 100),
							sortable: true,
							style: 'width: 10%',
						},
						{
							label: 'Condominio',
							align: 'left',
							name: 'valor_condominio',
							field: (item: Anuncio) => formatCurrency(item.valor_condominio / 100),
							sortable: true,
							style: 'width: 10%',
						},
					]"
					wrap-cells
					table-header-class="bg-primary text-white"
					v-model:pagination="pagination"
					row-key="id"
					@update:pagination="(pagination) => buscarAnuncios({ pagination })"
					@request="buscarAnuncios"
					:loading="loading"
					:rows-per-page-options="[5, 10, 25, 50, 100]"
					binary-state-sort
				>
					<template #body-cell-actions="props">
						<td>
							<div class="row q-gutter-xs flex-center no-wrap">
								<div>
									<q-btn icon="edit" dense round class="text-primary" @click="onClickEdit(props.row)">
										<q-tooltip>Editar</q-tooltip>
									</q-btn>
									<q-btn icon="visibility" dense round class="text-primary" @click="onClickEdit(props.row)">
										<q-tooltip>Visualizar</q-tooltip>
									</q-btn>
								</div>
							</div>
						</td>
					</template>
				</q-table>
			</div>
		</q-form>
	</div>
</template>

<script setup lang="ts">
import Title from '@/pages/Painel/Components/Title.vue';
import { parsePaginationFromQueryUrl, syncPaginationWithQueryUrl } from '@/services/sync-pagination-with-query-url';
import { useQuasar } from 'quasar';
import { reactive, ref, watch } from 'vue';
import { formatCurrency } from '../../../services';
import { api } from '../../../services/api';
import { HttpException } from '../../../services/http-exception';
import { Anuncio } from './Anuncio.types';
import DialogAnuncio from './DialogAnuncio/Index.vue';
const $q = useQuasar();

const filter = reactive({
	search: '',
});

const anuncios = ref<Anuncio[]>([]);

const loading = ref(false);

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

async function buscarAnuncios(props?: any) {
	if (props?.pagination) {
		pagination.value = {
			...pagination.value,
			...props.pagination,
		};
	}

	loading.value = true;

	const { status, data } = await api.get('/me/anuncios', {
		params: {
			...pagination.value,
			...filter,
		},
	});

	loading.value = false;

	if (status !== 200) {
		HttpException(data);
		return;
	}

	anuncios.value = data.data;
	pagination.value.rowsNumber = data.total;
}

async function onClickCreate() {
	const dialog = $q.dialog({
		component: DialogAnuncio,
		componentProps: {
			title: 'Criar anúncio',
			mode: 'create',
			loading: false,
			_anuncio: {
				titulo: '',
				descricao: '',
				valor: undefined,
				valor_condominio: undefined,
				valor_iptu: undefined,
				proposito: undefined,
				subcategoria: { id: undefined, categoriaId: undefined, nome: undefined },
				area_construida: undefined,
				area_total: undefined,
				thumbnail: undefined,
				comodidades: [],
				caracteristicas: {},
				imagens: [],
				endereco: {
					rua: '',
					numero: '',
					complemento: '',
					bairro: '',
					cidade: '',
					estado: '',
					pais: '',
					cep: '',
				},
			} as Partial<Anuncio>,
		},
	});

	dialog.onOk(async (anuncio: Anuncio) => {
		dialog.update({ loading: true });

		const { status, data } = await api.post('/me/anuncios', {
			...anuncio,
			valor: anuncio.valor || 0,
			valor_condominio: anuncio.valor_condominio || 0,
			valor_iptu: anuncio.valor_iptu || 0,
		});

		dialog.update({ loading: false });

		if (status !== 201) {
			HttpException(data);
			return;
		}

		await buscarAnuncios();

		dialog.hide();

		$q.notify({ message: 'Anúncio criado com sucesso!', type: 'positive' });
	});
}

async function onClickEdit(anuncio: any) {
	const dialog = $q.dialog({
		component: DialogAnuncio,
		componentProps: {
			_anuncio: anuncio,
			title: 'Editar anúncio',
			mode: 'edit',
			loading: false,
		},
	});

	const id = anuncio.id;

	dialog.onOk(async (anuncio: Anuncio) => {
		dialog.update({ loading: true });

		const { status, data } = await api.patch(`/me/anuncios/${id}`, {
			...anuncio,
			valor: anuncio.valor || 0,
			valor_condominio: anuncio.valor_condominio || 0,
			valor_iptu: anuncio.valor_iptu || 0,
		});

		dialog.update({ loading: false });

		if (status !== 200) {
			HttpException(data);
			return;
		}

		await buscarAnuncios();

		$q.notify({ message: 'Anúncio atualizado com sucesso!', type: 'positive' });

		dialog.hide();
	});
}
</script>
