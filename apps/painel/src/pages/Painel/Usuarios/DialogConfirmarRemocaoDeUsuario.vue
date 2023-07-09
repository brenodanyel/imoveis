<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" persistent>
		<q-card class="q-pa-md" style="width: 50%; min-width: 25em; max-width: 40em">
			<div class="column q-gutter-md">
				<div>
					<div class="row items-center justify-between">
						<div class="text-primary text-h6 text-weight-bold">Confirmar remoção</div>
						<div>
							<q-btn icon="close" dense round v-close-popup />
						</div>
					</div>
				</div>

				<div>
					Você está prestes remover o vínculo do usuário
					<strong>{{ nomeUsuario }}</strong>
					com a sua empresa.
				</div>

				<div>Tem certeza que deseja continuar?</div>

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
			<q-inner-loading :showing="loading" color="primary" />
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

defineProps<{
	nomeUsuario: string;
	loading?: boolean;
}>();

const emit = defineEmits(useDialogPluginComponent.emits);
const { dialogRef } = useDialogPluginComponent();
</script>
