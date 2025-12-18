<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="uiStore.showDiceConfig" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Dice Configuration</h2>
            <button @click="uiStore.closeDiceConfig" class="btn-close" aria-label="Close">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="color-picker">
              <label class="section-label">Select Dice Color</label>
              <div class="color-grid">
                <button
                  v-for="color in presetColors"
                  :key="color"
                  :style="{ backgroundColor: DICE_COLORS[color] }"
                  :class="['color-btn', { active: !useCustomColor && selectedPresetColor === color }]"
                  @click="handlePresetColorClick(color)"
                  :aria-label="`Select ${color} dice`"
                />
              </div>

              <div class="custom-color-section">
                <label class="custom-color-label">Or pick a custom color:</label>
                <div class="custom-color-input-wrapper">
                  <input
                    type="color"
                    v-model="customColor"
                    @focus="handleCustomColorFocus"
                    @input="handleCustomColorFocus"
                    class="custom-color-input"
                    :class="{ active: useCustomColor }"
                  />
                  <span class="custom-color-value">{{ customColor }}</span>
                </div>
              </div>
            </div>

            <div class="action-section">
              <button class="btn btn-add" @click="handleAddDice" :disabled="uiStore.isRolling">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Dice
              </button>
            </div>

            <div v-if="dice.length > 0" class="dice-list-section">
              <label class="section-label">Current Dice ({{ dice.length }})</label>
              <div class="dice-list">
                <div v-for="die in dice" :key="die.id" class="dice-item">
                  <div class="dice-info">
                    <div
                      class="dice-color-indicator"
                      :style="{ backgroundColor: getColorDisplay(die.color) }"
                    ></div>
                    <div class="dice-details">
                      <span class="dice-label">{{ die.color }} ({{ die.value }})</span>
                      <span v-if="die.areaId" class="dice-area">{{ getAreaLabel(die.areaId) }}</span>
                      <span v-else class="dice-area dice-unparked">Unparked</span>
                    </div>
                  </div>
                  <button @click="handleRemoveDice(die.id)" class="btn-delete" title="Delete this die">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="dice-count">
              Total Dice: <strong>{{ dice.length }}</strong>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDiceStore } from '@/stores/dice';
import { useAreasStore } from '@/stores/areas';
import { useUIStore } from '@/stores/ui';
import { useToastStore } from '@/stores/toast';
import { storeToRefs } from 'pinia';
import { DICE_COLORS, type DiceColor, type PresetDiceColor } from '@/types';

const diceStore = useDiceStore();
const areasStore = useAreasStore();
const uiStore = useUIStore();
const toastStore = useToastStore();

const { dice } = storeToRefs(diceStore);
const selectedPresetColor = ref<PresetDiceColor | null>('red');
const customColor = ref<string>('#ff5733');
const useCustomColor = ref<boolean>(false);

const presetColors: PresetDiceColor[] = ['red', 'blue', 'green', 'yellow', 'orange', 'white', 'black'];

const selectedColor = computed<DiceColor>(() => {
  return useCustomColor.value ? customColor.value : (selectedPresetColor.value || 'red');
});

const getColorDisplay = (color: DiceColor): string => {
  return DICE_COLORS[color as PresetDiceColor] || color;
};

const getAreaLabel = (areaId: string): string => {
  const area = areasStore.getAreaById(areaId);
  return area ? area.label : 'Unknown';
};

const handlePresetColorClick = (color: PresetDiceColor) => {
  selectedPresetColor.value = color;
  useCustomColor.value = false;
};

const handleCustomColorFocus = () => {
  useCustomColor.value = true;
  selectedPresetColor.value = null;
};

const handleAddDice = () => {
  diceStore.addDice(selectedColor.value, 1);
  toastStore.show('Die added');
};

const handleRemoveDice = (id: string) => {
  diceStore.removeDice(id);
  toastStore.show('Die removed');
};

const handleOverlayClick = () => {
  uiStore.closeDiceConfig();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #1f2937;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #374151;
}

.modal-title {
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

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #d1d5db;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-picker {
  display: flex;
  flex-direction: column;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(3rem, 1fr));
  gap: 0.75rem;
}

.color-btn {
  width: 100%;
  aspect-ratio: 1;
  border: 3px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.color-btn:hover {
  transform: scale(1.05);
}

.color-btn:active {
  transform: scale(0.95);
}

.color-btn.active {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
}

.custom-color-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #374151;
}

.custom-color-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.custom-color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #374151;
  border-radius: 0.5rem;
}

.custom-color-input {
  width: 3rem;
  height: 3rem;
  border: 3px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.custom-color-input:hover {
  transform: scale(1.05);
}

.custom-color-input.active {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
}

.custom-color-value {
  font-family: monospace;
  font-size: 0.875rem;
  color: #d1d5db;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
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
  transform: scale(0.98);
}

.btn-add {
  background: #10b981;
  color: white;
}

.btn-add:not(:disabled):hover {
  background: #059669;
}

.dice-list-section {
  display: flex;
  flex-direction: column;
}

.dice-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.dice-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #374151;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.dice-item:hover {
  background: #4b5563;
}

.dice-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.dice-color-indicator {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 2px solid #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.dice-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.dice-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f3f4f6;
  text-transform: capitalize;
}

.dice-area {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dice-unparked {
  color: #60a5fa;
  font-style: italic;
}

.btn-delete {
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
  flex-shrink: 0;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
}

.btn-delete:active {
  transform: scale(0.95);
}

.dice-count {
  text-align: center;
  padding: 1rem;
  background: #111827;
  border-radius: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.dice-count strong {
  color: #f3f4f6;
  font-size: 1.125rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
