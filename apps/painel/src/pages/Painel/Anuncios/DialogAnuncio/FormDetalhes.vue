<template>
	<q-card class="q-pa-md">
		<div class="row q-col-gutter-md">
			<div class="col-xs-12">
				<div>
					<SectionHeader title="Detalhes do imóvel" />
				</div>
			</div>

			<div class="col-xs-12">
				<q-select v-model="anuncio.subcategoria.id" :options="categorias" label="Tipo de propriedade" map-options emit-value>
					<template v-slot:option="scope">
						<q-item v-bind="scope.itemProps" v-on="scope" dense>
							<q-item-section dense>
								<q-item-label v-if="scope.opt.group">{{ scope.opt.group }}</q-item-label>
								<q-item-label v-else class="q-ml-md">{{ scope.opt.label }}</q-item-label>
							</q-item-section>
						</q-item>
					</template>
				</q-select>
			</div>

			<div class="col-xs-12">
				<q-select v-model="anuncio.proposito" label="Propósito" :options="['Venda', 'Aluguel', 'Aluguel por temporada']" />
			</div>

			<div class="col-xs-12">
				<q-input
					v-model.number="anuncio.valor"
					:label="`Valor ${anuncio.proposito ? 'de ' + anuncio.proposito.toLowerCase() : ''} do imóvel`"
					prefix="R$"
					unmasked-value
					mask="##,##"
					reverse-fill-mask
					fill-mask="0"
				/>
			</div>

			<div class="col-xs-12 col-md-6">
				<q-input
					v-model.number="anuncio.valor_iptu"
					:label="`Valor do IPTU`"
					prefix="R$"
					unmasked-value
					mask="#,##"
					reverse-fill-mask
					fill-mask="0"
				/>
			</div>

			<div class="col-xs-12 col-md-6">
				<q-input
					v-model.number="anuncio.valor_condominio"
					:label="`Valor do condominio`"
					prefix="R$"
					unmasked-value
					mask="#,##"
					reverse-fill-mask
					fill-mask="0"
				/>
			</div>

			<div class="col-xs-12 col-md-6">
				<q-input
					v-model="anuncio.area_total"
					:rules="[(v) => (!!v && v !== 0) || '*Item obrigatório']"
					label="Área total"
					suffix="m²"
					unmasked-value
					mask="#.#"
					reverse-fill-mask
					fill-mask="0"
				/>
			</div>

			<div class="col-xs-12 col-md-6">
				<q-input
					v-model="anuncio.area_construida"
					:rules="[(v) => (!!v && v !== 0) || '*Item obrigatório']"
					label="Área construida"
					suffix="m²"
					unmasked-value
					mask="#.#"
					reverse-fill-mask
					fill-mask="0"
				/>
			</div>
		</div>
	</q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from '../../../../services/api';
import SectionHeader from '../../Components/SectionHeader.vue';
import { Anuncio, Categoria } from '../Anuncio.types';

const { anuncio } = defineProps<{
	anuncio: Anuncio;
	readonly: boolean;
}>();

const categorias = ref<Categoria[]>([]);

async function buscarCategorias() {
	const { status, data } = await api.get('/categorias');
	if (status !== 200) return;

	categorias.value = data.reduce((acc: any, curr: any) => {
		acc.push({
			group: curr.nome,
			disable: true,
		});

		curr.subcategorias.forEach((subcategoria: any) => {
			acc.push({
				label: subcategoria.nome,
				value: subcategoria.id,
			});
		});

		return acc;
	}, []);
}
onMounted(buscarCategorias);
</script>
