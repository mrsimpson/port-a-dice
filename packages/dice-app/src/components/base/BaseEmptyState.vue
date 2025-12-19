<template>
  <div class="base-empty-state">
    <div v-if="$slots.icon" class="base-empty-state__icon">
      <slot name="icon" />
    </div>
    <p v-if="message" class="base-empty-state__message">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>

<style scoped>
.base-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: var(--color-text-gray);
  text-align: center;
  min-height: 200px;
}

.base-empty-state__icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  color: inherit;
}

.base-empty-state__message {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
