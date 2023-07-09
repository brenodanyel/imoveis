<template>
	<div class="min-h-screen flex flex-col justify-between">
		<div class="container mx-auto px-8">
			<MyHeader />
			<NuxtPage />
		</div>

		<MyFooter class="mt-auto" />
	</div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
