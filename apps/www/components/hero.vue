<template>
	<div class="flex flex-col items-center justify-center gap-10 md:flex-row">
		<div class="space-y-2 md:w-1/2">
			<h1 class="text-center text-5xl font-bold text-gray-800 md:text-left">Imóveis</h1>

			<p class="text-center text-xl text-gray-600 md:text-left">A plataforma ideal para você encontrar seu próximo imóvel sem sair do sofá</p>

			<div class="flex justify-center gap-2 md:justify-start">
				<button class="text-medium rounded-md bg-blue-500 px-4 py-2 font-medium text-white duration-200 hover:bg-blue-700 active:opacity-70">
					Quero comprar um imóvel
				</button>
				<button class="text-medium rounded-md bg-blue-500 px-4 py-2 font-medium text-white duration-200 hover:bg-blue-700 active:opacity-70">
					Quero alugar um imóvel
				</button>
			</div>
		</div>
		<div>
			<img src="/realestate.png" alt="imagem de um prédio" class="w-[30vw] rounded-xl" />
		</div>
	</div>
</template>
