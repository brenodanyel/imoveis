<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" persistent>
		<q-card class="q-pa-md" style="width: 50%; min-width: 25em; max-width: 40em">
			<div class="column q-gutter-md">
				<div>
					<div class="row items-center justify-between">
						<div class="text-primary text-h6 text-weight-bold">{{ title }}</div>
						<div>
							<q-btn icon="close" dense round v-close-popup />
						</div>
					</div>
				</div>

				<div>
					Selecione abaixo os perfis que deseja atribuir para o usuário
					<strong>{{ usuario.name }}.</strong>
				</div>

				<div>
					<div class="row q-col-gutter-md">
						<div class="col-xs-12">
							<SelectRole :selected="selectedRoles" @update:selected="selectedRoles = $event" multiple />
						</div>
					</div>
				</div>

				<div>
					<div class="row q-col-gutter-xs justify-between">
						<div class="col-xs-12 col-md-auto">
							<q-btn icon="cancel" label="Cancelar" class="bg-negative text-white full-width" v-close-popup />
						</div>
						<div class="col-xs-12 col-md-auto">
							<q-btn
								icon="check"
								label="Confirmar"
								class="bg-primary text-white full-width"
								@click="emit('ok', selectedRoles)"
								:disable="selectedRoles.length === 0"
							/>
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
import { ref } from 'vue';

import SelectRole from '../Components/SelectRole.vue';
import { Role, Usuario } from './Usuario.type';

const props = defineProps<{
	title: string;
	loading?: boolean;
	usuario: Usuario;
	_selectedRoles: Role[];
}>();

const emit = defineEmits(useDialogPluginComponent.emits);

const { dialogRef } = useDialogPluginComponent();

const selectedRoles = ref<Role[]>([...props._selectedRoles]);
</script>
