<template>
	<q-card bordered flat>
		<div class="column q-gutter-sm q-pa-md">
			<div>
				<div class="row items-center justify-between">
					<div class="text-16 text-weight-medium">
						{{ plano.name }}
						<span v-if="expiresAt" class="text-caption">
							({{ dayjs(expiresAt).diff() > 0 ? 'expira' : 'expirou' }} {{ dayjs(expiresAt).fromNow() }})
							<q-tooltip class="bg-accent">
								<div class="text-12">
									{{ dayjs(expiresAt).format('DD/MM/YYYY HH:mm') }}
								</div>
							</q-tooltip>
						</span>
					</div>
					<q-icon name="sell" size="sm" />
				</div>
			</div>

			<div>
				<q-separator />
			</div>

			<div>
				<template v-if="discount">
					<div class="text-22 text-weight-bold">
						{{ formatCurrency(plano.price - discount) }}
						<span class="text-12 text-grey-6">
							<span class="text-strike">{{ formatCurrency(plano.price) }}</span>
							(desconto de {{ formatCurrency(discount) }} aplicado)
						</span>
					</div>
					<div class="text-14 text-weight-medium">agora, depois {{ formatCurrency(plano.price) }} por mês</div>
				</template>

				<template v-else>
					<div class="text-22 text-weight-bold">{{ formatCurrency(plano.price) }}</div>
					<div class="text-14 text-weight-medium">por mês</div>
				</template>
			</div>

			<div>
				<q-separator />
			</div>

			<div>
				<div class="column q-gutter-sm">
					<div>
						<div class="row justify-between text-14 text-weight-bold">
							<div>Limite de membros:</div>
							<div>{{ plano.limit_users }}</div>
						</div>
						<div class="row justify-between text-14 text-weight-bold">
							<div>Limite de anuncios ativos:</div>
							<div>{{ plano.limit_users }}</div>
						</div>
					</div>
				</div>
			</div>

			<template v-if="buyButton">
				<div>
					<q-separator />
				</div>

				<div>
					<q-btn icon="shopping_cart" :label="buyButton.label" class="bg-primary text-white full-width" @click="emit('buy')" />
				</div>
			</template>
		</div>
	</q-card>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/services';
import { dayjs } from '@/services/dayjs';

import { Plano } from '../../AreaAdministrativa/Planos/Plano.types';

defineProps<{
	plano: Plano;
	expiresAt?: string;
	buyButton?: {
		label: string;
	};
	discount?: number;
}>();

const emit = defineEmits(['buy']);
</script>
