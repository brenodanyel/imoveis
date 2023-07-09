<template>
	<q-card class="q-pa-md">
		<div class="row q-col-gutter-md">
			<div class="col-xs-12">
				<div>
					<SectionHeader title="Comodidades do imóvel" />
				</div>
			</div>
			<div class="col-xs-12 col-sm-6" v-for="comodidade of comodidades" :key="comodidade.id">
				<q-checkbox v-model="anuncio.comodidades" :label="comodidade.nome" :val="comodidade.nome" dense />
			</div>
		</div>
	</q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from '../../../../services/api';
import SectionHeader from '../../Components/SectionHeader.vue';
import { Anuncio, Comodidade } from '../Anuncio.types';

const { anuncio } = defineProps<{
	anuncio: Anuncio;
	readonly: boolean;
}>();

const comodidades = ref<Comodidade[]>([]);

async function buscarComodidades() {
	const { status, data } = await api.get('/comodidade');
	if (status !== 200) return;
	comodidades.value = data;
}

onMounted(buscarComodidades);
</script>
