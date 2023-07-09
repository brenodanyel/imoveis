<template>
	<div class="row items-center q-col-gutter-md">
		<div class="col-auto">
			<div class="text-weight-bold text-18">{{ title }}</div>
		</div>
		<div class="col">
			<q-separator />
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
}>();
</script>
