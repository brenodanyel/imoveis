<template>
	<div class="min-h-screen flex flex-col justify-between">
		<div class="border-b">
			<div class="container px-8 mx-auto">
				<MyHeader />
			</div>
		</div>

		<div class="px-8 flex-grow flex flex-col">
			<div class="container px-8 mx-auto">
				<NuxtPage />
			</div>
		</div>

		<div class="border-t bg-gray-100">
			<div class="container px-8 mx-auto">
				<MyFooter class="mt-auto" />
			</div>
		</div>
	</div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
