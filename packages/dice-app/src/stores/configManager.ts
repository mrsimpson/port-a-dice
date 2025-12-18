import { defineStore } from 'pinia';
import type { GameConfiguration, IConfigStore } from '@/types';
import { LocalStorageConfigStore } from '@/storage/configStore';
import { useDiceStore } from './dice';
import { useAreasStore } from './areas';

export const useConfigManagerStore = defineStore('configManager', {
  state: () => ({
    storage: new LocalStorageConfigStore() as IConfigStore,
    configurations: [] as GameConfiguration[],
    currentConfigId: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    currentConfig: (state) => {
      if (!state.currentConfigId) return null;
      return state.configurations.find((c) => c.id === state.currentConfigId) || null;
    },
  },

  actions: {
    async saveConfiguration(name: string, description?: string) {
      this.error = null;
      const diceStore = useDiceStore();
      const areasStore = useAreasStore();

      const id = `config_${Date.now()}`;
      const now = Date.now();

      const config: GameConfiguration = {
        id,
        name,
        description,
        dice: diceStore.dice,
        areas: areasStore.areas,
        createdAt: now,
        updatedAt: now,
        syncStatus: 'local',
      };

      try {
        await this.storage.save(config);
        this.configurations.push(config);
        this.currentConfigId = id;
      } catch (err) {
        this.error = `Failed to save game configuration: ${err instanceof Error ? err.message : 'Unknown error'}`;
        throw err;
      }
    },

    async loadConfiguration(id: string) {
      this.error = null;
      const diceStore = useDiceStore();
      const areasStore = useAreasStore();

      try {
        const config = await this.storage.load(id);

        // Load dice and areas from config
        diceStore.dice = config.dice;
        areasStore.areas = config.areas;

        this.currentConfigId = id;
      } catch (err) {
        this.error = `Failed to load game configuration: ${err instanceof Error ? err.message : 'Unknown error'}`;
        throw err;
      }
    },

    async deleteConfiguration(id: string) {
      this.error = null;

      try {
        await this.storage.delete(id);
        this.configurations = this.configurations.filter((c) => c.id !== id);

        if (this.currentConfigId === id) {
          this.currentConfigId = null;
        }
      } catch (err) {
        this.error = `Failed to delete game configuration: ${err instanceof Error ? err.message : 'Unknown error'}`;
        throw err;
      }
    },

    async deleteCurrentConfiguration() {
      const diceStore = useDiceStore();
      const areasStore = useAreasStore();

      diceStore.dice = [];
      areasStore.areas = [];
      this.currentConfigId = null;
    },

    async loadConfigurations() {
      this.error = null;

      try {
        this.configurations = await this.storage.list();
      } catch (err) {
        this.error = `Failed to load game configurations: ${err instanceof Error ? err.message : 'Unknown error'}`;
        throw err;
      }
    },
  },
});
