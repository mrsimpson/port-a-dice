<template>
  <button class="player-tab" :class="{ active: isActive }" @click="$emit('select')">
    <span class="player-name">{{ playerName }}</span>
    <button
      v-if="showDelete"
      class="delete-btn"
      :aria-label="$t('sheets.removePlayer')"
      @click.stop="$emit('delete')"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6h16z"
        />
      </svg>
    </button>
  </button>
</template>

<script setup lang="ts">
interface Props {
  playerName: string;
  isActive: boolean;
  showDelete: boolean;
}

defineProps<Props>();

defineEmits<{
  select: [];
  delete: [];
}>();
</script>

<style scoped>
.player-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #374151;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
}

.player-tab:hover {
  background: #4b5563;
  color: #f3f4f6;
}

.player-tab.active {
  background: #3b82f6;
  color: #f3f4f6;
}

.player-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.delete-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  color: inherit;
  cursor: pointer;
  padding: 0;
}

.player-tab:hover .delete-btn {
  display: flex;
}

.delete-btn:hover {
  background: rgba(220, 38, 38, 0.8);
  color: #f3f4f6;
}
</style>
