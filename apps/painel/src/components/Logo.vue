<template>
	<div class="row q-gutter-sm items-center text-primary no-wrap non-selectable">
		<q-icon name="bi-house-fill" size="md" />
		<div class="text-28 text-weight-bold" v-if="!small"></div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	small?: boolean;
}>();
</script>
