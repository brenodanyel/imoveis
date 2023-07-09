<template>
	<q-form class="column q-gutter-sm no-wrap" @submit.prevent="buscarEmpresas()">
		<div>
			<div class="row q-col-gutter-sm">
				<div class="col-xs-12 col-md-7">
					<q-input v-model.trim="filter.search" label="Filtro" clearable>
						<template v-slot:prepend>
							<q-icon name="search" />
						</template>
					</q-input>
				</div>
				<div class="col-xs-12 col-md-5">
					<SelectPlan :selected="filter.plans" @update:selected="filter.plans = $event" multiple />
				</div>
			</div>
		</div>

		<div>
			<div class="row q-col-gutter-sm justify-between">
				<div class="col-xs-12 col-sm-auto">
					<q-btn label="Buscar" icon="search" class="bg-positive text-white full-width" type="submit" :loading="loading" />
				</div>

				<div class="col-xs-12 col-sm-auto">
					<q-btn label="Criar empresa" icon="add" class="bg-accent text-white full-width" @click="onClickCreate()" />
				</div>
			</div>
		</div>

		<div>
			<q-table
				:rows="empresas"
				:columns="[
					{ label: 'Ações', align: 'center', name: 'actions', field: (item) => item, style: 'width: 10%' },
					{ label: '#', align: 'left', name: 'id', field: (item) => item.id, sortable: true, style: 'width: 10%' },
					{ label: 'Nome', align: 'left', name: 'name', field: (item) => item.name, style: 'width: 40%' },
					{ label: 'CNPJ', align: 'left', name: 'cnpj', field: (item) => item.cnpj, style: 'width: 40%', format: formatCNPJ },
					{ label: 'Plano', align: 'left', name: 'plan', field: (item) => item, style: 'width: 20%' },
				]"
				wrap-cells
				table-header-class="bg-primary text-white"
				v-model:pagination="pagination"
				row-key="id"
				@update:pagination="(pagination) => buscarEmpresas({ pagination })"
				@request="buscarEmpresas"
				:loading="loading"
				:rows-per-page-options="[5, 10, 25, 50, 100]"
				binary-state-sort
			>
				<template v-slot:body-cell-actions="props">
					<td>
						<div class="row q-gutter-xs flex-center no-wrap" style="width: 100px">
							<div>
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
				<template v-slot:body-cell-plan="props">
					<td>
						<div class="row flex-center">
							<div v-if="props.row.companyPlan">
								<q-chip
									:label="props.row.companyPlan.plan.name"
									icon="sell"
									:color="dayjs(props.row.companyPlan.expiresAt).diff() > 0 ? 'primary' : 'negative'"
									:ripple="false"
									dark
									clickable
									flat
									@click="onClickView(props.row)"
								>
									<q-tooltip class="bg-accent" style="width: 20em">
										<div class="text-weight-bold text-12">{{ props.row.companyPlan.plan.name }}</div>

										<div class="row q-gutter-md justify-between">
											<div>Data de pagamento:</div>
											<div>{{ dayjs(props.row.companyPlan.paidAt).format('DD/MM/YYYY') }}</div>
										</div>

										<div class="row q-gutter-md justify-between">
											<div>Data de vencimento:</div>
											<div>{{ dayjs(props.row.companyPlan.expiresAt).format('DD/MM/YYYY') }}</div>
										</div>

										<q-separator dark spaced />

										<div class="row q-gutter-md justify-between">
											<div>{{ dayjs(props.row.companyPlan.expiresAt).diff() > 0 ? 'Expira' : 'Expirou' }}</div>
											<div>{{ dayjs(props.row.companyPlan.expiresAt).fromNow() }}</div>
										</div>
									</q-tooltip>
								</q-chip>
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

import { formatCNPJ } from '@/services';
import { api } from '@/services/api';
import { dayjs } from '@/services/dayjs';
import { HttpException } from '@/services/http-exception';
import { parsePaginationFromQueryUrl, syncPaginationWithQueryUrl } from '@/services/sync-pagination-with-query-url';

import SelectPlan from '../../Components/SelectPlan.vue';
import DialogEmpresa from './DialogEmpresa.vue';
import { Empresa } from './Empresas.types';

const $q = useQuasar();

const filter = reactive({
	search: '',
	plans: [],
});

const empresas = ref<Empresa[]>([]);
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

async function buscarEmpresas(props?: any) {
	loading.value = true;

	if (props?.pagination) {
		pagination.value = { ...pagination.value, ...props.pagination };
	}

	const { status, data } = await api.get('/company', {
		params: {
			filter: filter.search,
			plans: filter.plans.map((plan: any) => plan.id),
			includeAddress: true,
			includePlan: true,
			...pagination.value,
		},
		signal: abortController.value.signal,
	});

	loading.value = false;

	if (status !== 200) {
		HttpException(data);
		return;
	}

	empresas.value = data.data;
	pagination.value.rowsNumber = data.meta.rowsNumber;
}

onUnmounted(() => abortController.value.abort());

function onClickEdit(_empresa: Empresa) {
	const dialog = $q.dialog({
		component: DialogEmpresa,
		componentProps: {
			title: 'Editar empresa',
			mode: 'edit',
			loading: false,
			_empresa: cloneDeep(_empresa),
		},
	});

	dialog.onOk(async (empresa: Empresa) => {
		dialog.update({ loading: true });

		const { status, data } = await api.patch(`/company/${_empresa.id}`, formatRequestPayload(empresa));

		dialog.update({ loading: false });

		if (status !== 200) {
			HttpException(data);
			return false;
		}

		await buscarEmpresas();

		$q.notify({ message: 'Empresa editada com sucesso!', type: 'positive' });

		dialog.hide();
	});
}

function formatRequestPayload(empresa: Empresa) {
	const payload: any = {
		name: empresa.name,
		cnpj: empresa.cnpj,
		phone_number: empresa.phone_number,
		address: empresa.address,
	};

	if (empresa.companyPlan) {
		payload.companyPlan = empresa.companyPlan.plan
			? {
					paidAt: empresa.companyPlan.paidAt,
					expiresAt: dayjs(empresa.companyPlan.expiresAt).endOf('day'),
					planId: empresa.companyPlan.plan.id,
			  }
			: null;
	}

	return payload;
}

function onClickView(empresa: Empresa) {
	$q.dialog({
		component: DialogEmpresa,
		componentProps: {
			title: 'Visualizar empresa',
			mode: 'view',
			_empresa: cloneDeep(empresa),
		},
	});
}

function onClickCreate() {
	const dialog = $q.dialog({
		component: DialogEmpresa,
		componentProps: {
			loading: false,
			title: 'Criar empresa',
			mode: 'create',
			_empresa: {
				id: -1,
				name: '',
				cnpj: '',
				phone_number: '',
			},
		},
	});

	dialog.onOk(async (empresa: Empresa) => {
		dialog.update({ loading: true });

		const { status, data } = await api.post('/company', formatRequestPayload(empresa));

		dialog.update({ loading: false });

		if (status !== 201) {
			HttpException(data);
			return false;
		}

		await buscarEmpresas();

		$q.notify({ message: 'Empresa criada com sucesso!', type: 'positive' });

		dialog.hide();
	});
}
</script>
