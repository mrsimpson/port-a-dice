<template>
  <div class="floating-actions">
    <button
      class="btn btn-roll"
      :disabled="dice.length === 0 || diceStore.isRolling"
      aria-label="Roll unparked dice"
      @click="handleRoll"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span v-if="!diceStore.isRolling">Roll</span>
      <span v-else>Rolling...</span>
    </button>
    <button
      class="btn btn-roll-all"
      :disabled="dice.length === 0 || diceStore.isRolling"
      aria-label="Roll all dice including parked"
      @click="handleRollAll"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span v-if="!diceStore.isRolling">Roll All</span>
      <span v-else>Rolling...</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDiceStore } from '@/stores/dice';
import { storeToRefs } from 'pinia';

const diceStore = useDiceStore();

const { dice } = storeToRefs(diceStore);

const handleRoll = () => {
  diceStore.rollAllDice();
};

const handleRollAll = () => {
  diceStore.rollAllDiceForced();
  diceStore.dice.forEach((dice) => {
    dice.areaId = null;
  });
};
</script>

<style scoped>
.floating-actions {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  gap: 1rem;
  z-index: 10;
  padding: 0 1rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 3.5rem;
  height: 3.5rem;
  padding: 0 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
}

.btn:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.btn-roll {
  background: #3b82f6;
  color: white;
}

.btn-roll:not(:disabled):hover {
  background: #2563eb;
}

.btn-reset {
  background: #ef4444;
  color: white;
}

.btn-reset:not(:disabled):hover {
  background: #dc2626;
}

.btn-roll-all {
  background: #10b981;
  color: white;
}

.btn-roll-all:not(:disabled):hover {
  background: #059669;
}
</style>
