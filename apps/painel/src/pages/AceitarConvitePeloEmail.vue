<template>
	<div class="column flex-center window-height q-gutter-md text-primary text-center">
		<template v-if="error">
			<q-icon :name="icon" size="15em" />
			<div class="text-36" v-html="error" />
			<q-btn label="Ir para o login" icon="login" class="bg-primary text-white" :to="{ name: 'login' }" />
		</template>

		<template v-else-if="!loading">
			<q-icon name="check_circle" size="15em" />

			<div class="text-36">Cadastro confirmado com sucesso!</div>

			<div class="text-18">Você já pode acessar o sistema</div>

			<q-btn label="Ir para o login" icon="login" class="bg-primary text-white" :to="{ name: 'login' }" />
		</template>

		<q-inner-loading :showing="loading" label="Confirmação cadastro em andamento..." label-class="text-36" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { api } from '@/services/api';

const props = defineProps<{
	icon: string;
	requestUrl: string;
}>();

const $route = useRoute();

const loading = ref(false);
const error = ref('');

async function confirmarCadastro() {
	const { q } = $route.query;

	if (!q) {
		error.value = 'URL inválida';
		return;
	}

	loading.value = true;

	const { status, data } = await api.post(props.requestUrl, { q });

	await new Promise((resolve) => setTimeout(resolve, 1500));

	loading.value = false;

	if (status !== 200) {
		error.value = data.message;
		if (Array.isArray(data.message)) {
			error.value = data.message.join('<br>');
		}
		return;
	}
}

onMounted(() => {
	confirmarCadastro();
});
</script>
