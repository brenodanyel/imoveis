<template>
	<div class="min-h-screen flex flex-col justify-between font-sans antialiased">
		<div class="border-b">
			<MyHeader class="container px-8 mx-auto" />
		</div>

		<div class="px-8 flex-grow flex flex-col">
			<NuxtPage class="container px-8 mx-auto" />
		</div>

		<div class="border-t bg-gray-100 mt-auto">
			<MyFooter class="container px-8 mx-auto" />
		</div>
	</div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
