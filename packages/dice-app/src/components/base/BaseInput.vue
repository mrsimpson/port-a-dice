<template>
  <input ref="inputRef" :class="['base-input', { 'base-input--error': error }]" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  error?: boolean;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

// Expose the focus method so parent components can focus the input
defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>

<style scoped>
.base-input {
  background: var(--color-bg-darker);
  border: 1px solid var(--color-border);
  color: var(--color-text-light);
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  transition: var(--transition-default);
  font-family: inherit;
}

.base-input::placeholder {
  color: var(--color-text-gray);
}

.base-input:focus {
  outline: none;
  border-color: var(--color-primary-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.base-input--error {
  border-color: var(--color-primary-red);
}

.base-input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
