<template>
	<header class="flex justify-between items-center py-5">
		<div>Logo</div>

		<nav class="hidden md:block">
			<ul class="flex space-x-5">
				<li>
					<RouterLink to="/" class="hover:underline font-medium">Home</RouterLink>
				</li>
				<li>
					<RouterLink to="/imoveis" class="hover:underline font-medium">Buscar imóveis</RouterLink>
				</li>
				<li>
					<RouterLink to="/sobre" class="hover:underline font-medium">Sobre</RouterLink>
				</li>
				<li>
					<RouterLink to="/contato" class="hover:underline font-medium">Contato</RouterLink>
				</li>
			</ul>
		</nav>

		<div class="space-x-2">
			<button type="button" class="text-blue-500 hover:text-blue-700 px-5 py-2 font-medium rounded-md duration-200">
				<div class="space-x-2 flex items-center">
					<i class="bi bi-person-fill text-xl"></i>
					<a href="http://localhost:5173/login">Login</a>
				</div>
			</button>

			<button type="button" class="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 font-medium rounded-md duration-200">
				<div class="space-x-2 flex items-center">
					<i class="bi bi-person-fill-add text-xl"></i>
					<a href="http://localhost:5173/cadastro">Cadastre-se</a>
				</div>
			</button>
		</div>
	</header>
</template>

<script setup lang="ts"></script>
