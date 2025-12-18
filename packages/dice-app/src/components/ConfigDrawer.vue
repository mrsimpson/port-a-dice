<template>
  <Teleport to="body">
    <div v-if="uiStore.showConfig" class="drawer-overlay" @click="handleOverlayClick">
      <div class="drawer" @click.stop>
        <div class="drawer-header">
          <h2 class="drawer-title">Game Configuration</h2>
          <button class="btn-close" aria-label="Close" @click="uiStore.closeConfig">
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

        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button
            :class="['tab-btn', { active: activeTab === 'dice' }]"
            @click="activeTab = 'dice'"
          >
            Dice
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'areas' }]"
            @click="activeTab = 'areas'"
          >
            Areas
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'save' }]"
            @click="activeTab = 'save'"
          >
            Save
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'load' }]"
            @click="
              activeTab = 'load';
              loadConfigurations();
            "
          >
            Load
          </button>
        </div>

        <div class="drawer-content">
          <!-- DICE TAB -->
          <div v-if="activeTab === 'dice'" class="tab-content">
            <div class="color-picker">
              <label class="section-label">Add a new die</label>
              <div class="color-grid-compact">
                <button
                  v-for="color in presetColors"
                  :key="color"
                  :style="{ backgroundColor: DICE_COLORS[color] }"
                  :class="[
                    'color-btn-compact',
                    { active: !useCustomColor && selectedPresetColor === color },
                  ]"
                  :aria-label="`Select ${color} dice`"
                  @click="handlePresetColorClick(color)"
                  :title="color"
                />
                <div class="custom-color-btn-wrapper">
                  <label class="custom-color-label-compact">Custom</label>
                  <input
                    v-model="customColor"
                    type="color"
                    class="custom-color-btn-compact"
                    :class="{ active: useCustomColor }"
                    :aria-label="`Custom color: ${customColor}`"
                    @focus="handleCustomColorFocus"
                    @input="handleCustomColorFocus"
                    :title="`Custom color: ${customColor}`"
                  />
                </div>

                <button
                  class="btn btn-add-compact"
                  :disabled="uiStore.isRolling"
                  @click="handleAddDice"
                  title="Add a die with selected color"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add
                </button>
              </div>
            </div>

            <div v-if="dice.length > 0" class="dice-list-section">
              <label class="section-label">Current Dice ({{ dice.length }})</label>
              <div class="dice-grid">
                <div v-for="die in dice" :key="die.id" class="dice-grid-item">
                  <div class="dice-grid-display">
                    <div
                      class="dice-color-indicator-grid"
                      :style="{ backgroundColor: getColorDisplay(die.color) }"
                    ></div>
                    <div class="dice-grid-label">{{ die.color }}</div>
                  </div>
                  <button
                    class="btn-delete-grid"
                    :title="`Delete ${die.color} die`"
                    @click="handleRemoveDice(die.id)"
                    aria-label="Delete die"
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

            <div class="action-section danger-section">
              <button
                class="btn btn-reset-game"
                :disabled="dice.length === 0"
                @click="handleDeleteCurrentConfiguration"
              >
                Reset Game
              </button>
            </div>
          </div>

          <!-- AREAS TAB -->
          <div v-if="activeTab === 'areas'" class="tab-content">
            <div v-if="areasStore.sortedAreas.length === 0" class="empty-state">
              <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p>No parking areas yet. Add one below.</p>
            </div>

            <div v-else class="areas-list">
              <ParkingAreaItem
                v-for="area in areasStore.sortedAreas"
                :key="area.id"
                :area="area"
                @delete="handleDeleteArea"
              />
            </div>

            <div class="add-area-form">
              <input
                ref="newAreaInput"
                v-model="newAreaName"
                type="text"
                placeholder="New area name..."
                class="area-name-input"
                @keyup.enter="handleAddArea"
              />
              <button class="btn-add" :disabled="!newAreaName.trim()" @click="handleAddArea">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- SAVE TAB -->
          <div v-if="activeTab === 'save'" class="tab-content">
            <div class="save-form">
              <div class="form-group">
                <label for="config-name" class="form-label">Game Name *</label>
                <input
                  id="config-name"
                  v-model="saveName"
                  type="text"
                  class="form-input"
                  placeholder="Enter game configuration name"
                  @keyup.enter="handleSaveConfiguration"
                />
              </div>

              <div class="form-group">
                <label for="config-description" class="form-label">Description (optional)</label>
                <textarea
                  id="config-description"
                  v-model="saveDescription"
                  class="form-textarea"
                  placeholder="e.g., For tournament on Friday"
                  rows="3"
                ></textarea>
              </div>

              <div v-if="configManagerStore.error" class="error-message">
                {{ configManagerStore.error }}
              </div>

              <div class="form-actions">
                <button
                  class="btn btn-save"
                  :disabled="!saveName.trim() || dice.length === 0"
                  @click="handleSaveConfiguration"
                >
                  Save Game
                </button>
              </div>

              <p v-if="dice.length === 0" class="info-text">No dice to save. Add dice first.</p>
            </div>
          </div>

          <!-- LOAD TAB -->
          <div v-if="activeTab === 'load'" class="tab-content">
            <div v-if="configManagerStore.loading" class="loading-state">
              Loading saved games...
            </div>

            <div v-else-if="configManagerStore.configurations.length === 0" class="empty-state">
              <p>No saved games yet. Create one in the Save tab!</p>
            </div>

            <div v-else class="configurations-list">
              <div
                v-for="config in configManagerStore.configurations"
                :key="config.id"
                class="config-item"
              >
                <div class="config-info">
                  <h3 class="config-name">{{ config.name }}</h3>
                  <p v-if="config.description" class="config-description">
                    {{ config.description }}
                  </p>
                  <div class="config-meta">
                    <span class="meta-item">
                      <strong>{{ config.dice.length }}</strong> dice
                    </span>
                    <span class="meta-item">
                      <strong>{{ config.areas.length }}</strong> areas
                    </span>
                    <span class="meta-item">
                      {{ formatDate(config.updatedAt) }}
                    </span>
                  </div>
                </div>

                <div class="config-actions">
                  <button class="btn btn-load" @click="handleLoadConfiguration(config.id)">
                    Load
                  </button>
                  <button
                    class="btn btn-delete-config"
                    title="Delete configuration"
                    @click="handleDeleteConfiguration(config.id)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div v-if="configManagerStore.error" class="error-message">
              {{ configManagerStore.error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ParkingAreaItem from './ParkingAreaItem.vue';
import { useDiceStore } from '@/stores/dice';
import { useAreasStore } from '@/stores/areas';
import { useUIStore } from '@/stores/ui';
import { useToastStore } from '@/stores/toast';
import { useConfigManagerStore } from '@/stores/configManager';
import { storeToRefs } from 'pinia';
import { DICE_COLORS, type DiceColor, type PresetDiceColor } from '@/types';
import { isAreaNameUnique } from '@/utils/areas';

const diceStore = useDiceStore();
const areasStore = useAreasStore();
const uiStore = useUIStore();
const toastStore = useToastStore();
const configManagerStore = useConfigManagerStore();

const { dice } = storeToRefs(diceStore);

// Tab state
const activeTab = ref<'dice' | 'areas' | 'save' | 'load'>('dice');

// Dice color state
const selectedPresetColor = ref<PresetDiceColor | null>('white');
const customColor = ref<string>('#ff5733');
const useCustomColor = ref<boolean>(false);

// Save form state
const saveName = ref<string>('');
const saveDescription = ref<string>('');

// Areas form state
const newAreaName = ref<string>('');
const newAreaInput = ref<HTMLInputElement | null>(null);

const presetColors: PresetDiceColor[] = ['white', 'red', 'blue', 'green', 'yellow', 'orange'];

const selectedColor = computed<DiceColor>(() => {
  return useCustomColor.value ? customColor.value : selectedPresetColor.value || 'red';
});

const getColorDisplay = (color: DiceColor): string => {
  return DICE_COLORS[color as PresetDiceColor] || color;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return (
    date.toLocaleDateString() +
    ' ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
};

// Dice management
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

// Areas management
const handleAddArea = () => {
  const trimmedName = newAreaName.value.trim();

  if (!trimmedName) {
    toastStore.show('Area name cannot be empty');
    return;
  }

  if (!isAreaNameUnique(areasStore.areas, trimmedName)) {
    toastStore.show('Area name already exists');
    return;
  }

  areasStore.addArea(trimmedName);
  newAreaName.value = '';
  toastStore.show('Area added');
  newAreaInput.value?.focus();
};

const handleDeleteArea = (areaId: string) => {
  diceStore.dice.forEach((dice) => {
    if (dice.areaId === areaId) dice.areaId = null;
  });
  areasStore.removeArea(areaId);
  toastStore.show('Area deleted');
};

// Configuration management
const handleSaveConfiguration = async () => {
  if (!saveName.value.trim()) {
    toastStore.show('Please enter a configuration name');
    return;
  }

  if (dice.value.length === 0) {
    toastStore.show('Add dice before saving');
    return;
  }

  try {
    await configManagerStore.saveConfiguration(saveName.value, saveDescription.value);
    toastStore.show('Game saved successfully');
    saveName.value = '';
    saveDescription.value = '';
    activeTab.value = 'dice';
  } catch {
    toastStore.show('Failed to save game');
  }
};

const handleLoadConfiguration = async (configId: string) => {
  try {
    await configManagerStore.loadConfiguration(configId);
    toastStore.show('Game loaded');
    activeTab.value = 'dice';
  } catch {
    toastStore.show('Failed to load game');
  }
};

const handleDeleteConfiguration = async (configId: string) => {
  if (confirm('Delete this saved game?')) {
    try {
      await configManagerStore.deleteConfiguration(configId);
      toastStore.show('Game deleted');
    } catch {
      toastStore.show('Failed to delete game');
    }
  }
};

const handleDeleteCurrentConfiguration = () => {
  if (confirm('Reset game and delete all dice and areas?')) {
    configManagerStore.deleteCurrentConfiguration();
    toastStore.show('Game reset');
  }
};

const loadConfigurations = async () => {
  try {
    await configManagerStore.loadConfigurations();
  } catch {
    toastStore.show('Failed to load saved games');
  }
};

const handleOverlayClick = () => {
  uiStore.closeConfig();
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
  z-index: 1000;
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
  height: 95dvh;
  height: 95vh;
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
  flex-shrink: 0;
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

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #111827;
  border-bottom: 1px solid #374151;
  flex-shrink: 0;
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  min-width: 80px;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #d1d5db;
}

.tab-btn.active {
  background: #374151;
  color: #f3f4f6;
  border-bottom: 2px solid #3b82f6;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.tab-content {
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

/* Compact Color Grid */
.color-grid-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-btn-compact {
  width: 2rem;
  height: 2rem;
  border: 2px solid transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.color-btn-compact:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.color-btn-compact:active {
  transform: scale(0.95);
}

.color-btn-compact.active {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}

.custom-color-btn-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.25rem 0.375rem;
  background: #374151;
  border-radius: 0.375rem;
  border: 2px solid #4b5563;
  flex-shrink: 0;
  transition: all 0.2s;
}

.custom-color-btn-wrapper:hover {
  border-color: #60a5fa;
}

.custom-color-label-compact {
  font-size: 0.625rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.custom-color-btn-compact {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  background: transparent;
}

.custom-color-btn-compact:hover {
  filter: brightness(1.1);
}

.custom-color-btn-compact.active {
  box-shadow: inset 0 0 0 2px #60a5fa;
}

.action-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.danger-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #374151;
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

.btn-add-compact {
  align-self: flex-start;
  background: #10b981;
  color: white;
  padding: 8px;
  min-width: auto;
}

.btn-add-compact:not(:disabled):hover {
  background: #059669;
}

.btn-save {
  background: #3b82f6;
  color: white;
}

.btn-save:not(:disabled):hover {
  background: #2563eb;
}

.btn-load {
  background: #10b981;
  color: white;
}

.btn-load:not(:disabled):hover {
  background: #059669;
}

.btn-reset-game {
  background: #ef4444;
  color: white;
}

.btn-reset-game:not(:disabled):hover {
  background: #dc2626;
}

.btn-delete-config {
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
}

.btn-delete-config:hover {
  background: #ef4444;
  color: white;
}

.dice-list-section {
  display: flex;
  flex-direction: column;
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
  border-radius: 50%;
  border: 2px solid #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dice-grid-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #f3f4f6;
  text-align: center;
  text-transform: capitalize;
  word-break: break-word;
}

.btn-delete-grid {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #f3f4f6;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
  opacity: 0;
}

.dice-grid-item:hover .btn-delete-grid {
  opacity: 1;
}

.btn-delete-grid:hover {
  background: #ef4444;
  color: white;
}

.btn-delete-grid:active {
  transform: scale(0.9);
}

/* Areas Tab */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: #9ca3af;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.areas-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.add-area-form {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #374151;
}

.area-name-input {
  flex: 1;
  padding: 0.75rem;
  background: #374151;
  border: 1px solid #4b5563;
  color: #f3f4f6;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.area-name-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.area-name-input::placeholder {
  color: #6b7280;
}

/* Save Form */
.save-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #d1d5db;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-textarea {
  background: #374151;
  border: 1px solid #4b5563;
  color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 3rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

/* Load Tab */
.loading-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.configurations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-item {
  background: #374151;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.config-info {
  flex: 1;
  min-width: 0;
}

.config-name {
  font-size: 1rem;
  font-weight: 600;
  color: #f3f4f6;
  margin: 0 0 0.5rem 0;
}

.config-description {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0 0 0.5rem 0;
}

.config-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.75rem;
  color: #6b7280;
}

.config-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.error-message {
  padding: 0.75rem;
  background: #7f1d1d;
  color: #fca5a5;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #991b1b;
}
</style>
