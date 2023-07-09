<template>
	<q-card class="q-pa-md">
		<div class="row q-col-gutter-md">
			<div class="col-xs-12">
				<div>
					<SectionHeader title="Características do imóvel" />
				</div>
			</div>
			<div class="col-xs-12 col-sm-6" v-for="caracteristica of caracteristicas" :key="caracteristica.id">
				<q-input v-model.number="anuncio.caracteristicas[caracteristica.nome]" :label="caracteristica.nome" mask="###" placeholder="0" stack-label />
			</div>
		</div>
	</q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from '../../../../services/api';
import SectionHeader from '../../Components/SectionHeader.vue';
import { Anuncio, Caracteristica } from '../Anuncio.types';

const { anuncio } = defineProps<{
	anuncio: Anuncio;
	readonly: boolean;
}>();

const caracteristicas = ref<Caracteristica[]>([]);

async function buscarCaracteristicas() {
	const { status, data } = await api.get('/caracteristica');
	if (status !== 200) return;
	caracteristicas.value = data;
}

onMounted(buscarCaracteristicas);
</script>
