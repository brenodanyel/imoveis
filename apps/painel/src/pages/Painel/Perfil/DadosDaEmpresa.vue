divdiv
<template>
	<div class="q-pa-md">
		<q-form class="column q-gutter-sm" @submit.prevent="onSubmit()" @reset="onReset">
			<Title title="Dados da empresa" icon="badge" dense>
				<div class="row q-col-gutter-sm">
					<div class="col-xs-12 col-sm-auto" v-if="readonly">
						<q-btn icon="edit" label="Editar" class="bg-positive text-white full-width" @click="readonly = false" />
					</div>
					<template v-else>
						<div class="col-xs-12 col-sm-auto">
							<q-btn icon="cancel" label="Cancelar" class="bg-negative text-white full-width" type="reset" />
						</div>
						<div class="col-xs-12 col-sm-auto">
							<q-btn icon="save" label="Salvar" class="bg-primary text-white full-width" type="submit" :loading="submitting" />
						</div>
					</template>
				</div>
			</Title>

			<div v-if="empresa">
				<div class="column q-gutter-sm">
					<div>
						<SectionHeader title="Dados da cadastrais" />
					</div>

					<div>
						<div class="row q-col-gutter-sm">
							<div class="col-xs-12 col-md-6">
								<q-input
									v-model.trim="empresa.name"
									label="Nome"
									:readonly="readonly"
									:rules="[(v) => v.length >= 5 || 'O nome da empresa deve ter pelo menos 5 caracteres']"
								/>
							</div>
							<div class="col-xs-12 col-md-6">
								<q-input
									v-model.trim="empresa.cnpj"
									mask="##.###.###/####-##"
									unmasked-value
									label="CNPJ"
									:readonly="readonly"
									:rules="[isMainCompany(empresa) ? () => true : (v) => cnpj.isValid(v) || 'CNPJ inválido']"
								/>
							</div>
						</div>
					</div>

					<div>
						<SectionHeader title="Contato" />
					</div>

					<div>
						<div class="row q-col-gutter-sm">
							<div class="col-xs-12">
								<q-input
									v-model.trim="empresa.phone_number"
									label="Número de telefone"
									mask="(##) # ####-####"
									unmasked-value
									:readonly="readonly"
									:rules="[(v) => isMobilePhone(v, 'pt-BR') || 'Telefone inválido']"
								/>
							</div>
						</div>
					</div>

					<template v-if="empresa.address">
						<div>
							<SectionHeader title="Endereço" />
						</div>

						<div>
							<div class="row q-col-gutter-sm">
								<div class="col-xs-12 col-md-4">
									<q-input
										v-model="empresa.address.zipCode"
										label="CEP"
										mask="#####-###"
										unmasked-value
										:readonly="readonly"
										:rules="[(v) => v?.length === 8 || 'O CEP tem que ter 8 caracteres.']"
										@blur="fetchCEP()"
										ref="refCep"
										:loading="buscandoCep"
									/>
								</div>
								<div class="col-xs-12 col-md-8">
									<q-input
										v-model.trim="empresa.address.street"
										label="Rua"
										:readonly="readonly"
										:rules="[(v) => v?.length >= 4 || 'Endereço deve ter pelo menos 4 caracteres']"
									/>
								</div>
								<div class="col-xs-12 col-md-3">
									<q-input
										v-model.trim="empresa.address.number"
										label="Número"
										ref="refNumber"
										:readonly="readonly"
										:rules="[(v) => v?.length >= 1 || 'Número não pode estar vazio']"
									/>
								</div>
								<div class="col-xs-12 col-md-9">
									<q-input v-model.trim="empresa.address.complement" label="Complemento" :readonly="readonly" />
								</div>
								<div class="col-xs-12 col-md-6">
									<q-input
										v-model.trim="empresa.address.district"
										label="Bairro"
										:readonly="readonly"
										:rules="[(v) => v?.length >= 4 || 'Bairro deve ter pelo menos 4 caracteres']"
									/>
								</div>
								<div class="col-xs-12 col-md-6">
									<q-input
										v-model.trim="empresa.address.city"
										label="Cidade"
										:readonly="readonly"
										:rules="[(v) => v?.length >= 4 || 'Cidade deve ter pelo menos 4 caracteres']"
									/>
								</div>
								<div class="col-xs-12 col-md-6">
									<q-select
										v-model="empresa.address.state"
										label="Estado"
										:readonly="readonly"
										:options="estados"
										map-options
										emit-value
										:rules="[(v) => !!v || 'Campo obrigatório']"
									/>
								</div>
								<div class="col-xs-12 col-md-6">
									<q-select
										v-model="empresa.address.country"
										label="País"
										:readonly="readonly"
										:options="paises"
										map-options
										emit-value
										:rules="[(v) => !!v || 'Campo obrigatório']"
									/>
								</div>
							</div>
						</div>
					</template>
				</div>
				<q-inner-loading :showing="fetching" label="Buscando informações sobre a empresa" />
			</div>
		</q-form>
	</div>
</template>

<script setup lang="ts">
import { cnpj } from 'cpf-cnpj-validator';
import { cloneDeep } from 'lodash';
import { useQuasar } from 'quasar';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Title from '@/pages/Painel/Components/Title.vue';

import { isMainCompany } from '@/services';
import { buscarCep } from '@/services';
import { api } from '@/services/api';
import { estados, paises } from '@/services/constants';
import { HttpException } from '@/services/http-exception';

import { Empresa } from '../AreaAdministrativa/Empresas/Empresas.types';
import SectionHeader from '../Components/SectionHeader.vue';

const $router = useRouter();
const $q = useQuasar();

const fetching = ref(false);
const submitting = ref(false);
const readonly = ref(true);

const empresa = ref<Empresa>({ address: {} } as Empresa);

const empresaOriginal = ref<Empresa>(cloneDeep(empresa.value) as Empresa);

const buscandoCep = ref(false);

const refCep = ref();
const refNumber = ref();

onMounted(async () => {
	fetching.value = true;

	const { status, data } = await api.get('/my-company');

	fetching.value = false;

	if (status !== 200) {
		HttpException(data);
		$router.push({ name: 'perfil' });
		return;
	}

	if (!data.address) {
		data.address = {};
	}

	empresa.value = data;
	empresaOriginal.value = cloneDeep(data);
});

async function onSubmit() {
	submitting.value = true;

	const { status, data } = await api.patch('/my-company', empresa.value);

	submitting.value = false;

	if (status !== 200) {
		HttpException(data);
		return;
	}

	readonly.value = true;
	empresaOriginal.value = cloneDeep(empresa.value);

	$q.notify({
		type: 'positive',
		message: 'Empresa atualizada com sucesso',
	});
}

async function onReset() {
	empresa.value = cloneDeep(empresaOriginal.value);
	readonly.value = true;
}

async function fetchCEP() {
	if (empresa.value.address?.zipCode?.length !== 8) return;

	buscandoCep.value = true;

	try {
		const { status, data } = await buscarCep(empresa.value.address.zipCode);

		if (status !== 200) {
			throw new Error();
		}

		empresa.value.address.district = data.neighborhood;
		empresa.value.address.city = data.city;
		empresa.value.address.state = data.state;
		empresa.value.address.street = data.street;
		empresa.value.address.country = 'BR';

		refNumber.value?.focus();
	} catch {
		refCep.value?.focus();
		HttpException({ message: 'CEP não encontrado' });
	} finally {
		buscandoCep.value = false;
	}
}
</script>
