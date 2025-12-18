<template>
  <div class="dice-scene">
    <div v-if="dice.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <p>No dice yet</p>
      <p class="empty-hint">Open Dice Configuration to add dice</p>
    </div>

    <div v-else class="dice-grid">
      <SingleDice v-for="die in dice" :key="die.id" :dice="die" @click="handleDiceClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SingleDice from './SingleDice.vue';
import { useDiceStore } from '@/stores/dice';
import { storeToRefs } from 'pinia';

const diceStore = useDiceStore();
const { dice } = storeToRefs(diceStore);

const handleDiceClick = (diceId: string) => {
  diceStore.cycleDiceParking(diceId);
};
</script>

<style scoped>
.dice-scene {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  text-align: center;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.125rem;
  margin: 0 0 0.5rem 0;
}

.empty-hint {
  font-size: 0.875rem;
  color: #6b7280;
}

.dice-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  max-width: 100%;
}

@media (min-width: 640px) {
  .dice-grid {
    gap: 1.5rem;
  }
}

@media (min-width: 768px) {
  .dice-grid {
    gap: 2rem;
  }
}
</style>
