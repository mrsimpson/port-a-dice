<template>
  <button
    :class="[
      'base-btn',
      `base-btn--${variant}`,
      { 'base-btn--disabled': disabled },
      { 'base-btn--block': block },
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'default';
  disabled?: boolean;
  block?: boolean;
}>();
</script>

<style scoped>
.base-btn {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.base-btn:not(:disabled):active {
  transform: scale(0.98);
}

.base-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.base-btn--primary {
  background: var(--color-primary-green);
  color: white;
}

.base-btn--primary:not(:disabled):hover {
  background: var(--color-primary-green-dark);
}

.base-btn--secondary {
  background: var(--color-primary-blue);
  color: white;
}

.base-btn--secondary:not(:disabled):hover {
  background: var(--color-primary-blue-dark);
}

.base-btn--danger {
  background: var(--color-primary-red);
  color: white;
}

.base-btn--danger:not(:disabled):hover {
  background: var(--color-primary-red-dark);
}

.base-btn--success {
  background: var(--color-primary-purple);
  color: white;
}

.base-btn--success:not(:disabled):hover {
  background: var(--color-primary-purple-dark);
}

.base-btn--default {
  background: #6b7280;
  color: white;
}

.base-btn--default:not(:disabled):hover {
  background: var(--color-bg-hover);
}

.base-btn--block {
  display: flex;
  width: 100%;
}
</style>
