divdiv
<template>
	<div class="column no-wrap q-gutter-sm q-pa-md">
		<Title title="Plano da empresa" icon="sell" dense />

		<div>
			<SectionHeader title="Plano atual" />
		</div>

		<div>
			<div class="row">
				<div class="col-xs-12 col-md-6 col-lg-4">
					<CardPlano
						v-if="empresa.companyPlan?.plan"
						:plano="empresa.companyPlan.plan"
						:expiresAt="empresa.companyPlan.expiresAt"
						:buyButton="empresa.companyPlan.plan.price !== 0 ? { label: 'Renovar plano' } : undefined"
						@buy="onClickBuyPlan(empresa.companyPlan?.plan as Plano, 'renew')"
					/>
					<div v-else>
						<q-card bordered flat>
							<div class="column q-gutter-sm q-pa-md">
								<div class="text-16 text-weight-medium">*Nenhum plano ativo</div>
							</div>
						</q-card>
					</div>
				</div>
			</div>
		</div>

		<div>
			<SectionHeader title="Planos disponíveis" />
		</div>

		<div>
			<div class="row q-col-gutter-sm">
				<div class="col-xs-12 col-md-6 col-lg-4" v-for="plano in planos.filter((p) => p.id !== empresa.companyPlan?.plan.id)" :key="plano.id">
					<CardPlano :plano="plano" :buyButton="{ label: 'Adquirir plano' }" @buy="onClickBuyPlan(plano, 'buy')" />
				</div>
			</div>
		</div>

		<div v-if="fetching">
			<q-inner-loading showing label="Buscando informações sobre o plano" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Title from '@/pages/Painel/Components/Title.vue';

import { api } from '@/services/api';
import { HttpException } from '@/services/http-exception';

import { Empresa } from '../../AreaAdministrativa/Empresas/Empresas.types';
import { Plano } from '../../AreaAdministrativa/Planos/Plano.types';
import SectionHeader from '../../Components/SectionHeader.vue';
import CardPlano from './CardPlano.vue';
import DialogAdquirirPlano from './DialogAdquirirPlano.vue';

const $router = useRouter();
const $route = useRoute();
const $q = useQuasar();

const fetching = ref(false);

const empresa = ref<Empresa>({} as Empresa);
const planos = ref<Plano[]>([]);

async function buscarEmpresa() {
	const { status, data } = await api.get('/my-company');

	if (status !== 200) {
		HttpException(data);
		$router.push({ name: 'perfil' });
		return;
	}

	if (!data.address) {
		data.address = {};
	}

	empresa.value = data;
}

async function buscarPlanos() {
	const { status, data } = await api.get('/plan', {
		params: {
			public: true,
			active: true,
			sortBy: 'price',
		},
	});

	if (status !== 200) {
		HttpException(data);
		$router.push({ name: 'perfil' });
		return;
	}

	planos.value = data.data;
}

async function onClickBuyPlan(plan: Plano, mode: 'buy' | 'renew') {
	fetching.value = true;

	const { status, data } = await api.get(`/my-company/plan/verify/${plan.id}`);

	fetching.value = false;

	if (status !== 200) {
		HttpException(data);
		return;
	}

	const dialog = $q.dialog({
		component: DialogAdquirirPlano,
		componentProps: {
			plan,
			mode,
			discount: data.discount,
			remainingDays: data.remainingDays,
		},
	});

	dialog.onOk(async () => {
		dialog.update({ loading: true });

		const { status, data } = await api.post(`/my-company/plan/upgrade/${plan.id}`);

		dialog.update({ loading: false });

		if (status !== 200) {
			HttpException(data);
			return;
		}

		if (data.checkout_url) {
			$q.notify({ message: 'Você será redirecionado para o pagamento!', type: 'positive' });

			window.location.href = data.checkout_url;

			dialog.hide();

			return;
		}

		await buscarEmpresa();

		$q.notify({ message: 'Plano adquirido com sucesso!', type: 'positive' });

		dialog.hide();
	});
}

onMounted(async () => {
	fetching.value = true;

	await Promise.allSettled([buscarEmpresa(), buscarPlanos()]);

	fetching.value = false;
});

onMounted(() => {
	if (!$route.query['validated-payment']) return;
	$router.push({ name: 'perfil/plano-da-empresa' });
	$q.notify({ message: 'Pagamento realizado com sucesso!', type: 'positive' });
});
</script>
