<template>
	<header class="flex justify-between items-center py-5">
		<nav class="hidden md:block">
			<ul class="flex space-x-5">
				<li>
					<RouterLink to="/" class="hover:underline font-medium">Inicio</RouterLink>
				</li>
				<li>
					<RouterLink to="/imoveis" class="hover:underline font-medium">Buscar imóveis</RouterLink>
				</li>
			</ul>
		</nav>

		<div class="space-x-2">
			<a :href="`${config.public.painelURL}/login`" target="_blank">
				<button type="button" class="text-blue-500 hover:text-blue-700 px-5 py-2 font-medium rounded-md duration-200">
					<div class="space-x-2 flex items-center">
						<i class="bi bi-person-fill text-xl"></i>
						<span>Login</span>
					</div>
				</button>
			</a>

			<a :href="`${config.public.painelURL}/cadastro`" target="_blank">
				<button type="button" class="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 font-medium rounded-md duration-200">
					<div class="space-x-2 flex items-center">
						<i class="bi bi-plus text-xl"></i>
						<span>Crie um anúncio</span>
					</div>
				</button>
			</a>
		</div>
	</header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>
