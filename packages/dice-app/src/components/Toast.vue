<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toastStore.visible" class="toast-container">
        <div class="toast">
          {{ toastStore.message }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast';

const toastStore = useToastStore();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
}

.toast {
  background: #1f2937;
  color: #f3f4f6;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  font-size: 0.875rem;
  font-weight: 500;
  max-width: 90vw;
  text-align: center;
  border: 1px solid #374151;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
