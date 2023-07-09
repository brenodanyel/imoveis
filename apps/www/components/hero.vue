<template>
	<div class="flex flex-col items-center justify-center md:flex-row gap-10">
		<div class="md:w-1/2 space-y-2">
			<h1 class="text-5xl font-bold text-gray-800 text-center md:text-left">Imóveis</h1>

			<p class="text-xl text-gray-600 text-center md:text-left">Encontre o imóvel ideal para você.</p>

			<div class="flex gap-2">
				<button :class="btn({ size: 'md' })">Quero comprar um imóvel</button>
				<button class="text-xl">Quero alugar um imóvel</button>
				<!-- <button :class="btn()">Quero alugar um imóvel</button> -->
			</div>
		</div>
		<div>
			<img src="/realestate.png" alt="imagem de um prédio" class="w-96 rounded-xl" />
		</div>
	</div>
</template>

<script setup lang="ts">
import btn from '~/component-variants/btn';
</script>
