<template>
  <Teleport to="body">
    <div v-if="isOpen" class="drawer-overlay" @click="onOverlayClick">
      <div class="drawer" @click.stop>
        <div class="drawer-header">
          <h2 class="drawer-title">{{ title }}</h2>
          <button class="btn-close" :aria-label="`Close ${title}`" @click="onClose">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Optional slot for tabs or other header content -->
        <slot name="header" />

        <div class="drawer-content">
          <!-- Main content slot -->
          <slot />
        </div>

        <!-- Optional footer slot -->
        <div v-if="$slots.footer" class="drawer-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  isOpen: boolean;
  closeOnOverlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true,
});

const emit = defineEmits<{
  close: [];
}>();

const onClose = () => {
  emit('close');
};

const onOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit('close');
  }
};
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.drawer {
  width: 100%;
  /* Use max-height to allow drawer to shrink and leave room at top on mobile */
  max-height: 92dvh;
  max-height: 92vh; /* Fallback for older browsers */
  background: #1f2937;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  /* Account for safe areas and keyboard insets */
  padding-bottom: max(0px, env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .drawer-overlay {
    align-items: center;
    justify-content: center;
  }

  .drawer {
    width: 90%;
    max-width: 1024px;
    max-height: 90svh;
    border-radius: 1rem;
    animation: zoomIn 0.3s ease-out;
    padding-bottom: 0;
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  padding-right: calc(1.5rem + env(safe-area-inset-right, 0px));
  padding-top: calc(1.5rem + env(safe-area-inset-top, 0px));
  padding-left: calc(1.5rem + env(safe-area-inset-left, 0px));
  border-bottom: 1px solid #374151;
  flex-shrink: 0;
}

.drawer-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f3f4f6;
  margin: 0;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #374151;
  color: #f3f4f6;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* Allow flex child to shrink below content size */
}

.drawer-footer {
  padding: 1.5rem;
  padding-right: calc(1.5rem + env(safe-area-inset-right, 0px));
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
  padding-left: calc(1.5rem + env(safe-area-inset-left, 0px));
  border-top: 1px solid #374151;
  flex-shrink: 0;
  min-height: 56px;
  display: flex;
  align-items: center;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}
</style>
