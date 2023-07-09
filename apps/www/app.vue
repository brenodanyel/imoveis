<template>
	<div class="min-h-screen flex flex-col justify-between">
		<div class="border-b container mx-auto px-8">
			<MyHeader />
		</div>

		<div class="container mx-auto px-8">
			<NuxtPage />
		</div>

		<div class="border-t">
			<MyFooter class="mt-auto" />
		</div>
	</div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
