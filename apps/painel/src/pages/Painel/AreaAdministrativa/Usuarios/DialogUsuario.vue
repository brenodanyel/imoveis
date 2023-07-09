<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" maximized transition-show="slide-up" transition-hide="slide-down">
		<q-card>
			<q-form @submit.prevent="$emit('ok', { ...usuario, password })">
				<div class="bg-primary row justify-end">
					<div>
						<q-btn icon="close" class="text-white" dense round v-close-popup />
					</div>
				</div>

				<div class="column q-gutter-sm q-pa-md">
					<div>
						<Title :title="title" icon="person" dense>
							<div class="col-xs-12 col-md-auto">
								<q-btn icon="save" label="Salvar" class="bg-primary text-white full-width" type="submit" v-if="!readonly" />
							</div>
						</Title>
					</div>

					<div>
						<div class="row q-col-gutter-md">
							<div class="col-xs-12">
								<q-input
									v-model.trim="usuario.name"
									label="Nome"
									:readonly="readonly"
									:rules="[(v) => v.length > 3 || 'O nome de usuário deve ter pelo menos 3 caracteres']"
								/>
							</div>

							<div class="col-xs-12 col-md-6">
								<q-input v-model.trim="usuario.email" label="E-mail" :rules="[(v) => isEmail(v) || 'E-mail inválido']" :readonly="readonly" />
							</div>

							<div class="col-xs-12 col-md-6">
								<q-input
									v-model.trim="usuario.cpf"
									label="CPF"
									:rules="[(v) => cpf.isValid(v) || 'CPF inválido']"
									:readonly="readonly"
									mask="###.###.###-##"
									unmasked-value
								/>
							</div>

							<template v-if="!hide_password">
								<div class="col-xs-12 col-sm-6" v-if="!readonly">
									<q-input
										v-model.trim="password"
										label="Senha"
										:type="passwordVisible ? 'text' : 'password'"
										:rules="[ignore_password ? () => true : validatePassword]"
									>
										<template v-slot:append>
											<q-icon
												:name="passwordVisible ? 'visibility_off' : 'visibility'"
												class="cursor-pointer"
												@click="passwordVisible = !passwordVisible"
											/>
										</template>
									</q-input>
								</div>

								<div class="col-xs-12 col-sm-6" v-if="!readonly">
									<q-input
										v-model.trim="passwordConfirmation"
										label="Confirmação de senha"
										:type="passwordConfirmationVisible ? 'text' : 'password'"
										:rules="[
											ignore_password ? () => true : validatePassword,
											ignore_password ? () => true : (v) => v === password || 'As senhas não coincidem',
										]"
									>
										<template v-slot:append>
											<q-icon
												:name="passwordConfirmationVisible ? 'visibility_off' : 'visibility'"
												class="cursor-pointer"
												@click="passwordConfirmationVisible = !passwordConfirmationVisible"
											/>
										</template>
									</q-input>
								</div>
							</template>

							<div class="col-xs-12">
								<q-checkbox v-model="usuario.active" label="Usuário ativo" :disable="readonly" />
							</div>
						</div>
					</div>

					<div>
						<Title title="Vinculos deste usuário com empresas" dense>
							<div class="col-xs-12 col-md-auto">
								<q-btn icon="add" label="Adicionar vinculo" class="bg-accent text-white full-width" @click="onClickAdd" v-if="!readonly" />
							</div>
						</Title>
					</div>

					<div>
						<q-table
							:rows="usuario.companies"
							:columns="[
									{ label: 'Ações', align: 'left', name: 'actions', field: (item) => item },
									{ label: 'Empresa', align: 'left', name: 'company', field: (item) => item.company.name },
									{ label: 'Perfis', align: 'left', name: 'roles', field: (item) => item.roles.map((r: any) => r.name).join(', ') },
							]"
							:visible-columns="['company', 'roles', !readonly ? 'actions' : null]"
							wrap-cells
							table-header-class="bg-primary text-white"
							row-key="id"
							:loading="loading"
							:rows-per-page-options="[10, 25, 50, 100]"
							color="accent"
							binary-state-sort
						>
							<template v-slot:body-cell-actions="props">
								<td>
									<div class="row q-gutter-sm flex-center" style="max-width: 100px">
										<div>
											<q-btn icon="edit" dense round class="text-primary" @click="onClickEdit(props.row)" :disable="readonly" />
											<q-tooltip> Editar </q-tooltip>
										</div>
										<div>
											<q-btn icon="delete" dense round class="text-primary" @click="onClickDelete(props.row)" :disable="readonly" />
											<q-tooltip> Excluir </q-tooltip>
										</div>
									</div>
								</td>
							</template>
							<template v-slot:body-cell-company="scope">
								<td>
									<q-item>
										<q-item-section avatar>
											<q-icon name="business" color="primary" />
										</q-item-section>
										<q-item-section>
											<q-item-label>
												{{ scope.row.company.name }}
											</q-item-label>
											<q-item-label caption> {{ scope.row.company.id }} - {{ scope.row.company.cnpj }} </q-item-label>
										</q-item-section>
									</q-item>
								</td>
							</template>
						</q-table>
					</div>
				</div>
			</q-form>
			<q-inner-loading :showing="loading" />
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { cpf } from 'cpf-cnpj-validator';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import isEmail from 'validator/lib/isEmail';
import { ref } from 'vue';

import Title from '@/pages/Painel/Components/Title.vue';

import { validatePassword } from '@/services/common.validators';

import DialogConfirmarRemocaoVinculo from './DialogConfirmarRemocaoVinculo.vue';
import DialogSelecionarEmpresa from './DialogVinculo.vue';
import { UsuarioCompanies } from './Usuarios.types';

const $q = useQuasar();
const { dialogRef } = useDialogPluginComponent();

const props = defineProps<{
	loading?: boolean;
	title: string;
	readonly?: boolean;
	hide_password?: boolean;
	ignore_password?: boolean;
	_usuario: {
		name: string;
		email: string;
		cpf: string;
		active: boolean;
		companies: UsuarioCompanies[];
	};
}>();

const emit = defineEmits(useDialogPluginComponent.emits);

const usuario = ref({ ...props._usuario });

const password = ref('');
const passwordVisible = ref(false);

const passwordConfirmation = ref('');
const passwordConfirmationVisible = ref(false);

function onClickEdit(usuarioCompany: UsuarioCompanies) {
	const dialog = $q
		.dialog({
			component: DialogSelecionarEmpresa,
			componentProps: {
				title: 'Editar vinculo',
				disableCompany: true,
				_selectedRoles: usuarioCompany.roles,
				_selectedCompany: usuarioCompany.company,
			},
		})
		.onOk((payload) => {
			usuario.value.companies = usuario.value.companies.map((c) => {
				if (c.id === usuarioCompany.id) {
					c.roles = payload.roles;
				}
				return c;
			});
			dialog.hide();
		});
}

function onClickDelete(usuarioCompany: UsuarioCompanies) {
	const dialog = $q
		.dialog({
			component: DialogConfirmarRemocaoVinculo,
			componentProps: {
				nomeEmpresa: usuarioCompany.company.name,
			},
		})
		.onOk(() => {
			usuario.value.companies = usuario.value.companies.filter((c) => c.id !== usuarioCompany.id);
			dialog.hide();
		});
}

function onClickAdd() {
	const dialog = $q
		.dialog({
			component: DialogSelecionarEmpresa,
			componentProps: {
				title: 'Vincular empresa',
				disableCompany: false,
				_selectedRoles: [],
				_selectedCompany: null,
			},
		})
		.onOk((payload) => {
			const found = usuario.value.companies.some((c) => payload.company.id === c.company.id);

			if (found) {
				return $q.notify({ type: 'negative', message: 'Esse usuário já está vinculado com essa empresa.' });
			}

			usuario.value.companies.push({
				id: usuario.value.companies.length,
				company: payload.company,
				roles: payload.roles,
			});

			dialog.hide();
		});
}
</script>
