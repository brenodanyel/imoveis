<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" maximized transition-show="slide-up" transition-hide="slide-down">
		<q-card>
			<q-form @submit.prevent="$emit('ok', empresa)" class="full-height column">
				<div>
					<div class="bg-primary row justify-end">
						<div>
							<q-btn icon="close" class="text-white" dense round v-close-popup />
						</div>
					</div>
				</div>

				<div class="col-grow">
					<div class="column q-gutter-sm q-pa-sm full-height">
						<div>
							<Title :title="title" dense>
								<div class="col-xs-12 col-md-auto">
									<q-btn icon="save" label="Salvar" class="bg-primary text-white full-width" type="submit" v-if="!readonly" />
								</div>
							</Title>
						</div>

						<div class="col-grow">
							<q-scroll-area style="height: 100%">
								<div class="column q-gutter-md">
									<div>
										<SectionHeader title="Dados da empresa" />
									</div>

									<div>
										<div class="row q-col-gutter-md">
											<div class="col-xs-12 col-md-6">
												<q-input
													v-model.trim="empresa.name"
													label="Nome"
													:readonly="readonly"
													:rules="[(v) => v.length > 3 || 'O nome da empresa deve ter pelo menos 3 caracteres']"
												/>
											</div>

											<div class="col-xs-12 col-md-6">
												<q-input
													v-model.trim="empresa.cnpj"
													label="CNPJ"
													mask="##.###.###/####-##"
													unmasked-value
													:readonly="readonly"
													:rules="[isMainCompany(empresa) ? () => true : (v) => cnpj.isValid(v) || 'CNPJ inválido']"
												/>
											</div>
										</div>
									</div>

									<div>
										<SectionHeader title="Dados de contato" />
									</div>

									<div>
										<div class="row q-col-gutter-md">
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

									<div>
										<SectionHeader title="Endereço" />
									</div>

									<div>
										<div class="row q-col-gutter-md">
											<div class="col-xs-12 col-md-4">
												<q-input
													v-model.trim="empresa.address.zipCode"
													label="CEP"
													unmasked-value
													mask="#####-###"
													:readonly="readonly"
													:rules="[(v) => v.length === 8 || 'O CEP tem que ter 8 caracteres.']"
													ref="refCep"
													@blur="fetchCEP"
													:loading="buscandoCep"
												/>
											</div>
											<div class="col-xs-12 col-md-8">
												<q-input
													v-model.trim="empresa.address.street"
													label="Rua"
													:readonly="readonly"
													:rules="[(v) => v.length >= 2 || 'A rua tem que ter pelo menos 2 caracteres.']"
												/>
											</div>
											<div class="col-xs-12 col-md-4">
												<q-input
													v-model.trim="empresa.address.number"
													label="Número"
													:readonly="readonly"
													:rules="[(v) => v.length >= 1 || 'O número tem que ter menos 1 caracteres.']"
													ref="refNumber"
												/>
											</div>
											<div class="col-xs-12 col-md-8">
												<q-input v-model.trim="empresa.address.complement" label="Complemento" :readonly="readonly" />
											</div>
											<div class="col-xs-12 col-md-4">
												<q-input v-model.trim="empresa.address.district" label="Bairro" :readonly="readonly" />
											</div>
											<div class="col-xs-12 col-md-3">
												<q-input v-model.trim="empresa.address.city" label="Cidade" :readonly="readonly" />
											</div>
											<div class="col-xs-12 col-md-3">
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
											<div class="col-xs-12 col-md-2">
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

									<div>
										<SectionHeader title="Plano" />
									</div>

									<div>
										<div class="row q-col-gutter-md">
											<div class="col-xs-12">
												<SelectPlan :selected="empresa.companyPlan.plan" @update:selected="empresa.companyPlan.plan = $event" :readonly="readonly">
													<template v-slot:append v-if="empresa.companyPlan.plan">
														<q-icon name="info">
															<q-tooltip class="bg-primary text-14" style="width: 15em">
																<div class="row q-gutter-sm justify-between">
																	<div>Valor:</div>
																	<div>{{ formatCurrency(empresa.companyPlan.plan.price) }}</div>
																</div>
																<div class="row q-gutter-sm justify-between">
																	<div>Limite de usuários:</div>
																	<div>{{ empresa.companyPlan.plan.limit_users }}</div>
																</div>
															</q-tooltip>
														</q-icon>
													</template>
												</SelectPlan>
											</div>
											<template v-if="empresa.companyPlan.plan">
												<div class="col-xs-12 col-md-6">
													<DateInput
														:date="empresa.companyPlan.paidAt"
														@update:selected="empresa.companyPlan.paidAt = $event"
														label="Data de inicio do plano"
														readonly
													/>
												</div>
												<div class="col-xs-12 col-md-6">
													<DateInput
														:readonly="readonly"
														:date="empresa.companyPlan.expiresAt"
														@update:selected="empresa.companyPlan.expiresAt = $event"
														label="Data de expiração"
													/>
												</div>
											</template>
										</div>
									</div>
								</div>
							</q-scroll-area>
						</div>
					</div>
				</div>
			</q-form>
			<q-inner-loading :showing="loading" />
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { cnpj } from 'cpf-cnpj-validator';
import { useDialogPluginComponent } from 'quasar';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { computed, reactive, ref } from 'vue';

import Title from '@/pages/Painel/Components/Title.vue';

import { buscarCep, formatCurrency, isMainCompany } from '@/services';
import { estados, paises } from '@/services/constants';
import { dayjs } from '@/services/dayjs';
import { HttpException } from '@/services/http-exception';

import DateInput from '../../Components/DateInput.vue';
import SectionHeader from '../../Components/SectionHeader.vue';
import SelectPlan from '../../Components/SelectPlan.vue';
import { Plano } from '../Planos/Plano.types';

const { dialogRef } = useDialogPluginComponent();

const props = defineProps<{
	loading?: boolean;
	title: string;
	ignore_password?: boolean;
	mode: 'create' | 'edit' | 'view';
	_empresa: {
		id: number;
		name: string;
		cnpj: string;
		phone_number: string;
		address: {
			street: string;
			number: string;
			complement: string;
			district: string;
			city: string;
			state: string;
			country: string;
			zipCode: string;
		} | null;
		companyPlan: {
			paidAt: string;
			expiresAt: string;
			plan: Plano;
		} | null;
	};
}>();

const readonly = computed(() => props.mode === 'view');

const emit = defineEmits(useDialogPluginComponent.emits);

const empresa = reactive({
	...props._empresa,

	address: props._empresa.address || {
		street: '',
		number: '',
		complement: '',
		district: '',
		city: '',
		state: '',
		country: '',
		zipCode: '',
	},

	companyPlan: props._empresa.companyPlan || {
		paidAt: dayjs().toISOString(),
		expiresAt: dayjs().add(7, 'days').toISOString(),
		plan: null,
	},
});

const buscandoCep = ref(false);
const refCep = ref();
const refNumber = ref();

async function fetchCEP() {
	if (empresa.address?.zipCode.length !== 8) return;

	buscandoCep.value = true;

	try {
		const { status, data } = await buscarCep(empresa.address.zipCode);

		if (status !== 200) {
			throw new Error('CEP inválido');
		}

		empresa.address.district = data.neighborhood;
		empresa.address.city = data.city;
		empresa.address.state = data.state;
		empresa.address.street = data.street;
		empresa.address.country = 'BR';

		refNumber.value?.focus();
	} catch {
		refCep.value?.focus();
		HttpException({ message: 'CEP não encontrado' });
	} finally {
		buscandoCep.value = false;
	}
}
</script>
