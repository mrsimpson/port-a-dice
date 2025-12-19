<template>
  <DrawerWrapper
    title="Game Configuration"
    :is-open="uiStore.showConfig"
    @close="uiStore.closeConfig"
  >
    <!-- Tab Navigation Header -->
    <template #header>
      <div class="tab-navigation">
        <button :class="['tab-btn', { active: activeTab === 'dice' }]" @click="activeTab = 'dice'">
          Dice
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'areas' }]"
          @click="activeTab = 'areas'"
        >
          Areas
        </button>
        <button :class="['tab-btn', { active: activeTab === 'save' }]" @click="activeTab = 'save'">
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
    </template>

    <!-- Content -->
    <div class="tab-content">
      <!-- DICE TAB -->
      <div v-if="activeTab === 'dice'" class="tab-scroll-content">
        <DiceManagementPanel ref="dicePanel" />
      </div>

      <!-- AREAS TAB -->
      <div v-if="activeTab === 'areas'" class="tab-scroll-content">
        <AreasManagementPanel @delete="handleAreaDeleted" />
      </div>

      <!-- SAVE TAB -->
      <div v-if="activeTab === 'save'" class="tab-scroll-content">
        <SaveGamePanel ref="savePanel" @save="handleSaveConfiguration" />
      </div>

      <!-- LOAD TAB -->
      <div v-if="activeTab === 'load'" class="tab-scroll-content">
        <LoadGamePanel @load="handleConfigurationLoaded" @delete="handleConfigurationDeleted" />
      </div>
    </div>

    <!-- Footer with Actions -->
    <template #footer>
      <BaseButton
        v-if="activeTab === 'dice'"
        variant="danger"
        :disabled="dice.length === 0"
        block
        @click="handleDeleteCurrentConfiguration"
      >
        Reset Game
      </BaseButton>
      <div v-else-if="activeTab === 'areas'" class="add-area-form">
        <BaseInput
          ref="newAreaInput"
          v-model="newAreaName"
          type="text"
          placeholder="New area name..."
          @keyup.enter="handleAddArea"
        />
        <BaseButton variant="primary" :disabled="!newAreaName.trim()" @click="handleAddArea">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </BaseButton>
      </div>
      <BaseButton
        v-else-if="activeTab === 'save'"
        variant="secondary"
        :disabled="!saveName.trim() || dice.length === 0"
        block
        @click="handleSave"
      >
        Save Game
      </BaseButton>
      <div v-else-if="activeTab === 'load'"></div>
    </template>
  </DrawerWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DrawerWrapper from './DrawerWrapper.vue';
import DiceManagementPanel from './panels/DiceManagementPanel.vue';
import AreasManagementPanel from './panels/AreasManagementPanel.vue';
import SaveGamePanel from './panels/SaveGamePanel.vue';
import LoadGamePanel from './panels/LoadGamePanel.vue';
import BaseButton from './base/BaseButton.vue';
import BaseInput from './base/BaseInput.vue';
import { useDiceStore } from '@/stores/dice';
import { useAreasStore } from '@/stores/areas';
import { useUIStore } from '@/stores/ui';
import { useToastStore } from '@/stores/toast';
import { useConfigManagerStore } from '@/stores/configManager';
import { storeToRefs } from 'pinia';
import { isAreaNameUnique } from '@/utils/areas';

const diceStore = useDiceStore();
const areasStore = useAreasStore();
const uiStore = useUIStore();
const toastStore = useToastStore();
const configManagerStore = useConfigManagerStore();

const { dice } = storeToRefs(diceStore);

// Tab state
const activeTab = ref<'dice' | 'areas' | 'save' | 'load'>('dice');

// Areas form state
const newAreaName = ref<string>('');
const newAreaInput = ref<HTMLInputElement | null>(null);

// Refs for child components
const dicePanel = ref<InstanceType<typeof DiceManagementPanel> | null>(null);
const savePanel = ref<InstanceType<typeof SaveGamePanel> | null>(null);

// Computed save form state - delegated to SaveGamePanel
const saveName = ref<string>('');

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

const handleAreaDeleted = () => {
  // Area deletion is handled within AreasManagementPanel
};

// Configuration management
const handleSaveConfiguration = async (name: string, description: string) => {
  try {
    await configManagerStore.saveConfiguration(name, description);
    toastStore.show('Game saved successfully');
    activeTab.value = 'dice';
  } catch {
    toastStore.show('Failed to save game');
  }
};

const handleSave = () => {
  savePanel.value?.handleSave();
};

const handleConfigurationLoaded = () => {
  activeTab.value = 'dice';
};

const handleConfigurationDeleted = () => {
  // Deletion handled in LoadGamePanel
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
</script>

<style scoped>
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

.tab-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.tab-scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  padding-right: calc(1.5rem + env(safe-area-inset-right, 0px));
  padding-left: calc(1.5rem + env(safe-area-inset-left, 0px));
}

.add-area-form {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.add-area-form :deep(.base-input) {
  flex: 1;
}
</style>
