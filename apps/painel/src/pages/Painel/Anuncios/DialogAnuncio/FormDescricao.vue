<template>
	<q-card class="q-pa-md">
		<div class="row q-col-gutter-md">
			<div class="col-xs-12">
				<div>
					<SectionHeader title="Descrição do anúncio" />
				</div>
			</div>

			<div class="col-xs-12">
				<q-input
					v-model.trim="anuncio.titulo"
					label="Titulo do anúncio"
					:readonly="readonly"
					:rules="[(v) => v?.length >= 5 || 'O titulo tem que ter pelo menos 5 caracteres.']"
				/>
			</div>

			<div class="col-xs-12">
				<q-editor
					class="bg-transparent"
					v-model.trim="anuncio.descricao"
					label="Descrição"
					:readonly="readonly"
					stack-label
					placeholder="Insira aqui uma descrição bem detalhada do seu anúncio."
					:toolbar="[
						['bold', 'italic', 'strike', 'underline'],
						['ordered', 'unordered'],
						['undo', 'redo'],
					]"
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
