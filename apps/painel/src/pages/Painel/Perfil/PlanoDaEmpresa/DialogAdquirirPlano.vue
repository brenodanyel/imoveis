<template>
	<q-dialog ref="dialogRef" @hide="emit('hide')" persistent>
		<q-card class="q-pa-md" style="width: 50%; min-width: 25em; max-width: 40em">
			<div class="column q-gutter-md">
				<div>
					<div class="row items-center justify-between">
						<div class="text-primary text-h6 text-weight-bold">Confirmar {{ mode === 'buy' ? 'compra' : 'renovação' }} de plano</div>
						<div>
							<q-btn icon="close" dense round v-close-popup />
						</div>
					</div>
				</div>

				<div>
					Você está prestes a {{ mode === 'buy' ? 'adquirir' : 'renovar' }} o plano <b>{{ plan.name }}.</b>
				</div>

				<div v-if="discount">
					<div class="text-weight-bold text-16">Desconto de {{ formatCurrency(discount) }} aplicado</div>
					<div class="text-caption">
						Percebemos que você ainda possui <b>{{ remainingDays }} dia{{ remainingDays > 1 ? 's' : '' }} </b> restantes no seu plano atual. Então
						calculamos proporcialmente o valor do desconto.
					</div>
				</div>

				<div>
					<CardPlano :plano="plan" :discount="discount" />
				</div>

				<div class="text-caption" v-if="plan.price - discount === 5">
					Existe uma taxa interna que faz com que o valor minimo em transações na plataforma seja de <b>{{ formatCurrency(5) }}</b>
				</div>

				<div>
					<div class="row q-col-gutter-xs justify-between">
						<div class="col-xs-12 col-md-auto">
							<q-btn icon="cancel" label="Cancelar" class="bg-negative text-white full-width" v-close-popup />
						</div>
						<div class="col-xs-12 col-md-auto">
							<q-btn icon="shopping_cart" label="Realizar pagamento" class="bg-primary text-white full-width" @click="emit('ok')" />
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

import { formatCurrency } from '@/services';

import { Plano } from '../../AreaAdministrativa/Planos/Plano.types';
import CardPlano from './CardPlano.vue';

defineProps<{
	loading?: boolean;
	plan: Plano;
	discount: number;
	remainingDays: number;
	mode: 'buy' | 'renew';
}>();

const emit = defineEmits(useDialogPluginComponent.emits);
const { dialogRef } = useDialogPluginComponent();
</script>
