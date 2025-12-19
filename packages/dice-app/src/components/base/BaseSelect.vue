<template>
  <div class="base-select-wrapper">
    <label v-if="label" class="base-select-label">{{ label }}</label>
    <select
      :value="modelValue"
      :class="['base-select', { 'base-select--error': error }]"
      v-bind="$attrs"
      @input="handleChange"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  options: Array<{ value: string; label: string }>;
  label?: string;
  error?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleChange = (event: InputEvent) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
.base-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-select-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.base-select {
  background: var(--color-bg-darker);
  border: 1px solid var(--color-border);
  color: var(--color-text-light);
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  transition: var(--transition-default);
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5rem;
  padding-right: 2.5rem;
}

.base-select:hover {
  border-color: var(--color-primary-blue);
}

.base-select:focus {
  outline: none;
  border-color: var(--color-primary-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.base-select--error {
  border-color: var(--color-primary-red);
}

.base-select--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
