<template>
	<div class="column flex-center window-height q-gutter-md text-primary text-center">
		<q-icon name="error" size="15em" />
		<div class="text-36">404 - Página não encontrada</div>
		<div class="text-18">A página que você está tentando acessar não existe ou foi movida para outro endereço</div>

		<div>
			<div class="row q-gutter-sm">
				<q-btn label="Página anterior" icon="keyboard_double_arrow_left" class="bg-primary text-white" @click="$router.back()" />
				<q-btn label="Página principal" icon="home" class="bg-primary text-white" @click="$router.push('/')" />
			</div>
		</div>
	</div>
</template>
