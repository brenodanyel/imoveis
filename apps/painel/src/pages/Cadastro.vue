<template>
	<div class="row window-height flex-center">
		<div class="col-grow full-height gt-sm">
			<q-img src="/login.jpg" alt="imagem login" style="width: 100%; height: 100%; display: block; object-fit: cover; object-position: center" />
		</div>

		<div class="col-auto">
			<q-form @submit.prevent="onSubmit" style="width: 40em" class="q-pa-xl">
				<q-card bordered>
					<q-card bordered class="row justify-center">
						<div class="q-pa-md">
							<div>
								<Logo />
							</div>
						</div>
					</q-card>
					<q-stepper v-model="step" ref="stepper" color="primary" animated>
						<template v-if="step <= 3">
							<q-step :name="1" title="Empresa" icon="business" :done="step > 1">
								<div class="row q-col-gutter-sm">
									<div class="col-xs-12">
										<div class="text-h5 text-weight-bold">Dados da empresa</div>
										<div>Preencha os dados da sua empresa para prosseguir com o cadastro</div>
									</div>

									<div class="col-xs-12">
										<q-input
											v-model="payload.company.cnpj"
											label="CNPJ da empresa"
											mask="##.###.###/####-##"
											unmasked-value
											:rules="[(v) => cnpj.isValid(v) || 'CNPJ inválido.']"
											@blur="fetchCNPJ"
											ref="refCnpj"
											:loading="fetchingCNPJ"
										/>
									</div>

									<div class="col-xs-12">
										<q-input
											v-model.trim="payload.company.name"
											label="Nome da empresa"
											:rules="[(v) => v.length >= 5 || 'O nome deve ter pelo menos 5 caracteres.']"
										/>
									</div>

									<div class="col-xs-12">
										<q-btn label="Avançar" class="bg-primary text-white full-width" type="submit" icon-right="keyboard_arrow_right" />
									</div>
								</div>
							</q-step>

							<q-step :name="2" title="Endereço" icon="home" :done="step > 2" @vue:mounted="fetchCEP()">
								<div class="row q-col-gutter-sm">
									<div class="col-xs-12">
										<div class="text-h5 text-weight-bold">Endereço</div>
										<div>Preencha o endereço da sua empresa para prosseguir com o cadastro</div>
									</div>

									<div class="col-xs-12">
										<q-input
											v-model.trim="payload.company.address.zipCode"
											label="CEP"
											mask="#####-###"
											unmasked-value
											:rules="[(v) => v.length !== 7 || 'CEP inválido']"
											@blur="fetchCEP"
											:loading="fetchingCEP"
										/>
									</div>

									<div class="col-xs-12">
										<q-input
											v-model.trim="payload.company.address.street"
											label="Rua"
											:rules="[(v) => v.length >= 3 || 'O endereço deve ter pelo menos 3 caracteres.']"
										/>
									</div>

									<div class="col-xs-4">
										<q-input
											v-model.trim="payload.company.address.number"
											label="Número"
											mask="#######"
											:rules="[(v) => v.length >= 1 || 'Campo obrigatório']"
										/>
									</div>

									<div class="col-xs-8">
										<q-input v-model.trim="payload.company.address.complement" label="Complemento" />
									</div>

									<div class="col-xs-12">
										<q-input
											v-model.trim="payload.company.address.district"
											label="Bairro"
											:rules="[(v) => v.length >= 3 || 'O bairro deve ter pelo menos 3 caracteres.']"
										/>
									</div>

									<div class="col-xs-6">
										<q-input
											v-model.trim="payload.company.address.city"
											label="Cidade"
											:rules="[(v) => v.length >= 3 || 'A cidade deve ter pelo menos 3 caracteres.']"
										/>
									</div>

									<div class="col-xs-6">
										<q-select
											v-model="payload.company.address.state"
											label="Estado"
											:options="estados"
											map-options
											emit-value
											:rules="[(v) => !!v || 'Campo obrigatório']"
										/>
									</div>

									<div class="full-width">
										<div class="row q-col-gutter-sm">
											<div class="col-xs-12 col-sm-6">
												<q-btn label="Voltar" class="bg-secondary text-white full-width" icon="keyboard_arrow_left" @click="step = 1" />
											</div>
											<div class="col-xs-12 col-sm-6">
												<q-btn label="Avançar" class="bg-primary text-white full-width" type="submit" icon-right="keyboard_arrow_right" />
											</div>
										</div>
									</div>
								</div>
							</q-step>

							<q-step :name="3" title="Usuário" icon="person">
								<div class="row q-col-gutter-sm">
									<div class="col-xs-12">
										<div class="text-h5 text-weight-bold">Dados pessoais</div>
										<div>Preencha os seus dados pessoais para finalizar o seu cadastro</div>
									</div>

									<div class="col-xs-12">
										<q-input
											v-model="payload.user.name"
											label="Nome completo"
											:rules="[(v) => v.length >= 5 || 'O nome deve ter pelo menos 5 caracteres.']"
										/>
									</div>

									<div class="col-xs-12">
										<q-input
											v-model="payload.user.cpf"
											label="CPF"
											mask="###.###.###-##"
											unmasked-value
											:rules="[(v) => cpf.isValid(v) || 'CPF inválido']"
										/>
									</div>

									<div class="col-xs-12">
										<q-input v-model="payload.user.email" label="E-mail" :rules="[(v) => isEmail(v) || 'E-mail inválido']" />
									</div>

									<div class="col-xs-12">
										<q-input
											v-model="payload.company.phone_number"
											label="Número de telefone"
											unmasked-value
											fill-mask="_"
											:mask="payload.company.phone_number.length > 9 ? '(##) #####-####' : '(##) ####-####'"
											:rules="[(v) => isMobilePhone(v, 'pt-BR') || 'Telefone inválido.']"
										/>
									</div>

									<div class="col-xs-12">
										<q-checkbox v-model="aceitouTermos" dense>
											<span class="text-caption">
												Li e aceito os
												<span target="_blank" class="text-underline text-primary" @click.stop="onClickVerTermos()">termos de uso.</span>
											</span>
										</q-checkbox>
									</div>

									<div class="full-width">
										<div class="row q-col-gutter-sm">
											<div class="col-xs-12 col-sm-6">
												<q-btn label="Voltar" class="bg-secondary text-white full-width" icon="keyboard_arrow_left" @click="step = 2" />
											</div>
											<div class="col-xs-12 col-sm-6">
												<q-btn label="Finalizar cadastro" class="bg-primary text-white full-width" type="submit" icon-right="check" />
											</div>
										</div>
									</div>
								</div>
								<q-inner-loading :showing="submitting" />
							</q-step>
						</template>

						<q-step v-else :name="4" title="Confirmação" icon="check">
							<div class="column q-col-gutter-sm">
								<div class="text-h5 text-weight-bold">Confirmação de cadastro</div>

								<div>
									Em breve você receberá uma mensagem de confirmação no email <b>{{ payload.user.email }}</b> com as instruções para ativar a sua
									conta.
								</div>

								<div class="text-caption">OBS: Verifique também a caixa de spam e lixo eletrônico.</div>
							</div>
						</q-step>
					</q-stepper>
				</q-card>
			</q-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { useQuasar } from 'quasar';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { reactive, ref } from 'vue';

import { buscarCNPJ, buscarCep } from '@/services';
import { api } from '@/services/api';
import { estados } from '@/services/constants';
import { HttpException } from '@/services/http-exception';

import Logo from '@/components/Logo.vue';

const $q = useQuasar();

const payload = reactive({
	company: {
		name: '',
		cnpj: '',
		phone_number: '',
		address: {
			street: '',
			number: '',
			district: '',
			complement: '',
			city: '',
			state: '',
			country: 'BR',
			zipCode: '',
		},
	},
	user: {
		name: '',
		cpf: '',
		email: '',
	},
});

const steps = {
	1: {
		onSubmit() {
			step.value = 2;
		},
	},
	2: {
		onSubmit() {
			step.value = 3;
		},
	},
	3: {
		async onSubmit() {
			if (!aceitouTermos.value) {
				$q.notify({ message: 'Você precisa aceitar os termos de uso para continuar.', type: 'negative' });
				return;
			}

			submitting.value = true;

			const { status, data } = await api.post('/auth/register', payload);

			submitting.value = false;

			if (status !== 201) {
				HttpException(data);
				return;
			}

			step.value = 4;
		},
	},
};

const step = ref(1);
const submitting = ref(false);

const aceitouTermos = ref(false);

const fetchingCNPJ = ref(false);
const fetchingCEP = ref(false);

const stepper = ref();

function onSubmit() {
	const data = steps[step.value as keyof typeof steps];
	if (data.onSubmit) data.onSubmit();
}

function fetchCNPJ() {
	if (!cnpj.isValid(payload.company.cnpj)) return;

	fetchingCNPJ.value = true;

	buscarCNPJ(payload.company.cnpj)
		.then(({ status, data }) => {
			if (status !== 200) throw new Error('CNPJ inválido');

			payload.company.name = data.nome_fantasia;
			payload.company.address.zipCode = data.cep;

			payload.company.address.district = data.bairro;
			payload.company.address.city = data.municipio;
			payload.company.address.state = data.uf;
			payload.company.address.street = data.logradouro;
			payload.company.address.number = data.numero;
			payload.company.address.complement = data.complemento;
		})
		.catch(() => {})
		.finally(() => {
			fetchingCNPJ.value = false;
		});
}

function fetchCEP() {
	if (payload.company.address.zipCode.length !== 8) return;

	fetchingCEP.value = true;

	buscarCep(payload.company.address.zipCode)
		.then(({ status, data }) => {
			if (status !== 200) throw new Error('CEP inválido');

			payload.company.address.district = data.neighborhood;
			payload.company.address.city = data.city;
			payload.company.address.state = data.state;
			payload.company.address.street = data.street;
		})
		.catch(() => {})
		.finally(() => {
			fetchingCEP.value = false;
		});
}

function onClickVerTermos() {
	$q.dialog({
		title: 'Termos de uso',
		ok: false,
		html: true,
		message: `Laboris magna esse laboris excepteur. Elit quis fugiat excepteur enim anim est voluptate ea magna cupidatat incididunt ut quis. Aute cupidatat deserunt enim voluptate ullamco non exercitation dolor est ut commodo amet. In voluptate reprehenderit dolore ea laboris. Cupidatat et do incididunt laboris qui adipisicing ut Lorem reprehenderit anim ad incididunt anim ad.

<br/>
<br/>

Ex cillum non eu ullamco ut. Sit aliquip magna pariatur et nulla tempor veniam ullamco voluptate magna cupidatat deserunt proident. Nulla ea adipisicing id nisi eiusmod esse deserunt nisi enim ipsum anim commodo fugiat.

<br/>
<br/>

Est pariatur in officia commodo do aliquip elit officia elit aliquip cupidatat consectetur in. Do ea do est nisi excepteur consequat Lorem aute. Nulla consequat ad cillum velit sunt elit sunt ad minim aliqua cupidatat aute cupidatat sunt. Esse ut irure do tempor pariatur consequat laboris pariatur. Labore sit commodo reprehenderit ullamco anim qui consectetur fugiat anim. Proident eiusmod consequat in aliquip irure laborum dolore excepteur dolore.

<br/>
<br/>

Elit voluptate eiusmod esse minim incididunt laborum. Dolore commodo nisi incididunt nisi commodo enim qui reprehenderit fugiat. Lorem exercitation sunt ullamco occaecat nulla ipsum aute sit enim elit. Fugiat ipsum id duis anim qui aliqua. Qui consequat magna voluptate adipisicing est dolore. Pariatur ipsum aliquip anim sint est non elit ipsum. Anim minim fugiat dolore duis id eiusmod proident consectetur sit dolor ipsum ad.`,
	});
}
</script>
