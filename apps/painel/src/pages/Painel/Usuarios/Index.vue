<template>
	<div>
		<Title title="Usuários vinculados" icon="bi-person-fill-gear" />

		<q-form class="column q-gutter-sm no-wrap q-pa-sm" @submit.prevent="refetch()">
			<div>
				<div class="row q-col-gutter-sm">
					<div class="col-xs-12 col-md-6">
						<q-input v-model.trim="filter.search" label="Filtro" clearable>
							<template v-slot:prepend>
								<q-icon name="search" />
							</template>
						</q-input>
					</div>
					<div class="col-xs-12 col-md-6">
						<SelectRole :selected="filter.roles" @update:selected="filter.roles = $event" multiple />
					</div>

					<div class="col-xs-12">
						<div>
							<div class="row q-col-gutter-sm justify-between">
								<div class="col-xs-12 col-sm-auto">
									<q-btn label="Buscar" icon="search" class="bg-positive text-white full-width" type="submit" :loading="isLoading" />
								</div>

								<div class="col-xs-12 col-sm-auto">
									<q-btn label="Convidar usuário" icon="add" class="bg-accent text-white full-width" @click="onClickCreate()" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div>
				<q-table
					:rows="data"
					:columns="[
						{ label: 'Ações', align: 'center', name: 'actions', field: (item) => item, style: 'width: 20%' },
						{ label: '#', align: 'center', name: 'id', field: (item) => item.id, sortable: true, style: 'width: 10%' },
						{ label: 'Nome', align: 'left', name: 'name', field: (item) => item.name, style: 'width: 25%' },
						{ label: 'E-mail', align: 'left', name: 'email', field: (item) => item.email, style: 'width: 25%' },
						{
							label: 'Perfis',
							align: 'left',
							name: 'companies',
							field: (item) => item.roles.map((role: any) => role.name).join(', '),
							style: 'width: 20%',
						},
					]"
					wrap-cells
					table-header-class="bg-primary text-white"
					v-model:pagination="pagination"
					row-key="id"
					@update:pagination="(pagination) => syncPagination({ pagination })"
					@request="refetch()"
					:loading="isLoading"
					:rows-per-page-options="[5, 10, 25, 50, 100]"
					binary-state-sort
				>
					<template v-slot:body-cell-actions="props">
						<td>
							<div class="row q-gutter-xs flex-center no-wrap">
								<div>
									<q-btn icon="edit" dense round class="text-primary" @click="onClickEdit(props.row)" />
									<q-tooltip>Editar</q-tooltip>
								</div>
								<div v-if="!props.row.roles.some((item: any) => ['admin_geral', 'admin'].includes(item.slug))">
									<q-btn icon="delete" dense round class="text-primary" @click="onClickDelete(props.row)" />
									<q-tooltip>Excluir vinculo</q-tooltip>
								</div>
								<div v-else>
									<q-btn icon="delete" dense round class="text-primary" disable />
									<q-tooltip>Não é possível remover o vinculo de um usuário com perfil admin.</q-tooltip>
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
import { useQuasar } from 'quasar';
import { onUnmounted, reactive, ref, watch } from 'vue';

import { api } from '@/services/api';
import { HttpException } from '@/services/http-exception';
import { parsePaginationFromQueryUrl, syncPaginationWithQueryUrl } from '@/services/sync-pagination-with-query-url';

import { useQuery } from 'vue-query';
import SelectRole from '../Components/SelectRole.vue';
import Title from '../Components/Title.vue';
import DialogConfirmarRemocaoDeUsuario from './DialogConfirmarRemocaoDeUsuario.vue';
import DialogSelecionarPerfis from './DialogSelecionarPerfis.vue';
import DialogVincularUsuario from './DialogVincularUsuario.vue';
import { Usuario } from './Usuario.type';

const $q = useQuasar();

const filter = reactive({
	search: '',
	roles: [],
});

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

onUnmounted(() => abortController.value.abort());

const { data, isLoading, refetch } = useQuery<Usuario[]>('usuarios', async () => {
	const { status, data } = await api.get('/my-company/users', {
		params: {
			filter: filter.search,
			roles: filter.roles.map((r: any) => r.id),
			...pagination.value,
		},
		signal: abortController.value.signal,
	});

	if (status !== 200) {
		HttpException(data);
		return;
	}

	pagination.value.rowsNumber = data.meta.rowsNumber;

	return data.data;
});

function syncPagination(props: any) {
	if (props.pagination) pagination.value = { ...pagination.value, ...props.pagination };
	return refetch.value();
}

function onClickCreate() {
	const dialog = $q.dialog({ component: DialogVincularUsuario, componentProps: {} }).onOk(async () => {
		await refetch.value();
		$q.notify({ message: 'Usuário vinculado com sucesso!', type: 'positive' });
		dialog.hide();
	});
}

function onClickEdit(usuario: Usuario) {
	const dialog = $q
		.dialog({
			component: DialogSelecionarPerfis,
			componentProps: {
				title: 'Selecionar perfis',
				usuario,
				_selectedRoles: usuario.roles,
			},
		})
		.onOk(async (roles) => {
			dialog.update({ loading: true });

			const { status, data } = await api.patch(`/my-company/users/${usuario.id}`, {
				roles: roles.map((role: any) => role.id),
			});

			dialog.update({ loading: false });

			if (status !== 200) {
				HttpException(data);
				return;
			}

			await refetch.value();

			$q.notify({ message: 'Perfis atualizados com sucesso.', type: 'positive' });

			dialog.hide();
		});
}

function onClickDelete(usuario: Usuario) {
	async function removerVinculo() {
		const { status, data } = await api.delete(`/my-company/users/${usuario.id}`);

		if (status !== 200) {
			HttpException(data);
			return;
		}

		await refetch.value();
	}

	const dialog = $q
		.dialog({
			component: DialogConfirmarRemocaoDeUsuario,
			componentProps: {
				nomeUsuario: usuario.name,
				loading: false,
			},
		})
		.onOk(async () => {
			dialog.update({ loading: true });

			await removerVinculo();

			dialog.hide();

			$q.notify({ message: 'Vinculo removido com sucesso.', type: 'positive' });
		});
}
</script>
