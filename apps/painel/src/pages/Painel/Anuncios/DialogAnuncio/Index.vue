<template>
	<q-dialog ref="dialogRef" @hide="$emit('hide')" maximized transition-show="slide-up" transition-hide="slide-down">
		<q-card>
			<q-form @submit.prevent="onOk()" class="full-height column">
				<div>
					<div class="bg-primary row justify-end">
						<div>
							<q-btn icon="close" class="text-white" dense round v-close-popup />
						</div>
					</div>
				</div>

				<div class="col-grow">
					<div class="column q-gutter-md q-pa-md full-height">
						<div>
							<Title :title="title" dense>
								<div class="col-xs-12 col-md-auto">
									<q-btn icon="save" label="Salvar" class="bg-primary text-white full-width" type="submit" v-if="!readonly" />
								</div>
							</Title>
						</div>

						<div class="col-grow">
							<q-scroll-area style="height: 100%">
								<div class="row q-col-gutter-md q-px-md">
									<div class="col-xs-12 col-md-6">
										<div class="column q-gutter-md">
											<div>
												<FormDetalhes :anuncio="anuncio" :readonly="mode === 'view'" />
											</div>
											<div>
												<FormComodidades :anuncio="anuncio" :readonly="mode === 'view'" />
											</div>
											<div>
												<FormCaracteristicas :anuncio="anuncio" :readonly="mode === 'view'" />
											</div>
										</div>
									</div>
									<div class="col-xs-12 col-md-6">
										<div class="column q-gutter-md">
											<div>
												<FormEndereco :anuncio="anuncio" :readonly="mode === 'view'" />
											</div>
											<div>
												<FormCapa :anuncio="anuncio" @change-thumbnail="anuncio.thumbnail = $event" :readonly="mode === 'view'" />
											</div>
											<div>
												<FormImagens :anuncio="anuncio" @change:imagens="anuncio.imagens = $event" :readonly="mode === 'view'" />
											</div>
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
import { cloneDeep } from 'lodash';
import { useDialogPluginComponent } from 'quasar';
import { computed, ref } from 'vue';

import Title from '@/pages/Painel/Components/Title.vue';

import { Anuncio } from '../Anuncio.types';

import FormCapa from './FormCapa.vue';
import FormCaracteristicas from './FormCaracteristicas.vue';
import FormComodidades from './FormComodidades.vue';
import FormDetalhes from './FormDetalhes.vue';
import FormEndereco from './FormEndereco.vue';
import FormImagens from './FormImagens.vue';

const { dialogRef } = useDialogPluginComponent();

const props = defineProps<{
	loading?: boolean;
	title: string;
	mode: 'create' | 'edit' | 'view';
	_anuncio: Anuncio;
}>();

const $emit = defineEmits(useDialogPluginComponent.emits);

const readonly = computed(() => props.mode === 'view');
const anuncio = ref(cloneDeep(props._anuncio));

function onOk() {
	$emit('ok', anuncio.value);
}
</script>
