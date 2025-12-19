<template>
  <div class="dice-management-panel">
    <div class="color-picker-section">
      <BaseColorPicker v-model="selectedColor" :label="$t('forms.add-die')" />
      <BaseButton
        variant="primary"
        class="add-button"
        :disabled="diceStore.isRolling"
        @click="handleAddDice"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </BaseButton>
    </div>

    <div v-if="dice.length > 0" class="dice-list-section">
      <label class="section-label">{{ $t('labels.current-dice', { count: dice.length }) }}</label>
      <div class="dice-grid">
        <div v-for="die in dice" :key="die.id" class="dice-grid-item">
          <div class="dice-grid-display">
            <div
              class="dice-color-indicator-grid"
              :style="{ backgroundColor: getColorDisplay(die.color) }"
            ></div>
            <div class="dice-grid-label">{{ die.type.toUpperCase() }}</div>
            <div class="dice-grid-color">{{ die.color }}</div>
          </div>
          <button
            class="btn-delete-grid"
            :title="$t('ariaLabels.delete-die', { color: die.color })"
            @click="handleRemoveDice(die.id)"
            :aria-label="$t('ariaLabels.delete-die', { color: die.color })"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <BaseEmptyState v-else :message="$t('messages.no-dice')" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDiceStore } from '@/stores/dice';
import { useToastStore } from '@/stores/toast';
import { storeToRefs } from 'pinia';
import {
  DICE_COLORS,
  DICE_TYPE_INFO,
  type DiceColor,
  type PresetDiceColor,
  type DiceType,
} from '@/types';
import BaseColorPicker from '@/components/base/BaseColorPicker.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseEmptyState from '@/components/base/BaseEmptyState.vue';

const { t } = useI18n();

const diceStore = useDiceStore();
const toastStore = useToastStore();

const { dice } = storeToRefs(diceStore);
const selectedColor = ref<DiceColor>('white');
const selectedType = ref<DiceType>('d6');

const diceTypeOptions = Object.keys(DICE_TYPE_INFO).map((type) => ({
  value: type,
  label: DICE_TYPE_INFO[type as DiceType].label,
}));

const getColorDisplay = (color: DiceColor): string => {
  return DICE_COLORS[color as PresetDiceColor] || color;
};

const handleAddDice = () => {
  diceStore.addDice(selectedColor.value, 1);
  toastStore.show(t('messages.die-added'));
};

const handleRemoveDice = (id: string) => {
  diceStore.removeDice(id);
  toastStore.show(t('messages.die-removed'));
};
</script>

<style scoped>
.dice-config-section {
  display: flex;
  flex-direction: column;
}

.add-dice-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-picker-compact :deep(.base-color-picker) {
  margin-bottom: 0;
}

.color-picker-compact :deep(.color-picker-label) {
  display: none;
}

.color-picker-compact :deep(.color-options) {
  margin: 0;
}

.dice-type-select {
  width: 4rem;
  height: 2.5rem;
  background: #374151;
  border: 1px solid #4b5563;
  color: #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.25rem center;
  background-size: 1rem;
  padding-right: 1.5rem;
}

.dice-type-select:hover {
  background: #4b5563;
  border-color: #60a5fa;
}

.dice-type-select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.add-button-compact {
  height: 2.5rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
}

.add-button-compact span {
  font-weight: 600;
  font-size: 0.875rem;
}

.section-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #d1d5db;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dice-list-section {
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
}

.dice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .dice-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }
}

.dice-grid-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #374151;
  border-radius: 0.5rem;
  transition: all 0.2s;
  min-height: 100px;
}

.dice-grid-item:hover {
  background: #4b5563;
}

.dice-grid-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  flex: 1;
  justify-content: center;
}

.dice-color-indicator-grid {
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
}

.dice-grid-label {
  font-size: 0.75rem;
  color: #d1d5db;
  font-weight: 600;
  text-transform: uppercase;
}

.dice-grid-color {
  font-size: 0.625rem;
  color: #9ca3af;
  text-transform: capitalize;
}

.btn-delete-grid {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
}

.dice-grid-item:hover .btn-delete-grid {
  opacity: 1;
}

.btn-delete-grid:hover {
  background: #dc2626;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.w-3 {
  width: 0.75rem;
}

.h-3 {
  height: 0.75rem;
}
</style>
