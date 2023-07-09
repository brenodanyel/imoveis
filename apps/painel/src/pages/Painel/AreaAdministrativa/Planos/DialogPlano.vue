<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" maximized transition-show="slide-up" transition-hide="slide-down">
		<q-card>
			<q-form @submit.prevent="$emit('ok', { ...plano, price: plano.price / 100 })">
				<div class="bg-primary row justify-end">
					<div>
						<q-btn icon="close" class="text-white" dense round v-close-popup />
					</div>
				</div>

				<div class="column q-gutter-sm q-pa-md">
					<div>
						<Title :title="title" icon="sell" dense>
							<div class="col-xs-12 col-md-auto">
								<q-btn icon="save" label="Salvar" class="bg-primary text-white full-width" type="submit" v-if="!readonly" />
							</div>
						</Title>
					</div>

					<div>
						<div class="column q-gutter-md">
							<div>
								<div class="row items-center q-col-gutter-md">
									<div class="col-auto">
										<div class="text-weight-bold">Dados da plano</div>
									</div>
									<div class="col">
										<q-separator />
									</div>
								</div>
							</div>

							<div>
								<div class="row q-col-gutter-md">
									<div class="col-xs-12 col-md-6">
										<q-input
											v-model.trim="plano.name"
											label="Nome"
											:readonly="readonly"
											:rules="[(v) => v.length > 3 || 'O nome da plano deve ter pelo menos 3 caracteres']"
										/>
									</div>
									<div class="col-xs-12 col-md-6">
										<q-input
											v-model.number="plano.price"
											label="Preço"
											:readonly="readonly"
											:rules="[(v) => !!v || v == 0 || 'Preço é obrigatório']"
											unmasked-value
											mask="##.##"
											fill-mask="0"
											reverse-fill-mask
											prefix="R$ "
										/>
									</div>
									<div class="col-xs-12 col-md-6">
										<q-select v-model="plano.public" label="Tipo de plano" :readonly="readonly" :options="tiposDePlano" map-options emit-value>
											<template v-slot:append>
												<q-icon name="info">
													<q-tooltip class="bg-accent">
														<div class="text-weight-bold">Tipo de plano</div>
														<div>Planos públicos podem ser adquiridos por qualquer empresa.</div>
														<div>Planos privados só podem ser atribuidos por administradores por meio da <strong>Área administrativa</strong>.</div>
													</q-tooltip>
												</q-icon>
											</template>
										</q-select>
									</div>
									<div class="col-xs-12 col-md-6">
										<q-select
											v-model="plano.active"
											label="Status do plano"
											:readonly="readonly"
											:options="ativoInativoOptions"
											map-options
											emit-value
										/>
									</div>
								</div>
							</div>
							<div>
								<div class="row items-center q-col-gutter-md">
									<div class="col-auto">
										<div class="text-weight-bold">Limites do plano</div>
									</div>
									<div class="col">
										<q-separator />
									</div>
								</div>
							</div>

							<div>
								<div class="row q-col-gutter-md">
									<div class="col-xs-12 col-md-4">
										<q-input
											v-model.number="plano.limit_users"
											label="Limite de usuários"
											mask="########"
											:readonly="readonly"
											:rules="[(v) => !isNaN(v) || 'O campo limite de usuários é obrigatório']"
										>
											<template v-slot:append>
												<q-icon name="info">
													<q-tooltip class="bg-accent">
														<div class="text-weight-bold">Limite de usuários</div>
														<div>Quantidade de usuários que podem ser vinculados com a empresa</div>
													</q-tooltip>
												</q-icon>
											</template>
										</q-input>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</q-form>
			<q-inner-loading :showing="loading" />
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { reactive, ref } from 'vue';

import Title from '@/pages/Painel/Components/Title.vue';

import { ativoInativoOptions, tiposDePlano } from '@/services/constants';

import { Plano } from './Plano.types';

const { dialogRef } = useDialogPluginComponent();

const props = defineProps<{
	loading?: boolean;
	title: string;
	readonly?: boolean;
	ignore_password?: boolean;
	_plano: Plano;
}>();

const emit = defineEmits(useDialogPluginComponent.emits);

const plano = reactive({
	...props._plano,
	price: Number((props._plano.price * 100).toFixed(0)),
});
</script>
