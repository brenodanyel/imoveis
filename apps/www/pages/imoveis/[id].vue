<template>
	<div class="py-5 mx-auto" v-if="data">
		<div class="space-y-3">
			<div class="flex flex-col md:flex-row md:items-center gap-3 justify-between">
				<div class="space-y-1">
					<p class="text-4xl text-neutral-800 font-medium first-letter:capitalize">{{ data.titulo }}</p>
					<p class="text-xl text-neutral-800">{{ data.endereco.bairro }} - {{ data.endereco.cidade }}/{{ data.endereco.estado }}</p>
					<p class="text-sm text-neutral-800">Publicado em {{ dayjs(data.createdAt).format('DD/MM/YYYY [às] HH[h]:MM') }}</p>
				</div>
				<div class="flex flex-row gap-1 md:flex-col justify-between items-end">
					<p class="bg-green-500 w-min py-1 px-2 text-white rounded-md cursor-default">{{ data.proposito }}</p>
					<p class="text-neutral-800 text-3xl font-medium">
						{{ new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(data.valor) }}
					</p>
				</div>
			</div>

			<div class="flex flex-col gap-2 overflow-hidden">
				<div class="overflow-hidden h-3/4 rounded-lg">
					<img
						:src="data.thumbnail"
						:alt="`imagem principal do anuncio ${data.id}`"
						class="aspect-video object-center object-cover cursor-pointer hover:scale-105 duration-200 w-full"
						@click="onClickPicture(data.thumbnail)"
					/>
				</div>

				<div class="grid grid-flow-col grid-cols-3 gap-2">
					<div v-for="imagem of data.imagens.slice(0, 3)" class="w-full h-full overflow-hidden rounded-lg">
						<img
							:src="imagem.url"
							:alt="`imagem do anuncio ${data.id}`"
							class="w-full h-full aspect-video object-center object-cover cursor-pointer hover:scale-105 duration-200"
							@click="onClickPicture(imagem.url)"
						/>
					</div>
				</div>
			</div>

			<div class="flex flex-col md:flex-row gap-10 justify-between">
				<div class="flex-1 space-y-3">
					<div class="space-y-1 border-b pb-5">
						<p class="bg-green-500 w-min py-1 px-2 text-white rounded-md cursor-default">{{ data.proposito }}</p>
						<p class="text-neutral-800 text-3xl font-medium">
							{{ new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(data.valor) }}
						</p>
					</div>

					<div class="space-y-1 border-b pb-5" v-if="data.descricao">
						<p class="text-2xl text-neutral-800 font-medium">Descrição</p>
						<ClientOnly>
							<p class="text-neutral-800" v-html="data.descricao"></p>
						</ClientOnly>
					</div>

					<div class="space-y-1 border-b pb-5">
						<p class="text-2xl text-neutral-800 font-medium">Detalhes do Imóvel</p>
						<p class="text-neutral-800" v-if="data.valor_condominio">
							<b>Valor do condomínio:</b>
							{{ new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(data.valor_condominio) }}
						</p>
						<p class="text-neutral-800" v-if="data.valor_iptu">
							<b>Valor do IPTU:</b>
							{{ new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(data.valor_iptu) }}
						</p>
						<p class="text-neutral-800">
							<b>Tipo:</b>
							{{ data.subcategoria.nome }}
						</p>
						<p class="text-neutral-800">
							<b>Área:</b>
							{{ data.area_total / 10 }}m²
						</p>
						<p class="text-neutral-800">
							<b>Área construída:</b>
							{{ data.area_construida / 10 }}m²
						</p>
						<p class="text-neutral-800" v-for="[key, value] of Object.entries(data.caracteristicas)" :key="key">
							<b>{{ key }}:</b>
							{{ value }}
						</p>
					</div>

					<div class="space-y-1" v-if="data.comodidades.length">
						<p class="text-2xl text-neutral-800 font-medium">Comodidades</p>
						<div class="grid grid-cols-1 xl:grid-cols-2 gap-x-5">
							<div class="text-neutral-800 flex gap-2" v-for="comodidade of data.comodidades" :key="comodidade">
								<i class="bi bi-check-circle"></i>
								<p>{{ comodidade }}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="w-full md:w-80 space-y-2">
					<p class="text-2xl text-neutral-800 font-medium">Anunciante:</p>
					<div class="shadow-sm border rounded-md p-5 flex flex-col gap-5">
						<div class="round w-36 self-center">
							<img
								:src="data.empresa.image || 'https://via.placeholder.com/150'"
								:alt="`logo da empresa ${data.empresa.nome}`"
								class="rounded-full w-36 h-36 object-cover object-center"
							/>
						</div>

						<div>
							<div class="text-2xl text-neutral-800 font-medium">{{ data.empresa.nome }}</div>
							<div v-if="data.empresa.phone_number">{{ data.empresa.phone_number }}</div>
						</div>

						<ClientOnly>
							<a
								:href="getWhatsappLink()"
								target="_blank"
								class="space-x-2 text-xl px-4 py-2 text-white bg-orange-400 hover:bg-orange-500 font-medium duration-200 rounded-md flex justify-center items-center"
							>
								<i class="bi bi-whatsapp"></i>
								<span>Enviar mensagem</span>
							</a>
						</ClientOnly>
					</div>
				</div>
			</div>
		</div>

		<ClientOnly>
			<ImoveisSwiper v-if="dialog" @hide="dialog = false" :images="images" :initialSlide="initialSlide" />
		</ClientOnly>
	</div>

	<template v-else-if="pending">
		<div class="flex-1 flex flex-col gap-5 items-center justify-center p-10">
			<svg
				aria-hidden="true"
				class="w-24 h-24 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-400"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
		</div>
	</template>

	<template v-else>
		<div class="flex-1 flex flex-col items-center justify-center p-10">
			<i class="bi bi-exclamation-triangle text-9xl text-neutral-800"></i>
			<p class="text-3xl text-neutral-800 font-medium">Imóvel não encontrado</p>
			<p class="text-xl text-neutral-800">O imóvel que você está procurando não existe ou foi removido.</p>

			<div class="mt-10">
				<RouterLink to="/imoveis" class="text-xl text-white bg-blue-400 hover:bg-blue-700 px-4 py-2 rounded-md font-medium duration-200">
					<i class="bi bi-arrow-left"></i>
					Voltar para a lista de imoveis
				</RouterLink>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { Anuncio } from '../../types/anuncios';
const config = useRuntimeConfig();

const route = useRoute();
const { data, pending } = useLazyFetch<Anuncio>(`/anuncios/${route.params.id}`, {
	baseURL: config.public.baseURL,
});

useHead({
	title: data.value?.titulo || 'Imóvel não encontrado',
});

function getWhatsappLink() {
	if (!data.value) return '';

	const url = new URL('https://api.whatsapp.com/send');
	url.searchParams.set('phone', '55' + data.value.empresa.phone_number);
	url.searchParams.set(
		'text',
		`Olá, eu estava navegando no site e me interessei pelo anúncio ${window.location.href} (*${data.value.titulo}*).\n\nPoderia me dar mais informações?\n\nAguardo seu retorno.`,
	);

	return url.toString();
}

const dialog = ref(false);
const initialSlide = ref(0);

function onClickPicture(url: string) {
	initialSlide.value = images.value.findIndex((image) => image.url === url) || 0;
	dialog.value = true;
}

const images = computed(() => {
	if (!data.value) return [];

	const images = [];

	if (data.value.thumbnail) {
		images.push({ url: data.value.thumbnail });
	}

	if (data.value.imagens) {
		images.push(...data.value.imagens.map((image) => ({ url: image.url })));
	}

	return images;
});
</script>
