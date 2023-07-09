<template>
	<q-card class="q-pa-md">
		<div class="row q-col-gutter-md">
			<div class="col-xs-12">
				<div>
					<SectionHeader title="Endereço" />
				</div>
			</div>
			<div class="col-xs-12 col-md-4">
				<q-input
					v-model.trim="anuncio.endereco.cep"
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
					v-model.trim="anuncio.endereco.rua"
					label="Rua"
					:readonly="readonly"
					:rules="[(v) => v.length >= 2 || 'A rua tem que ter pelo menos 2 caracteres.']"
				/>
			</div>
			<div class="col-xs-12 col-md-4">
				<q-input
					v-model.trim="anuncio.endereco.numero"
					label="Número"
					:readonly="readonly"
					:rules="[(v) => v.length >= 1 || 'O número tem que ter menos 1 caracteres.']"
					ref="refNumber"
				/>
			</div>
			<div class="col-xs-12 col-md-8">
				<q-input v-model.trim="anuncio.endereco.complemento" label="Complemento" :readonly="readonly" />
			</div>
			<div class="col-xs-12">
				<q-input v-model.trim="anuncio.endereco.bairro" label="Bairro" :readonly="readonly" />
			</div>
			<div class="col-xs-12">
				<q-input v-model.trim="anuncio.endereco.cidade" label="Cidade" :readonly="readonly" />
			</div>
			<div class="col-xs-12 col-md-6">
				<q-select
					v-model="anuncio.endereco.estado"
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
					v-model="anuncio.endereco.pais"
					label="País"
					:readonly="readonly"
					:options="paises"
					map-options
					emit-value
					:rules="[(v) => !!v || 'Campo obrigatório']"
				/>
			</div>
		</div>
	</q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { buscarCep } from '../../../../services';
import { estados, paises } from '../../../../services/constants';
import { HttpException } from '../../../../services/http-exception';
import SectionHeader from '../../Components/SectionHeader.vue';
import { Anuncio } from '../Anuncio.types';

const { anuncio } = defineProps<{
	anuncio: Anuncio;
	readonly: boolean;
}>();

const buscandoCep = ref(false);
const refCep = ref();
const refNumber = ref();

async function fetchCEP() {
	if (anuncio.endereco?.cep.length !== 8) return;

	buscandoCep.value = true;

	try {
		const { status, data } = await buscarCep(anuncio.endereco.cep);

		if (status !== 200) {
			throw new Error('CEP inválido');
		}

		anuncio.endereco.bairro = data.neighborhood;
		anuncio.endereco.cidade = data.city;
		anuncio.endereco.estado = data.state;
		anuncio.endereco.rua = data.street;
		anuncio.endereco.pais = 'BR';

		refNumber.value?.focus();
	} catch {
		refCep.value?.focus();
		HttpException({ message: 'CEP não encontrado' });
	} finally {
		buscandoCep.value = false;
	}
}
</script>
