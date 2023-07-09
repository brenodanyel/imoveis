<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" persistent>
		<q-card class="q-pa-md" style="width: 70%; min-width: 25em; max-width: 50em">
			<q-form class="column q-gutter-sm" @submit.prevent="onSubmit()">
				<div>
					<div class="row items-center justify-between">
						<div class="text-primary text-h6 text-weight-bold">Convidar usuário</div>
						<div>
							<q-btn icon="close" dense round v-close-popup />
						</div>
					</div>
				</div>

				<template v-if="step === 'buscar-usuario-por-email'">
					<div>Insira abaixo o e-mail do usuário que você deseja convidar.</div>

					<div>
						<div class="row q-col-gutter-md">
							<div class="col-xs-12">
								<q-input label="E-mail" v-model.trim="usuario.email" :rules="[(v) => isEmail(v) || 'E-mail inválido.']" />
							</div>
						</div>
					</div>

					<div>
						<div class="row q-col-gutter-xs justify-end">
							<div class="col-xs-12 col-md-auto">
								<q-btn
									icon-right="keyboard_double_arrow_right"
									label="Avançar"
									class="bg-primary text-white full-width"
									type="submit"
									:loading="steps['buscar-usuario-por-email'].loading"
								/>
							</div>
						</div>
					</div>
				</template>

				<template v-else-if="step === 'criar-usuario'">
					<div>Este e-mail não está vinculado com nenhum usuário na plataforma.</div>
					<div>Insira os dados abaixo para realizar o cadastro</div>

					<div>
						<div class="row q-col-gutter-md">
							<div class="col-xs-12">
								<q-input label="E-mail" readonly v-model="usuario.email" :rules="[(v) => isEmail(v) || 'E-mail inválido.']" />
							</div>
							<div class="col-xs-12">
								<q-input
									label="Nome do usuário"
									v-model="usuario.name"
									:rules="[(v) => v.length > 3 || 'O nome deve ter pelo menos 3 caracteres.']"
								/>
							</div>
							<div class="col-xs-12">
								<q-input label="CPF" v-model="usuario.cpf" mask="###.###.###-##" unmasked-value :rules="[(v) => cpf.isValid(v) || 'CPF inválido.']" />
							</div>
							<div class="col-xs-12">
								<SelectRole :selected="usuario.roles" multiple @update:selected="usuario.roles = $event" />
							</div>
						</div>
					</div>

					<div>
						<div class="row q-col-gutter-xs justify-between">
							<div class="col-xs-12 col-md-auto">
								<q-btn
									icon="keyboard_double_arrow_left"
									label="Voltar"
									class="bg-negative text-white full-width"
									@click="step = 'buscar-usuario-por-email'"
								/>
							</div>
							<div class="col-xs-12 col-md-auto">
								<q-btn
									icon="save"
									label="Cadastrar usuário"
									class="bg-primary text-white full-width"
									type="submit"
									:loading="steps['criar-usuario'].loading"
								/>
							</div>
						</div>
					</div>
				</template>

				<template v-else-if="step === 'usuario-existe-selecionar-perfis'">
					<div>Este e-mail está vinculado com um usuário existente na plataforma.</div>
					<div>Insira abaixo os perfis que você deseja atribuir a este usuário.</div>

					<div>
						<div class="row q-col-gutter-md">
							<div class="col-xs-12">
								<q-input label="E-mail" readonly v-model="usuario.email" :rules="[(v) => isEmail(v) || 'E-mail inválido.']" />
							</div>
							<div class="col-xs-12">
								<q-input
									label="Nome do usuário"
									v-model="usuario.name"
									readonly
									:rules="[(v) => v.length > 3 || 'O nome deve ter pelo menos 3 caracteres.']"
								/>
							</div>
							<div class="col-xs-12">
								<SelectRole :selected="usuario.roles" multiple @update:selected="usuario.roles = $event" />
							</div>
						</div>
					</div>

					<div>
						<div class="row q-col-gutter-xs justify-between">
							<div class="col-xs-12 col-md-auto">
								<q-btn
									icon="keyboard_double_arrow_left"
									label="Voltar"
									class="bg-negative text-white full-width"
									@click="step = 'buscar-usuario-por-email'"
								/>
							</div>
							<div class="col-xs-12 col-md-auto">
								<q-btn
									icon="save"
									label="Convidar usuário"
									class="bg-primary text-white full-width"
									type="submit"
									:loading="steps['usuario-existe-selecionar-perfis'].loading"
								/>
							</div>
						</div>
					</div>
				</template>

				<template v-if="step === 'final'">
					<q-icon name="check_circle" color="primary" size="5em" class="q-mx-auto" />
					<div class="text-center text-20">
						<b>{{ usuario.name }}</b>
						foi convidado!
					</div>
					<div class="text-center">
						Um e-mail foi enviado para <b>{{ usuario.email }}</b> com as instruções para aceitar o convite.
					</div>
				</template>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { cpf } from 'cpf-cnpj-validator';
import { useDialogPluginComponent } from 'quasar';
import isEmail from 'validator/lib/isEmail';
import { reactive, ref } from 'vue';

import { api } from '@/services/api';
import { HttpException } from '@/services/http-exception';

import SelectRole from '../Components/SelectRole.vue';
import { Usuario } from './Usuario.type';

const steps = reactive({
	'buscar-usuario-por-email': {
		loading: false,
		async onSubmit() {
			this.loading = true;

			const { status: statusFindUser, data: dataFindUser } = await api.get('/user/findBy', { params: { email: usuario.value.email } });

			if (statusFindUser !== 200) {
				step.value = 'criar-usuario';
				this.loading = false;
				return;
			}

			usuario.value = { ...usuario.value, ...dataFindUser };

			const { status: statusVerify, data: dataVerify } = await api.get(`/my-company/users/${dataFindUser.id}/verify`);

			if (statusVerify !== 200) {
				this.loading = false;
				HttpException(dataVerify);
				return;
			}

			step.value = 'usuario-existe-selecionar-perfis';
			this.loading = false;
		},
	},
	'criar-usuario': {
		loading: false,
		async onSubmit() {
			this.loading = true;

			const { status, data } = await api.post('/my-company/users', {
				...usuario.value,
				roles: usuario.value.roles.map((role) => role.id),
			});

			this.loading = false;

			if (status !== 201) {
				HttpException(data);
				return;
			}

			emit('ok');
		},
	},
	'usuario-existe-selecionar-perfis': {
		loading: false,
		async onSubmit() {
			this.loading = true;

			const { status, data } = await api.post(`/my-company/users/${usuario.value.id}`, {
				roles: usuario.value.roles.map((role) => role.id),
			});

			this.loading = false;

			if (status !== 201) {
				HttpException(data);
				return;
			}

			// emit("ok");

			step.value = 'final';
		},
	},
	final: {
		onSubmit() {},
	},
});

const step = ref<keyof typeof steps>('buscar-usuario-por-email');

const usuario = ref<Usuario>({
	email: '',
	active: true,
	id: 0,
	name: '',
	cpf: '',
	roles: [],
});

const emit = defineEmits(useDialogPluginComponent.emits);

const { dialogRef } = useDialogPluginComponent();

async function onSubmit() {
	const stepSettings = steps[step.value];

	if (stepSettings.onSubmit) {
		await stepSettings.onSubmit();
	}
}
</script>
