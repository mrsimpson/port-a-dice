<template>
  <div class="load-game-panel">
    <div v-if="configManagerStore.loading" class="loading-state">Loading saved games...</div>

    <BaseEmptyState
      v-else-if="configManagerStore.configurations.length === 0"
      message="No saved games yet. Create one in the Save tab!"
    />

    <div v-else class="configurations-list">
      <div v-for="config in configManagerStore.configurations" :key="config.id" class="config-item">
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
          <BaseButton variant="primary" @click="handleLoadConfiguration(config.id)">
            Load
          </BaseButton>
          <BaseButton
            variant="danger"
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
          </BaseButton>
        </div>
      </div>
    </div>

    <div v-if="configManagerStore.error" class="error-message">
      {{ configManagerStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigManagerStore } from '@/stores/configManager';
import { useToastStore } from '@/stores/toast';
import BaseEmptyState from '@/components/base/BaseEmptyState.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const configManagerStore = useConfigManagerStore();
const toastStore = useToastStore();

const emit = defineEmits<{
  load: [configId: string];
  delete: [configId: string];
}>();

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return (
    date.toLocaleDateString() +
    ' ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
};

const handleLoadConfiguration = async (configId: string) => {
  try {
    await configManagerStore.loadConfiguration(configId);
    toastStore.show('Game loaded');
    emit('load', configId);
  } catch {
    toastStore.show('Failed to load game');
  }
};

const handleDeleteConfiguration = async (configId: string) => {
  if (confirm('Delete this saved game?')) {
    try {
      await configManagerStore.deleteConfiguration(configId);
      toastStore.show('Game deleted');
      emit('delete', configId);
    } catch {
      toastStore.show('Failed to delete game');
    }
  }
};
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.95rem;
}

.configurations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #374151;
  border-radius: 0.5rem;
  transition: all 0.2s;
  justify-content: space-between;
  align-items: center;
}

.config-item:hover {
  background: #4b5563;
}

.config-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #f3f4f6;
}

.config-description {
  margin: 0;
  font-size: 0.85rem;
  color: #d1d5db;
  line-height: 1.4;
}

.config-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #9ca3af;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.config-actions {
  display: flex;
  gap: 0.5rem;
}

.config-actions :deep(.base-btn--danger) {
  width: 40px;
  padding: 0;
}

.error-message {
  padding: 1rem;
  background: #7f1d1d;
  border: 1px solid #ef4444;
  border-radius: 0.5rem;
  color: #fca5a5;
  font-size: 0.875rem;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

@media (max-width: 640px) {
  .config-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .config-actions {
    width: 100%;
  }
}
</style>
