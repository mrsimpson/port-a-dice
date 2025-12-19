<template>
  <DrawerWrapper title="Roll History" :is-open="uiStore.showHistory" @close="uiStore.closeHistory">
    <!-- Content -->
    <div v-if="historyStore.entryCount === 0" class="empty-state">
      <p>No roll history yet</p>
    </div>

    <div v-else class="history-list">
      <div v-for="entry in historyStore.sortedEntries" :key="entry.id" class="history-item">
        <div class="history-header">
          <div class="history-time">
            {{ formatTime(entry.timestamp) }}
          </div>
          <BaseButton variant="secondary" @click="handleRestore(entry)" title="Restore this state">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </BaseButton>
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

    <!-- Footer -->
    <template v-if="historyStore.entryCount > 0" #footer>
      <BaseButton variant="danger" block @click="handleClearHistory">Clear History</BaseButton>
    </template>
  </DrawerWrapper>
</template>

<script setup lang="ts">
import BaseButton from './base/BaseButton.vue';
import DrawerWrapper from './DrawerWrapper.vue';
import { useHistoryStore } from '@/stores/history';
import { useUIStore } from '@/stores/ui';
import { useDiceStore } from '@/stores/dice';
import { useAreasStore } from '@/stores/areas';
import { useToastStore } from '@/stores/toast';
import { DICE_COLORS, type DiceColor, type PresetDiceColor, type RollHistoryEntry } from '@/types';

const historyStore = useHistoryStore();
const uiStore = useUIStore();
const diceStore = useDiceStore();
const areasStore = useAreasStore();
const toastStore = useToastStore();

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

const handleRestore = (entry: RollHistoryEntry) => {
  diceStore.restoreFromHistory(entry);
  areasStore.setAreas(entry.areas);
  toastStore.show('Dice state restored');

  // Delay closing to allow Vue to render the restored state
  setTimeout(() => {
    uiStore.closeHistory();
  }, 100);
};
</script>

<style scoped>
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-time {
  font-size: 0.75rem;
  color: #9ca3af;
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

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}
</style>
