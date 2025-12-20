<template>
  <DrawerWrapper
    :title="$t('panels.game-config')"
    :is-open="uiStore.showConfig"
    @close="uiStore.closeConfig"
  >
    <!-- Tab Navigation Header -->
    <template #header>
      <div class="tab-navigation">
        <button :class="['tab-btn', { active: activeTab === 'dice' }]" @click="activeTab = 'dice'">
          {{ $t('tabs.dice') }}
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'areas' }]"
          @click="activeTab = 'areas'"
        >
          {{ $t('tabs.areas') }}
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'configs' }]"
          @click="
            activeTab = 'configs';
            loadConfigurations();
          "
        >
          {{ $t('tabs.configs') }}
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

      <!-- CONFIGS TAB (Save & Load) -->
      <div v-if="activeTab === 'configs'" class="tab-scroll-content">
        <div class="configs-container">
          <!-- Save Section (Compact, on top) -->
          <div class="configs-section configs-section-save">
            <h3 class="section-title">{{ $t('tabs.save') }}</h3>
            <SaveGamePanel ref="savePanel" @save="handleSaveConfiguration" />
          </div>

          <!-- Divider -->
          <div class="configs-divider"></div>

          <!-- Load Section -->
          <div class="configs-section">
            <h3 class="section-title">{{ $t('tabs.load') }}</h3>
            <LoadGamePanel @load="handleConfigurationLoaded" @delete="handleConfigurationDeleted" />
          </div>
        </div>
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
        {{ $t('buttons.reset-game') }}
      </BaseButton>
      <div v-else-if="activeTab === 'areas'" class="add-area-form">
        <BaseInput
          ref="newAreaInput"
          v-model="newAreaName"
          type="text"
          :placeholder="$t('forms.new-area-placeholder')"
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
    </template>
  </DrawerWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();

const diceStore = useDiceStore();
const areasStore = useAreasStore();
const uiStore = useUIStore();
const toastStore = useToastStore();
const configManagerStore = useConfigManagerStore();

const { dice } = storeToRefs(diceStore);

// Tab state
const activeTab = ref<'dice' | 'areas' | 'configs'>('dice');

// Areas form state
const newAreaName = ref<string>('');
const newAreaInput = ref<InstanceType<typeof BaseInput> | null>(null);

// Refs for child components
const dicePanel = ref<InstanceType<typeof DiceManagementPanel> | null>(null);
const savePanel = ref<InstanceType<typeof SaveGamePanel> | null>(null);

// Areas management
const handleAddArea = () => {
  const trimmedName = newAreaName.value.trim();

  if (!trimmedName) {
    toastStore.show(t('validation.empty-area-name'));
    return;
  }

  if (!isAreaNameUnique(areasStore.areas, trimmedName)) {
    toastStore.show(t('validation.duplicate-area'));
    return;
  }

  areasStore.addArea(trimmedName);
  newAreaName.value = '';
  toastStore.show(t('messages.area-added'));
  newAreaInput.value?.focus();
};

const handleAreaDeleted = () => {
  // Area deletion is handled within AreasManagementPanel
};

// Configuration management
const handleSaveConfiguration = async (name: string, description: string) => {
  try {
    await configManagerStore.saveConfiguration(name, description);
    toastStore.show(t('messages.game-saved'));
    activeTab.value = 'dice';
  } catch {
    toastStore.show(t('messages.save-failed'));
  }
};

const handleConfigurationLoaded = () => {
  activeTab.value = 'dice';
};

const handleConfigurationDeleted = () => {
  // Deletion handled in LoadGamePanel
};

const handleDeleteCurrentConfiguration = () => {
  if (confirm(t('dialogs.reset-warning'))) {
    configManagerStore.deleteCurrentConfiguration();
    toastStore.show(t('messages.game-reset'));
  }
};

const loadConfigurations = async () => {
  try {
    await configManagerStore.loadConfigurations();
  } catch {
    toastStore.show(t('messages.load-failed'));
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
}

.add-area-form {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.add-area-form :deep(.base-input) {
  flex: 1;
}

/* Configs Container */
.configs-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem;
}

.configs-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.configs-section-save {
  padding: 0.75rem;
  background: #1f2937;
  border-radius: 0.375rem;
}

.section-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #d1d5db;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.configs-divider {
  height: 1px;
  background: #374151;
  margin: 0.25rem 0;
}
</style>
