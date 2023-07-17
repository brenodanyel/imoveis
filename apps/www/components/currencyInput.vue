<template>
	<input ref="inputRef" type="text" v-model="modelValue" />
</template>

<script setup lang="ts">
import { CurrencyInputOptions, useCurrencyInput } from 'vue-currency-input';
const props = defineProps<{ options: CurrencyInputOptions }>();
const { inputRef } = useCurrencyInput(props.options);

defineEmits(['change']);
const modelValue = defineModel();
</script>
