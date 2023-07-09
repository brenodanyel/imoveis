<template>
	<router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useAppStore } from './boot/stores';

const appStore = useAppStore();

onMounted(() => {
	appStore.setDark(appStore.dark);
});
</script>
