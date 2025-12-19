<template>
  <div class="floating-actions">
    <BaseButton
      variant="secondary"
      :disabled="dice.length === 0 || diceStore.isRolling"
      aria-label="Roll unparked dice"
      @click="handleRoll"
      class="btn-with-icon"
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
    </BaseButton>
    <BaseButton
      variant="primary"
      :disabled="dice.length === 0 || diceStore.isRolling"
      aria-label="Roll all dice including parked"
      @click="handleRollAll"
      class="btn-with-icon"
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
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './base/BaseButton.vue';
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

.btn-with-icon {
  min-width: 3.5rem;
  height: 3.5rem;
  padding: 0 1.25rem;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.btn-with-icon:not(:disabled):hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
}

.btn-with-icon:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}
</style>
