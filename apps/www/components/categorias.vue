<template>
	<div class="grid gap-3 grid-cols-1 md:grid-cols-4">
		<button v-for="categoria in categorias" :key="categoria.name" class="border p-5 shadow-lg group flex flex-col items-center justify-center gap-3">
			<div class="group-hover:bg-blue-500 duration-200 p-3 rounded-full">
				<i class="text-4xl duration-200 text-blue-500 group-hover:text-white" :class="categoria.icon" />
			</div>

			<p class="text-center text-lg font-medium">{{ categoria.name }}</p>
		</button>
	</div>
</template>

<script setup lang="ts">
const categorias = [
	{ name: 'Casas', icon: 'bi-house' }, //
	{ name: 'Apartamentos', icon: 'bi-building' },
	{ name: 'Ponto comercial', icon: 'bi-shop-window' },
	{ name: 'Terrenos', icon: 'bi-grid-3x3' },
	{ name: 'Ver tudo', icon: 'bi-three-dots' },
];
</script>
