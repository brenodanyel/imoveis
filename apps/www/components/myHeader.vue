<template>
	<header class="flex justify-between items-center py-5">
		<div>Logo</div>
		<nav>Navegação</nav>

		<div class="space-x-2">
			<button type="button" class="text-blue-500 hover:text-blue-700 px-5 py-2 font-medium rounded-md">
				<div class="space-x-2 flex items-center">
					<i class="bi bi-person-fill text-xl"></i>
					<a href="http://localhost:5173/login">Login</a>
				</div>
			</button>

			<button type="button" class="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 font-medium rounded-md">
				<div class="space-x-2 flex items-center">
					<i class="bi bi-person-fill-add text-xl"></i>
					<a href="http://localhost:5173/cadastro">Cadastre-se</a>
				</div>
			</button>
		</div>
	</header>
</template>

<script setup lang="ts"></script>
