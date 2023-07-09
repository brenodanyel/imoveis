<template>
	<q-form class="column q-gutter-sm no-wrap" @submit.prevent="buscarUsuarios()">
		<div>
			<div class="row q-col-gutter-sm">
				<div class="col-xs-12">
					<q-input v-model.trim="filter.search" label="Filtro" clearable>
						<template v-slot:prepend>
							<q-icon name="search" />
						</template>
					</q-input>
				</div>
				<div class="col-xs-12 col-md-6">
					<SelectCompany :selected="filter.companies" @update:selected="filter.companies = $event" multiple />
				</div>
				<div class="col-xs-12 col-md-6">
					<SelectRole :selected="filter.roles" @update:selected="filter.roles = $event" multiple />
				</div>
			</div>
		</div>

		<div>
			<div class="row q-col-gutter-sm justify-between">
				<div class="col-xs-12 col-sm-auto">
					<q-btn label="Buscar" icon="search" class="bg-positive text-white full-width" type="submit" :loading="loading" />
				</div>

				<div class="col-xs-12 col-sm-auto">
					<q-btn label="Criar usuário" icon="add" class="bg-accent text-white full-width" @click="onClickCreate()" />
				</div>
			</div>
		</div>

		<div>
			<q-table
				:rows="usuarios"
				:columns="[
					{ label: 'Ações', align: 'center', name: 'actions', field: (item) => item, style: 'width: 10%' },
					{ label: '#', align: 'center', name: 'id', field: (item) => item.id, sortable: true, style: 'width: 10%' },
					{ label: 'Nome', align: 'left', name: 'name', field: (item) => item.name, style: 'width: 30%' },
					{ label: 'E-mail', align: 'left', name: 'email', field: (item) => item.email, style: 'width: 30%' },
					{
						label: 'CPF',
						align: 'left',
						name: 'cpf',
						field: (item) => item.cpf,
						style: 'width: 30%',
						format: (val) => formatCPF(val),
					},
					{
						label: 'Status',
						align: 'left',
						name: 'status',
						field: (item) => item.active,
						format: (val) => (val ? 'Ativo' : 'Inativo'),
						style: 'width: 10%',
					},
					{ label: 'Empresas', align: 'left', name: 'companies', field: (item) => item, style: 'width: 10%' },
				]"
				wrap-cells
				table-header-class="bg-primary text-white"
				v-model:pagination="pagination"
				row-key="id"
				@update:pagination="(pagination) => buscarUsuarios({ pagination })"
				@request="buscarUsuarios"
				:loading="loading"
				:rows-per-page-options="[5, 10, 25, 50, 100]"
				binary-state-sort
			>
				<template v-slot:body-cell-actions="props">
					<td>
						<div class="row q-gutter-xs flex-center no-wrap">
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
				<template v-slot:body-cell-companies="props">
					<td>
						<div>
							<q-chip class="text-primary q-px-md">
								<q-avatar>
									<q-icon name="business" />
								</q-avatar>
								<span> {{ props.row.companies.length }} </span>
								<q-tooltip class="bg-accent text-white">
									<div class="column" style="width: 30em" v-if="props.row.companies.length">
										<div v-for="(userCompany, index) of props.row.companies">
											<div class="row items-center q-gutter-md">
												<q-icon name="business" size="sm" />
												<div>
													<div class="text-body2">{{ userCompany.company.name }}</div>
													<div class="text-caption">{{ userCompany.company.id }} - {{ userCompany.company.cnpj }}</div>
													<div>Perfis: {{ userCompany.roles.map((r: any) => r.name).join(', ') }}</div>
												</div>
											</div>
											<q-separator spaced dark v-if="index < props.row.companies.length - 1" />
										</div>
									</div>
									<div v-else class="text-body2">Nenhum vinculo</div>
								</q-tooltip>
							</q-chip>
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

import SelectRole from '@/pages/Painel/Components/SelectRole.vue';
import SelectCompany from '@/pages/Painel/Components/Sidebar/SelectCompany.vue';

import { formatCPF } from '@/services';
import { api } from '@/services/api';
import { HttpException } from '@/services/http-exception';
import { parsePaginationFromQueryUrl, syncPaginationWithQueryUrl } from '@/services/sync-pagination-with-query-url';

import { Empresa } from '../Empresas/Empresas.types';
import DialogUsuario from './DialogUsuario.vue';
import { Role, Usuario, UsuarioWithPassword } from './Usuarios.types';

const $q = useQuasar();

const filter = reactive({
	search: '',
	companies: [] as Empresa[],
	roles: [] as Role[],
});

const usuarios = ref<Usuario[]>([]);

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

async function buscarUsuarios(props?: any) {
	loading.value = true;

	if (props?.pagination) {
		pagination.value = { ...pagination.value, ...props.pagination };
	}

	const { status, data } = await api.get('/user', {
		params: {
			filter: filter.search,
			companies: filter.companies.map((c) => String(c.id)),
			roles: filter.roles.map((r) => String(r.id)),
			...pagination.value,
		},
		signal: abortController.value.signal,
	});

	loading.value = false;

	if (status !== 200) {
		HttpException(data);
		return;
	}

	usuarios.value = data.data;
	pagination.value.rowsNumber = data.meta.rowsNumber;
}

onUnmounted(() => abortController.value.abort());

function onClickEdit(usuario: Usuario) {
	async function updateUser(usuario: Usuario & { password?: string }) {
		const payload = {
			...usuario,
			userCompanies: usuario.companies.map((c) => ({ id: c.company.id, roleIds: c.roles.map((r) => r.id) })),
		};

		const { status, data } = await api.patch(`/user/${usuario.id}`, payload);

		if (status !== 200) {
			HttpException(data);
			return false;
		}

		return true;
	}

	const dialog = $q
		.dialog({
			component: DialogUsuario,
			componentProps: {
				title: 'Editar usuário',
				loading: false,
				ignore_password: true,
				_usuario: cloneDeep(usuario),
			},
		})
		.onOk(async (user: Usuario & { password?: string }) => {
			dialog.update({ loading: true });

			const success = await updateUser(user);

			dialog.update({ loading: false });

			if (success) {
				await buscarUsuarios();
				$q.notify({ message: 'Usuário editado com sucesso!', type: 'positive' });
				dialog.hide();
			}
		});
}

function onClickView(usuario: Usuario) {
	$q.dialog({
		component: DialogUsuario,
		componentProps: {
			title: 'Visualizar usuário',
			ignore_password: true,
			readonly: true,
			_usuario: cloneDeep(usuario),
		},
	});
}

function onClickCreate() {
	async function createUser(usuario: UsuarioWithPassword) {
		const payload = {
			...usuario,
			userCompanies: usuario.companies.map((c) => ({ id: c.company.id, roleIds: c.roles.map((r) => r.id) })),
		};

		const { status, data } = await api.post('/user', payload);

		if (status !== 201) {
			HttpException(data);
			return false;
		}

		return true;
	}

	const dialog = $q
		.dialog({
			component: DialogUsuario,
			componentProps: {
				loading: false,
				title: 'Criar usuário',
				hide_password: true,
				_usuario: {
					name: '',
					email: '',
					cpf: '',
					active: true,
					companies: [],
				},
			},
		})
		.onOk(async (usuario: UsuarioWithPassword) => {
			dialog.update({ loading: true });

			const success = await createUser(usuario);

			dialog.update({ loading: false });

			if (success) {
				await buscarUsuarios();
				$q.notify({ message: 'Usuário criado com sucesso!', type: 'positive' });
				dialog.hide();
			}
		});
}
</script>
