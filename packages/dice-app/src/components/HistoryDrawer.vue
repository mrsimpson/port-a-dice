<template>
  <Teleport to="body">
    <div v-if="uiStore.showHistory" class="drawer-overlay" @click="uiStore.closeHistory">
      <div class="drawer" @click.stop>
        <div class="drawer-header">
          <h2 class="drawer-title">Roll History</h2>
          <button class="btn-close" @click="uiStore.closeHistory">
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

        <div class="drawer-content">
          <div v-if="historyStore.entryCount === 0" class="empty-state">
            <p>No roll history yet</p>
          </div>

          <div v-else class="history-list">
            <div v-for="entry in historyStore.sortedEntries" :key="entry.id" class="history-item">
              <div class="history-time">
                {{ formatTime(entry.timestamp) }}
              </div>
              <div class="history-dice">
                <span
                  v-for="dice in entry.dice"
                  :key="dice.id"
                  :style="{ color: getColorDisplay(dice.color) }"
                  class="dice-value"
                >
                  {{ dice.value }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="historyStore.entryCount > 0" class="drawer-footer">
          <button class="btn btn-clear" @click="handleClearHistory">Clear History</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useHistoryStore } from '@/stores/history';
import { useUIStore } from '@/stores/ui';
import { DICE_COLORS, type DiceColor, type PresetDiceColor } from '@/types';

const historyStore = useHistoryStore();
const uiStore = useUIStore();

const getColorDisplay = (color: DiceColor): string => {
  return DICE_COLORS[color as PresetDiceColor] || color;
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const handleClearHistory = () => {
  historyStore.clearHistory();
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
  z-index: 50;
  display: flex;
  align-items: flex-end;
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
  max-height: 80vh;
  background: #1f2937;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
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
  border-bottom: 1px solid #374151;
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
  width: 2.5rem;
  height: 2.5rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #374151;
  color: #f3f4f6;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #9ca3af;
  font-size: 0.875rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  padding: 1rem;
  background: #374151;
  border-radius: 0.5rem;
}

.history-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.history-dice {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.dice-value {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #1f2937;
  border-radius: 0.375rem;
  font-weight: 700;
  font-size: 0.875rem;
}

.drawer-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #374151;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear {
  background: #ef4444;
  color: white;
}

.btn-clear:hover {
  background: #dc2626;
}

.btn-clear:active {
  transform: scale(0.98);
}
</style>
