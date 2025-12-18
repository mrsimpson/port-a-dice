<template>
  <div class="dice-controls">
    <div class="color-picker">
      <button
        v-for="color in colors"
        :key="color"
        :style="{ backgroundColor: DICE_COLORS[color] }"
        :class="['color-btn', { active: selectedColor === color }]"
        @click="selectedColor = color"
        :aria-label="`Select ${color} dice`"
      />
    </div>

    <div class="action-buttons">
      <button class="btn btn-add" @click="handleAddDice" :disabled="diceStore.isRolling">
        Add Dice
      </button>
      <button
        class="btn btn-roll"
        @click="handleRoll"
        :disabled="dice.length === 0 || unparkedCount === 0 || diceStore.isRolling"
      >
        {{ rollButtonText }}
      </button>
      <button
        class="btn btn-roll-all"
        @click="handleRollAll"
        :disabled="dice.length === 0 || diceStore.isRolling"
      >
        {{ rollAllButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDiceStore } from '@/stores/dice';
import { storeToRefs } from 'pinia';
import { DICE_COLORS, type DiceColor, type PresetDiceColor } from '@/types';

const diceStore = useDiceStore();

const { dice, isRolling } = storeToRefs(diceStore);
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
  flex-direction: column;
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
  transition: all 0.2s;
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
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:not(:disabled):active {
  transform: scale(0.95);
}

.btn-add {
  background: #10b981;
  color: white;
}

.btn-add:not(:disabled):hover {
  background: #059669;
}

.btn-roll {
  background: #3b82f6;
  color: white;
}

.btn-roll:not(:disabled):hover {
  background: #2563eb;
}

.btn-roll-all {
  background: #8b5cf6;
  color: white;
}

.btn-roll-all:not(:disabled):hover {
  background: #7c3aed;
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
