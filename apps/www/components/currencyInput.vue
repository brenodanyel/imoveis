<template>
	<input ref="inputRef" type="text" />
</template>

<script setup lang="ts">
import { CurrencyInputOptions, useCurrencyInput } from 'vue-currency-input';
defineModel('modelValue');
const props = defineProps<{ options: CurrencyInputOptions }>();
const { inputRef } = useCurrencyInput(props.options);
</script>
