<template>
	<div class="q-pa-xs" v-if="displayBadge">
		<div class="row q-gutter-sm items-center justify-center text-negative">
			<q-icon name="error" size="md" color="negative" />
			<div class="text-center">
				<div v-html="message" />

				<template v-if="acl.hasPermission('perfil.plano-da-empresa.access')">
					<div v-if="hasPlan">
						Vá até a página
						<router-link :to="{ name: 'perfil/plano-da-empresa' }" class="text-negative text-weight-bold">Plano da empresa</router-link> renovar o seu
						plano e manter o acesso a todas as funcionalidades.
					</div>
					<div v-else>
						Vá até a página
						<router-link :to="{ name: 'perfil/plano-da-empresa' }" class="text-negative text-weight-bold">Plano da empresa</router-link> para adquirir
						um plano e ter acesso a todas a outras funcionalidades.
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { acl } from '@/services/acl';
import { api } from '@/services/api';
import { dayjs } from '@/services/dayjs';

import { Empresa } from '../AreaAdministrativa/Empresas/Empresas.types';

const displayBadge = ref(false);
const hasPlan = ref(false);
const message = ref('');

onMounted(async () => {
	const { status, data } = await api.get<Empresa>('my-company');

	if (status !== 200) {
		return;
	}

	hasPlan.value = !!data.companyPlan;

	if (!data.companyPlan) {
		message.value = 'A sua empresa não possui um plano ativo, então algumas funcionalidades podem não estar disponíveis.';
		displayBadge.value = true;
		return;
	}

	const expiracao = dayjs(data.companyPlan.expiresAt);

	if (expiracao.isBefore(dayjs())) {
		message.value = 'O seu plano expirou, então algumas funcionalidades podem não estar disponíveis.';
		displayBadge.value = true;
		return;
	}

	if (expiracao.isBefore(dayjs().add(7, 'days'))) {
		message.value = `O seu plano irá expirar <b class="text-underline">${expiracao.fromNow()}</b>, então em breve algumas funcionalidades podem não estar disponíveis.`;
		displayBadge.value = true;
		return;
	}

	if (data.companyPlan.plan.name === 'Teste gratuito') {
		message.value = 'A sua empresa está utilizando o <b>Plano gratuito</b>, então algumas funcionalidades podem não estar mais disponíveis.';
		displayBadge.value = true;
		return;
	}
});
</script>
