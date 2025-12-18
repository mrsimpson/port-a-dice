<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="uiStore.showDiceConfig" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Dice Configuration</h2>
            <button @click="uiStore.closeDiceConfig" class="btn-close" aria-label="Close">
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

          <div class="modal-body">
            <!-- DICE TAB -->
            <div v-if="activeTab === 'dice'" class="tab-content">
              <div class="color-picker">
                <label class="section-label">Select Dice Color</label>
                <div class="color-grid">
                  <button
                    v-for="color in presetColors"
                    :key="color"
                    :style="{ backgroundColor: DICE_COLORS[color] }"
                    :class="[
                      'color-btn',
                      { active: !useCustomColor && selectedPresetColor === color },
                    ]"
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
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
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
                        <span v-if="die.areaId" class="dice-area">{{
                          getAreaLabel(die.areaId)
                        }}</span>
                        <span v-else class="dice-area dice-unparked">Unparked</span>
                      </div>
                    </div>
                    <button
                      @click="handleRemoveDice(die.id)"
                      class="btn-delete"
                      title="Delete this die"
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

              <div class="dice-count">
                Total Dice: <strong>{{ dice.length }}</strong>
              </div>

              <div class="action-section danger-section">
                <button
                  class="btn btn-delete-config"
                  @click="handleDeleteCurrentConfiguration"
                  :disabled="dice.length === 0"
                >
                  Delete Current Configuration
                </button>
              </div>
            </div>

            <!-- SAVE TAB -->
            <div v-if="activeTab === 'save'" class="tab-content">
              <div class="save-form">
                <div class="form-group">
                  <label for="config-name" class="form-label">Configuration Name *</label>
                  <input
                    id="config-name"
                    v-model="saveName"
                    type="text"
                    class="form-input"
                    placeholder="Enter configuration name"
                    @keyup.enter="handleSaveConfiguration"
                  />
                </div>

                <div class="form-group">
                  <label for="config-description" class="form-label">Description (optional)</label>
                  <textarea
                    id="config-description"
                    v-model="saveDescription"
                    class="form-textarea"
                    placeholder="Enter optional description"
                    rows="3"
                  ></textarea>
                </div>

                <div v-if="configManagerStore.error" class="error-message">
                  {{ configManagerStore.error }}
                </div>

                <div class="form-actions">
                  <button
                    class="btn btn-save"
                    @click="handleSaveConfiguration"
                    :disabled="!saveName.trim() || dice.length === 0"
                  >
                    Save Configuration
                  </button>
                </div>

                <p v-if="dice.length === 0" class="info-text">No dice to save. Add dice first.</p>
              </div>
            </div>

            <!-- LOAD TAB -->
            <div v-if="activeTab === 'load'" class="tab-content">
              <div v-if="configManagerStore.loading" class="loading-state">
                Loading configurations...
              </div>

              <div v-else-if="configManagerStore.configurations.length === 0" class="empty-state">
                <p>No saved configurations yet.</p>
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
                      class="btn btn-delete-config-small"
                      @click="handleDeleteConfiguration(config.id)"
                      title="Delete configuration"
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
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDiceStore } from '@/stores/dice';
import { useAreasStore } from '@/stores/areas';
import { useUIStore } from '@/stores/ui';
import { useToastStore } from '@/stores/toast';
import { useConfigManagerStore } from '@/stores/configManager';
import { storeToRefs } from 'pinia';
import { DICE_COLORS, type DiceColor, type PresetDiceColor } from '@/types';

const diceStore = useDiceStore();
const areasStore = useAreasStore();
const uiStore = useUIStore();
const toastStore = useToastStore();
const configManagerStore = useConfigManagerStore();

const { dice } = storeToRefs(diceStore);

// Tab state
const activeTab = ref<'dice' | 'save' | 'load'>('dice');

// Dice color state
const selectedPresetColor = ref<PresetDiceColor | null>('red');
const customColor = ref<string>('#ff5733');
const useCustomColor = ref<boolean>(false);

// Save form state
const saveName = ref<string>('');
const saveDescription = ref<string>('');

const presetColors: PresetDiceColor[] = [
  'red',
  'blue',
  'green',
  'yellow',
  'orange',
  'white',
  'black',
];

const selectedColor = computed<DiceColor>(() => {
  return useCustomColor.value ? customColor.value : selectedPresetColor.value || 'red';
});

const getColorDisplay = (color: DiceColor): string => {
  return DICE_COLORS[color as PresetDiceColor] || color;
};

const getAreaLabel = (areaId: string): string => {
  const area = areasStore.getAreaById(areaId);
  return area ? area.label : 'Unknown';
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
    toastStore.show('Configuration saved successfully');
    saveName.value = '';
    saveDescription.value = '';
    activeTab.value = 'dice';
  } catch (error) {
    toastStore.show('Failed to save configuration');
  }
};

const handleLoadConfiguration = async (configId: string) => {
  try {
    await configManagerStore.loadConfiguration(configId);
    toastStore.show('Configuration loaded');
    activeTab.value = 'dice';
  } catch (error) {
    toastStore.show('Failed to load configuration');
  }
};

const handleDeleteConfiguration = async (configId: string) => {
  if (confirm('Delete this configuration?')) {
    try {
      await configManagerStore.deleteConfiguration(configId);
      toastStore.show('Configuration deleted');
    } catch (error) {
      toastStore.show('Failed to delete configuration');
    }
  }
};

const handleDeleteCurrentConfiguration = () => {
  if (confirm('Delete current configuration and reset all dice?')) {
    configManagerStore.deleteCurrentConfiguration();
    toastStore.show('Configuration deleted');
  }
};

const loadConfigurations = async () => {
  try {
    await configManagerStore.loadConfigurations();
  } catch (error) {
    toastStore.show('Failed to load configurations');
  }
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
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #374151;
  flex-shrink: 0;
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

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #111827;
  border-bottom: 1px solid #374151;
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
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
}

.tab-btn:hover {
  color: #d1d5db;
}

.tab-btn.active {
  background: #374151;
  color: #f3f4f6;
  border-bottom: 2px solid #3b82f6;
}

.modal-body {
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

.btn-add {
  background: #10b981;
  color: white;
}

.btn-add:not(:disabled):hover {
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

.btn-delete-config {
  background: #ef4444;
  color: white;
}

.btn-delete-config:not(:disabled):hover {
  background: #dc2626;
}

.btn-delete-config-small {
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
}

.btn-delete-config-small:hover {
  background: #ef4444;
  color: white;
}

.dice-list-section {
  display: flex;
  flex-direction: column;
}

.dice-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
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

.info-text {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}

/* Load Tab */
.loading-state,
.empty-state {
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
