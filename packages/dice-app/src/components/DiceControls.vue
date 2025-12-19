<template>
  <div class="dice-controls">
    <div class="color-picker">
      <button
        v-for="color in colors"
        :key="color"
        :style="{ backgroundColor: DICE_COLORS[color] }"
        :class="['color-btn', { active: selectedColor === color }]"
        :aria-label="`Select ${color} dice`"
        @click="selectedColor = color"
      />
    </div>

    <div class="action-buttons">
      <BaseButton variant="primary" :disabled="diceStore.isRolling" @click="handleAddDice">
        Add Dice
      </BaseButton>
      <BaseButton
        variant="secondary"
        :disabled="dice.length === 0 || unparkedCount === 0 || diceStore.isRolling"
        @click="handleRoll"
      >
        {{ rollButtonText }}
      </BaseButton>
      <BaseButton
        variant="success"
        :disabled="dice.length === 0 || diceStore.isRolling"
        @click="handleRollAll"
      >
        {{ rollAllButtonText }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseButton from './base/BaseButton.vue';
import { useDiceStore } from '@/stores/dice';
import { storeToRefs } from 'pinia';
import { DICE_COLORS, type DiceColor, type PresetDiceColor } from '@/types';

const diceStore = useDiceStore();

const { dice } = storeToRefs(diceStore);
const selectedColor = ref<DiceColor>('red');

const colors: PresetDiceColor[] = ['red', 'blue', 'green', 'yellow', 'orange', 'white', 'black'];

const unparkedCount = computed(() => dice.value.filter((d) => d.areaId === null).length);
const parkedCount = computed(() => dice.value.filter((d) => d.areaId !== null).length);

const rollButtonText = computed(() => {
  if (diceStore.isRolling) return 'Rolling...';
  if (unparkedCount.value === 0) return 'All Parked';
  if (parkedCount.value === 0) return 'Roll';
  return `Roll (${unparkedCount.value})`;
});

const rollAllButtonText = computed(() => {
  if (parkedCount.value === 0) return 'Roll All';
  return `Roll All (${dice.value.length})`;
});

const handleAddDice = () => {
  diceStore.addDice(selectedColor.value, 1);
};

const handleRoll = () => {
  diceStore.rollAllDice();
};

const handleRollAll = () => {
  diceStore.rollAllDiceForced();
};
</script>

<style scoped>
.dice-controls {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.color-picker {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.color-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn:active {
  transform: scale(0.95);
}

.color-btn.active {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.4);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.action-buttons :deep(.base-btn) {
  flex: 1;
}

@media (min-width: 768px) {
  .dice-controls {
    flex-direction: row;
    align-items: center;
  }

  .action-buttons {
    flex: 1;
  }
}
</style>
