<template>
	<q-card class="q-pa-md">
		<div class="row q-col-gutter-md">
			<div class="col-xs-12">
				<div>
					<SectionHeader title="Imagens do imóvel" />
				</div>
			</div>
			<div class="col-xs-12">
				<div class="row q-gutter-md">
					<q-card
						v-for="(imagem, index) in anuncio.imagens"
						:key="imagem.url"
						class="self-start rounded-borders overflow-hidden"
						@mouseenter="isHover[imagem.url] = true"
						@mouseleave="isHover[imagem.url] = false"
					>
						<q-img
							:src="imagem.url || 'https://via.placeholder.com/1024'"
							alt="Imagem principal do imóvel"
							fit="cover"
							style="width: 120px; height: 120px"
						/>
						<transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" v-show="isHover[imagem.url]">
							<div class="absolute-full flex flex-center q-gutter-sm">
								<q-btn icon="delete" round class="bg-negative text-white" @click.stop="removerImagem(index)" :disable="readonly" />
							</div>
						</transition>
					</q-card>

					<q-card class="self-start rounded-borders overflow-hidden">
						<q-img src="https://via.placeholder.com/1024" alt="Imagem principal do imóvel" fit="cover" style="width: 120px; height: 120px" />
						<div class="absolute-full flex flex-center q-gutter-sm">
							<q-btn icon="add" round class="bg-primary text-white" @click.stop="onAdd()" :disable="readonly" :loading="loading" />
						</div>
					</q-card>
				</div>
			</div>
		</div>
	</q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { selectFile } from '../../../../services';
import { api } from '../../../../services/api';
import { HttpException } from '../../../../services/http-exception';
import SectionHeader from '../../Components/SectionHeader.vue';
import { Anuncio } from '../Anuncio.types';

const $q = useQuasar();

const props = defineProps<{
	anuncio: Anuncio;
	readonly: boolean;
}>();

const $emit = defineEmits(['change:imagens']);

const isHover = ref<{ [key: string]: boolean }>({});
const loading = ref(false);

async function onAdd() {
	if (props.readonly) return;

	if (props.anuncio.imagens.length >= 10) {
		$q.notify({ message: 'Você já adicionou o máximo de imagens permitidas.', type: 'warning' });
		return;
	}

	const file = (await selectFile({ accept: '.png,.jpg,jpeg', multiple: false })) as Blob;

	const formData = new FormData();
	formData.append('file', file);

	loading.value = true;

	const { status, data } = await api.post('/storage', formData);

	loading.value = false;

	if (status !== 201) {
		HttpException(data);
		return;
	}

	$emit('change:imagens', [...props.anuncio.imagens, data]);
}

async function removerImagem(index: number) {
	$emit(
		'change:imagens',
		props.anuncio.imagens.filter((_, i) => i !== index),
	);
}
</script>
