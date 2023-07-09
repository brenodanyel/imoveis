<template>
	<div class="row window-height flex-center">
		<div class="col-grow full-height gt-sm">
			<q-img src="/login.jpg" alt="imagem login" style="width: 100%; height: 100%; display: block; object-fit: cover; object-position: center" />
		</div>
		<div>
			<q-form @submit.prevent="onSubmit" style="width: 40em" class="q-pa-xl">
				<div>
					<q-card bordered>
						<div class="column q-col-gutter-sm q-pa-lg">
							<div class="q-mx-auto q-pa-md">
								<Logo />
							</div>

							<div>
								<div class="text-20 text-weight-bold">Bem vindo(a) de volta!</div>
								<div>Preencha os seus dados para fazer login.</div>
							</div>

							<div>
								<q-input v-model.trim="email" label="E-mail" :rules="[(v) => isEmail(v) || 'E-mail inválido.']" />
							</div>
							<div>
								<q-input
									v-model.trim="password"
									outlined
									label="Senha"
									:type="passwordVisible ? 'text' : 'password'"
									:rules="[validatePassword]"
									ref="passwordRef"
								>
									<template v-slot:append>
										<q-icon
											:name="passwordVisible ? 'visibility_off' : 'visibility'"
											class="cursor-pointer"
											@click="passwordVisible = !passwordVisible"
										/>
									</template>
								</q-input>
							</div>
							<div>
								<q-btn label="Entrar" icon="login" class="bg-primary text-white full-width" type="submit" :loading="loading" />
							</div>
							<!-- <div class="q-mx-auto">
								<q-btn label="Esqueceu a sua senha?" color="accent" class="full-width" />
							</div> -->
						</div>
					</q-card>
				</div>
			</q-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import isEmail from 'validator/lib/isEmail';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { validatePassword } from '@/services/common.validators';

import { useAuthStore } from '@/boot/stores';
import Logo from '@/components/Logo.vue';

const $authStore = useAuthStore();
const $router = useRouter();

const email = ref('');
const password = ref('');
const passwordVisible = ref(false);
const loading = ref(false);
const passwordRef = ref();

async function onSubmit() {
	loading.value = true;

	const success = await $authStore.login(email.value, password.value);

	loading.value = false;

	if (success) {
		const { redirect = '/' } = $router.currentRoute.value.query;
		$router.push(redirect as string);
	} else {
		passwordRef.value?.focus();
	}
}
</script>
