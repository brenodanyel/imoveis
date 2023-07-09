<template>
	<q-form class="column q-gutter-sm q-pa-md" @submit.prevent="onSubmit()" @reset="onReset()">
		<div>
			<Title title="Dados pessoais" icon="person" dense>
				<div class="col-xs-12 col-sm-auto">
					<div>
						<div class="row q-col-gutter-sm">
							<div class="col-xs-12 col-sm-auto" v-if="readonly">
								<q-btn icon="edit" label="Editar" class="bg-positive text-white full-width" @click="readonly = false" />
							</div>
							<template v-else>
								<div class="col-xs-12 col-sm-auto">
									<q-btn icon="cancel" label="Cancelar" class="bg-negative text-white full-width" type="reset" />
								</div>
								<div class="col-xs-12 col-sm-auto">
									<q-btn icon="save" label="Salvar" class="bg-primary text-white full-width" type="submit" :loading="loading" />
								</div>
							</template>
						</div>
					</div>
				</div>
			</Title>
		</div>
		<div>
			<div class="row q-col-gutter-sm">
				<div class="col-xs-12 col-md-6">
					<q-input label="Nome de perfil" v-model.trim="user.name" :readonly="readonly" />
				</div>
				<div class="col-xs-12 col-md-6">
					<q-input
						label="CPF"
						v-model.trim="user.cpf"
						mask="###.###.###-##"
						unmasked-value
						:rules="[(v) => cpf.isValid(v) || 'CPF Inválido.']"
						:readonly="readonly"
					/>
				</div>
				<div class="col-xs-12">
					<q-input label="E-mail" v-model.trim="user.email" :rules="[(v) => isEmail(v) || 'E-mail Inválido.']" :readonly="readonly" />
				</div>
				<div class="col-xs-12 col-md-auto">
					<q-btn label="Alterar senha" icon="lock_reset" class="bg-primary text-white full-width" @click="onClickChangePassword()" />
				</div>
			</div>
		</div>
	</q-form>
</template>

<script setup lang="ts">
import { cpf } from 'cpf-cnpj-validator';
import { useQuasar } from 'quasar';
import isEmail from 'validator/lib/isEmail';
import { reactive, ref } from 'vue';

import Title from '@/pages/Painel/Components/Title.vue';

import { api } from '@/services/api';
import { HttpException } from '@/services/http-exception';

import { useAuthStore, User } from '@/boot/stores';

import DialogTrocaDeSenha from './DialogTrocaDeSenha.vue';

const $authStore = useAuthStore();
const $q = useQuasar();

const readonly = ref(true);
const loading = ref(false);

const user = reactive({
	name: $authStore.user?.name || '',
	cpf: $authStore.user?.cpf || '',
	email: $authStore.user?.email || '',
});

function onReset() {
	user.name = $authStore.user?.name || '';
	user.cpf = $authStore.user?.cpf || '';
	user.email = $authStore.user?.email || '';
	readonly.value = true;
}

async function onSubmit() {
	loading.value = true;

	const { status, data } = await api.patch('/me', user);

	loading.value = false;

	if (status !== 200) {
		HttpException(data);
		return;
	}

	$authStore.user = {
		...$authStore.user,
		...data,
	};

	readonly.value = true;

	$q.notify({ message: 'Dados atualizados com sucesso!', type: 'positive' });
}

function onClickChangePassword() {
	const dialog = $q.dialog({ component: DialogTrocaDeSenha });

	dialog.onOk(async (payload: { senhaAtual: string; senhaNova: string }) => {
		dialog.update({ loading: true });

		const { status, data } = await api.patch('/me', {
			password: payload.senhaNova,
			oldPassword: payload.senhaAtual,
		});

		dialog.update({ loading: false });

		if (status !== 200) {
			HttpException(data);
			return;
		}

		$q.notify({ message: 'Senha alterada com sucesso!', type: 'positive' });

		dialog.hide();
	});
}
</script>
