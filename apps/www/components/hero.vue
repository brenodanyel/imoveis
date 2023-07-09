<template>
	<div class="flex flex-col items-center justify-center md:flex-row gap-10">
		<div class="md:w-1/2 space-y-2">
			<h1 class="text-5xl font-bold text-gray-800 text-center md:text-left">Imóveis</h1>

			<p class="text-xl text-gray-600 text-center md:text-left">Encontre o imóvel ideal para você.</p>

			<div class="flex gap-2">
				<button class="bg-blue-500 hover:bg-blue-700 active:opacity-70 duration-200 text-medium px-4 py-2 rounded-md text-white">
					Quero comprar um imóvel
				</button>
				<button class="bg-blue-500 hover:bg-blue-700 active:opacity-70 duration-200 text-medium px-4 py-2 rounded-md text-white">
					Quero alugar um imóvel
				</button>
			</div>
		</div>
		<div>
			<img src="/realestate.png" alt="imagem de um prédio" class="w-96 rounded-xl" />
		</div>
	</div>
</template>
