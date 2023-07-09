<template>
	<div class="container mx-auto px-8">
		<myHeader />
		<div class="py-36">
			<Hero />
		</div>
		<div class="py-36">
			<Categorias />
		</div>
	</div>
</template>

<script setup lang="ts">
useHead({
	title: 'Imóveis',
});
</script>
