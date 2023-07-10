<template>
	<div class="space-y-1">
		<div class="flex items-center justify-between cursor-pointer select-none" @click="expanded = !expanded">
			<p class="text-xl font-medium text-neutral-800">{{ label }}</p>
			<button class="text-neutral-500 hover:text-neutral-700">
				<i class="bi text-2xl" :class="!expanded ? 'bi-plus' : 'bi-dash'"></i>
			</button>
		</div>

		<div class="overflow-y-auto max-h-80">
			<slot v-if="expanded" />
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	label: string;
}>();

const expanded = ref(true);
</script>
