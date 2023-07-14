<template>
	<div class="bg-neutral-950/90 fixed top-0 left-0 w-full h-screen z-10 overflow-auto">
		<div class="absolute right-0 top-0 p-5 z-20">
			<button
				class="bg-neutral-900/90 hover:bg-neutral-950/100 duration-200 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center"
				@click="$emit('hide')"
			>
				<i class="bi bi-x text-4xl"></i>
			</button>
		</div>

		<div class="absolute top-1/2 left-0 w-full -translate-y-1/2 space-y-10">
			<div class="flex items-center justify-center px-5 md:px-16 mx-auto">
				<Swiper
					ref="swiper"
					:style="{
						'--swiper-navigation-color': '#fff',
						'--swiper-pagination-color': '#fff',
					}"
					effect="fade"
					:spaceBetween="10"
					:modules="modules"
					loop
					navigation
					grabCursor
					mousewheel
					:thumbs="{ swiper: thumbsSwiper }"
					zoom
					:zoomOptions="{
						maxRatio: 5,
						minRatio: 1,
					}"
					:initialSlide="initialSlide"
				>
					<SwiperSlide v-for="image in images" :key="image.url">
						<img :src="image.url" class="h-[60vh] object-center object-cover mx-auto select-none rounded-md" />
					</SwiperSlide>
				</Swiper>
			</div>

			<div class="flex items-center justify-center px-5 md:px-16 mx-auto">
				<Swiper
					:width="200"
					@swiper="setThumbsSwiper"
					loop
					watchSlidesProgress
					:modules="modules"
					:spaceBetween="10"
					class="cursor-pointer"
					ref="thumbsSwiperRef"
					:initialSlide="initialSlide"
				>
					<SwiperSlide v-for="image in images" :key="image.url" v-slot="{ isActive }">
						<div class="p-1 overflow-hidden bg-neutral-900/75" :class="isActive && 'border-2 border-white'">
							<img :src="image.url" class="object-center object-cover mx-auto select-none rounded-md" />
						</div>
					</SwiperSlide>
				</Swiper>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

import { Controller, Mousewheel, Navigation, Thumbs, Zoom } from 'swiper/modules';

const modules = [Navigation, Mousewheel, Thumbs, Zoom, Controller];

defineEmits(['hide']);

defineProps<{
	initialSlide: number;
	images: { url: string }[];
}>();

const thumbsSwiper = ref(null);
const swiper = ref(null);
const thumbsSwiperRef = ref(null);

const setThumbsSwiper = (swiper: any) => {
	thumbsSwiper.value = swiper;
};

onMounted(() => {
	document.body.style.height = '100vh';
	document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
	document.body.style.height = 'auto';
	document.body.style.overflow = 'auto';
});
</script>
