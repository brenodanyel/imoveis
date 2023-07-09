<template>
	<div>
		<div v-for="categoria in categorias" :key="categoria.name">
			<div class="card" style="width: 18rem">
				{{ categoria.name }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const categorias = [
	{ name: 'Casas', icon: 'bi-house' }, //
	{ name: 'Apartamentos', icon: 'bi-building' },
	{ name: 'Ponto comercial', icon: 'bi shop' },
	{ name: 'Terrenos', icon: 'bi-terrain' },
];
</script>
