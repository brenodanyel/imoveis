<template>
	<div class="grid gap-3 md:gap-10 grid-cols-1 md:grid-cols-4">
		<RouterLink :to="categoria.link" v-for="categoria in categorias" :key="categoria.name">
			<button class="border p-10 shadow-md group flex flex-col items-center justify-center hover:scale-105 gap-3 duration-200 w-full">
				<div class="group-hover:bg-blue-500 duration-200 p-3 rounded-full w-20 h-20 flex items-center justify-center">
					<i class="text-4xl duration-200 text-blue-500 group-hover:text-white" :class="categoria.icon" />
				</div>
				<p class="text-center text-lg font-medium">{{ categoria.name }}</p>
			</button>
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
const categorias = [
	{ name: 'Casas', icon: 'bi-house', link: '/imoveis?subcategorias=3,4' },
	{ name: 'Apartamentos', icon: 'bi-building', link: '/imoveis?subcategorias=1,2' },
	{ name: 'Ponto comercial', icon: 'bi-shop-window', link: '/imoveis?subcategorias=11' },
	{ name: 'Ver tudo', icon: 'bi-three-dots', link: '/imoveis' },
];
</script>
