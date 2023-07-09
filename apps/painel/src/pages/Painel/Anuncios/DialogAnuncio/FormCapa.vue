<template>
	<q-card class="q-pa-md">
		<div class="row q-col-gutter-md">
			<div class="col-xs-12">
				<div>
					<SectionHeader title="Imagem principal do imóvel" />
				</div>
			</div>

			<div class="col-xs-12">
				<div class="row">
					<q-card class="self-start rounded-borders overflow-hidden" @mouseenter="isHover = true" @mouseleave="isHover = false">
						<q-img
							:src="anuncio.thumbnail || 'https://via.placeholder.com/1024'"
							alt="Imagem principal do imóvel"
							fit="cover"
							style="width: 200px; height: 200px"
						/>
						<transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" v-show="isHover">
							<div class="absolute-full flex flex-center q-gutter-sm">
								<template v-if="!anuncio.thumbnail">
									<q-btn icon="add" round class="bg-dark text-white" @click="buscarImagem()" :disable="readonly" />
								</template>
								<template v-else>
									<q-btn icon="edit" round class="bg-primary text-white" @click.stop="buscarImagem()" :disable="readonly" />
									<q-btn icon="delete" round class="bg-negative text-white" @click.stop="removerImagem()" :disable="readonly" />
								</template>
							</div>
						</transition>
						<q-inner-loading :showing="loading" />
					</q-card>
				</div>
			</div>
		</div>
	</q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { selectFile } from '../../../../services/';
import { api } from '../../../../services/api';
import { HttpException } from '../../../../services/http-exception';
import SectionHeader from '../../Components/SectionHeader.vue';
import { Anuncio } from '../Anuncio.types';

const $emit = defineEmits(['change-thumbnail']);

const props = defineProps<{
	anuncio: Anuncio;
	readonly: boolean;
}>();

const loading = ref(false);
const isHover = ref(false);

async function buscarImagem() {
	if (props.readonly) return;

	const file = (await selectFile({ accept: 'image/*', multiple: false })) as Blob;

	const formData = new FormData();
	formData.append('file', file);

	loading.value = true;

	const { status, data } = await api.post('/storage', formData);

	loading.value = false;

	if (status !== 201) {
		HttpException(data);
		return;
	}

	$emit('change-thumbnail', data.url);
}

async function removerImagem() {
	$emit('change-thumbnail', null);
}
</script>
