<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" persistent>
		<q-card class="q-pa-md" style="width: 50%; min-width: 25em; max-width: 40em">
			<div class="column q-gutter-sm">
				<div>
					<div class="row items-center justify-between">
						<div class="text-primary text-h6 text-weight-bold">Confirmar troca de perfil</div>
						<div>
							<q-btn icon="close" dense round v-close-popup />
						</div>
					</div>
				</div>

				<div>Você está prestes a trocar de perfil. Confirme os dados abaixo e clique em "Confirmar" para prosseguir.</div>

				<div>
					<div class="row q-col-gutter-sm">
						<div class="col-xs-12 col-md-4">
							<q-input label="ID" :model-value="empresa.id" readonly />
						</div>
						<div class="col-xs-12 col-md-8">
							<q-input label="CNPJ" :model-value="empresa.cnpj" readonly />
						</div>
						<div class="col-xs-12">
							<q-input label="Nome da empresa" :model-value="empresa.name" readonly />
						</div>
						<div class="col-xs-12">
							<q-input label="Seus perfis na empresa" :model-value="perfis" readonly />
						</div>
					</div>
				</div>

				<div>
					<div class="row q-col-gutter-xs justify-between">
						<div class="col-xs-12 col-md-auto">
							<q-btn icon="cancel" label="Cancelar" class="bg-negative text-white full-width" v-close-popup />
						</div>
						<div class="col-xs-12 col-md-auto">
							<q-btn icon="check" label="Confirmar" class="bg-primary text-white full-width" @click="emit('ok')" />
						</div>
					</div>
				</div>
			</div>
			<q-inner-loading :showing="loading" />
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

import { Empresa } from '../AreaAdministrativa/Empresas/Empresas.types';

defineProps<{
	empresa: Empresa;
	perfis: string;
	loading: boolean;
}>();

const emit = defineEmits(useDialogPluginComponent.emits);
const { dialogRef } = useDialogPluginComponent();
</script>
