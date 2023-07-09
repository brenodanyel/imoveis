<template>
	<q-form class="column q-gutter-sm no-wrap" @submit.prevent="buscarPlanos()">
		<div>
			<div class="row q-col-gutter-sm">
				<div class="col-xs-12 col-md-8">
					<q-input v-model.trim="filter.search" label="Filtro" clearable>
						<template v-slot:prepend>
							<q-icon name="search" />
						</template>
					</q-input>
				</div>
				<div class="col-xs-12 col-md-4">
					<q-select v-model="filter.ativo" label="Status" :options="ativoInativoOptions" map-options emit-value clearable />
				</div>
			</div>
		</div>

		<div>
			<div class="row q-col-gutter-sm justify-between">
				<div class="col-xs-12 col-sm-auto">
					<q-btn label="Buscar" icon="search" class="bg-positive text-white full-width" type="submit" :loading="loading" />
				</div>

				<div class="col-xs-12 col-sm-auto">
					<q-btn
						label="Criar plano"
						icon="add"
						class="bg-accent text-white full-width"
						@click="onClickCreate()"
						v-if="acl.hasPermission('area-administrativa.planos.create')"
					/>
				</div>
			</div>
		</div>

		<div>
			<q-table
				:rows="planos"
				:columns="[
					{ label: 'Ações', align: 'center', name: 'actions', field: (item) => item, style: 'width: 10%' },
					{ label: '#', align: 'left', name: 'id', field: (item) => item.id, sortable: true, style: 'width: 10%' },
					{ label: 'Nome', align: 'left', name: 'name', field: (item) => item.name, style: 'width: 40%' },
					{ label: 'Preço', align: 'left', name: 'name', field: (item) => item.price, style: 'width: 20%', format: formatCurrency },
					{
						label: 'Tipo de plano',
						align: 'left',
						name: 'name',
						field: (item) => item.public,
						style: 'width: 20%',
						format: (v) => (v ? 'Público' : 'Privado'),
					},
					{
						label: 'Status',
						align: 'left',
						name: 'name',
						field: (item) => item.active,
						style: 'width: 20%',
						format: (v) => (v ? 'Ativo' : 'Inativo'),
					},
				]"
				wrap-cells
				table-header-class="bg-primary text-white"
				v-model:pagination="pagination"
				row-key="id"
				@update:pagination="(pagination) => buscarPlanos({ pagination })"
				@request="buscarPlanos"
				:loading="loading"
				:rows-per-page-options="[5, 10, 25, 50, 100]"
				binary-state-sort
			>
				<template v-slot:body-cell-actions="props">
					<td>
						<div class="row q-gutter-xs flex-center no-wrap">
							<div v-if="acl.hasPermission('area-administrativa.planos.edit')">
								<q-btn icon="edit" dense round class="text-primary" @click="onClickEdit(props.row)" />
								<q-tooltip> Editar </q-tooltip>
							</div>
							<div>
								<q-btn icon="visibility" dense round class="text-primary" @click="onClickView(props.row)" />
								<q-tooltip> Visualizar </q-tooltip>
							</div>
						</div>
					</td>
				</template>
			</q-table>
		</div>
	</q-form>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash';
import { useQuasar } from 'quasar';
import { onUnmounted, reactive, ref, watch } from 'vue';

import { formatCurrency } from '@/services';
import { acl } from '@/services/acl';
import { api } from '@/services/api';
import { ativoInativoOptions } from '@/services/constants';
import { HttpException } from '@/services/http-exception';
import { parsePaginationFromQueryUrl, syncPaginationWithQueryUrl } from '@/services/sync-pagination-with-query-url';

import DialogPlano from './DialogPlano.vue';
import { Plano } from './Plano.types';

const $q = useQuasar();

const filter = reactive({
	search: '',
	ativo: true,
});

const planos = ref<Plano[]>([]);
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

const abortController = ref(new AbortController());

async function buscarPlanos(props?: any) {
	loading.value = true;

	if (props?.pagination) {
		pagination.value = { ...pagination.value, ...props.pagination };
	}

	const { status, data } = await api.get('/plan', {
		params: {
			filter: filter.search,
			active: filter.ativo,
			...pagination.value,
		},
		signal: abortController.value.signal,
	});

	loading.value = false;

	if (status !== 200) {
		HttpException(data);
		return;
	}

	planos.value = data.data;
	pagination.value.rowsNumber = data.meta.rowsNumber;
}

onUnmounted(() => abortController.value.abort());

function onClickEdit(_plano: Plano) {
	const dialog = $q
		.dialog({
			component: DialogPlano,
			componentProps: {
				title: 'Editar plano',
				loading: false,
				_plano: cloneDeep(_plano),
			},
		})
		.onOk(async (plan: Plano) => {
			dialog.update({ loading: true });

			const { status, data } = await api.patch(`/plan/${_plano.id}`, plan);

			dialog.update({ loading: false });

			if (status !== 200) {
				HttpException(data);
				return;
			}

			await buscarPlanos();

			$q.notify({ message: 'Plano editada com sucesso!', type: 'positive' });

			dialog.hide();
		});
}

function onClickView(plano: Plano) {
	$q.dialog({
		component: DialogPlano,
		componentProps: {
			title: 'Visualizar plano',
			readonly: true,
			_plano: cloneDeep(plano),
		},
	});
}

function onClickCreate() {
	const dialog = $q
		.dialog({
			component: DialogPlano,
			componentProps: {
				loading: false,
				title: 'Criar plano',
				_plano: {
					name: '',
					limit_users: 0,
					price: 0,
					public: false,
					active: true,
				} as Plano,
			},
		})
		.onOk(async (plano: Plano) => {
			dialog.update({ loading: true });

			const { status, data } = await api.post('/plan', plano);

			dialog.update({ loading: false });

			if (status !== 201) {
				HttpException(data);
				return;
			}

			await buscarPlanos();

			$q.notify({ message: 'Plano criada com sucesso!', type: 'positive' });

			dialog.hide();
		});
}
</script>
