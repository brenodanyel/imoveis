<template>
	<div class="flex flex-col-reverse items-center justify-center gap-16 md:flex-row">
		<div class="space-y-2 md:w-1/2">
			<h1 class="text-center text-5xl font-bold text-gray-800 md:text-left">Encontre seu lar dos sonhos hoje mesmo!</h1>

			<p class="text-center text-xl text-gray-600 md:text-left">
				Seu lar perfeito está aqui! Explore nossa ampla seleção de imóveis e encontre o espaço que combina com seu estilo de vida. Comece uma nova
				jornada rumo à felicidade!
			</p>

			<div class="flex justify-center gap-2 md:justify-start">
				<RouterLink :to="{ path: '/imoveis', query: { proposito: 'Venda' } }">
					<button class="text-medium rounded-md bg-blue-500 px-4 py-2 font-medium text-white duration-200 hover:bg-blue-700 active:opacity-70">
						Quero comprar um imóvel
					</button>
				</RouterLink>
				<RouterLink :to="{ path: '/imoveis', query: { proposito: 'Aluguel' } }">
					<button class="text-medium rounded-md bg-blue-500 px-4 py-2 font-medium text-white duration-200 hover:bg-blue-700 active:opacity-70">
						Quero alugar um imóvel
					</button>
				</RouterLink>
			</div>
		</div>
		<div>
			<img src="/realestate.png" alt="imagem de um prédio" class="w-[35vw] rounded-xl" />
		</div>
	</div>
</template>
