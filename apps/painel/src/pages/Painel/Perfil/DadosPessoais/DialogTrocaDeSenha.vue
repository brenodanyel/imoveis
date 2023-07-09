<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" persistent>
		<q-card class="q-pa-md" style="width: 50%; min-width: 25em; max-width: 40em">
			<div class="column q-gutter-md">
				<div>
					<div class="row items-center justify-between">
						<div class="text-primary text-h6 text-weight-bold">Alteração de senha</div>
						<div>
							<q-btn icon="close" dense round v-close-popup />
						</div>
					</div>
				</div>

				<div>
					<div class="row q-col-gutter-sm">
						<div class="col-xs-12">
							<q-input v-model.trim="senhaAtual" label="Senha atual" :type="senhaAtualVisivel ? 'text' : 'password'">
								<template v-slot:append>
									<q-icon
										:name="senhaAtualVisivel ? 'visibility_off' : 'visibility'"
										class="cursor-pointer"
										@click="senhaAtualVisivel = !senhaAtualVisivel"
									/>
								</template>
							</q-input>
						</div>

						<div class="col-xs-12">
							<q-input v-model.trim="senhaNova" label="Nova senha" :type="senhaNovaVisivel ? 'text' : 'password'" :rules="[validatePassword]">
								<template v-slot:append>
									<q-icon
										:name="senhaNovaVisivel ? 'visibility_off' : 'visibility'"
										class="cursor-pointer"
										@click="senhaNovaVisivel = !senhaNovaVisivel"
									/>
								</template>
							</q-input>
						</div>

						<div class="col-xs-12">
							<q-input
								v-model.trim="senhaNovaConfirmacao"
								label="Confirmação da nova senha"
								:type="senhaNovaConfirmacaoVisivel ? 'text' : 'password'"
								:rules="[validatePassword, (v) => v === senhaNovaConfirmacao || 'As senhas não conferem']"
							>
								<template v-slot:append>
									<q-icon
										:name="senhaNovaConfirmacaoVisivel ? 'visibility_off' : 'visibility'"
										class="cursor-pointer"
										@click="senhaNovaConfirmacaoVisivel = !senhaNovaConfirmacaoVisivel"
									/>
								</template>
							</q-input>
						</div>
					</div>
				</div>

				<div>
					<div class="row q-col-gutter-xs justify-between">
						<div class="col-xs-12 col-md-auto">
							<q-btn icon="cancel" label="Cancelar" class="bg-negative text-white full-width" v-close-popup />
						</div>
						<div class="col-xs-12 col-md-auto">
							<q-btn icon="check" label="Confirmar" class="bg-primary text-white full-width" @click="emit('ok', { senhaAtual, senhaNova })" />
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
import { ref } from 'vue';

import { validatePassword } from '@/services/common.validators';

defineProps<{
	loading?: boolean;
}>();

const emit = defineEmits(useDialogPluginComponent.emits);
const { dialogRef } = useDialogPluginComponent();

const senhaAtual = ref('');
const senhaAtualVisivel = ref(false);

const senhaNova = ref('');
const senhaNovaVisivel = ref(false);

const senhaNovaConfirmacao = ref('');
const senhaNovaConfirmacaoVisivel = ref(false);
</script>
