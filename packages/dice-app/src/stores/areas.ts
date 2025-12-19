import { defineStore } from 'pinia';
import type { ParkingArea } from '@/types';
import { DEFAULT_AREAS } from '@/types';
import {
  createArea,
  updateAreaLabel,
  updateAreaColor,
  sortAreasByOrder,
  reorderAreas,
} from '@/utils/areas';

/**
 * Areas store manages the current game session's parking areas.
 * Areas are persisted as part of game configurations in the config manager.
 *
 * This store represents the runtime state of areas for the current session.
 * When loading a configuration, areas are restored to this store.
 * When saving a configuration, areas from this store are persisted.
 */
export const useAreasStore = defineStore('areas', {
  state: () => ({
    areas: [] as ParkingArea[],
  }),

  getters: {
    sortedAreas: (state) => sortAreasByOrder(state.areas),

    getAreaById: (state) => (id: string) => state.areas.find((a) => a.id === id),

    areaCount: (state) => state.areas.length,
  },

  actions: {
    initializeDefaultAreas() {
      if (this.areas.length === 0) {
        this.areas = DEFAULT_AREAS.map((area) => createArea(area.label, area.order));
      }
    },

    addArea(label: string, color?: string) {
      const order = this.areas.length;
      this.areas.push(createArea(label, order, color));
    },

    updateArea(id: string, label: string) {
      const index = this.areas.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.areas[index] = updateAreaLabel(this.areas[index], label);
      }
    },

    updateAreaColor(id: string, color: string) {
      const index = this.areas.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.areas[index] = updateAreaColor(this.areas[index], color);
      }
    },

    removeArea(id: string) {
      const index = this.areas.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.areas.splice(index, 1);
        this.areas = this.areas.map((area, idx) => ({
          ...area,
          order: idx,
        }));
      }
    },

    reorderArea(fromIndex: number, toIndex: number) {
      this.areas = reorderAreas(this.areas, fromIndex, toIndex);
    },

    resetAreas() {
      this.areas = DEFAULT_AREAS.map((area) => createArea(area.label, area.order));
    },

    /**
     * Set the areas directly (used when loading from config)
     */
    setAreas(areas: ParkingArea[]) {
      this.areas = areas;
    },

    /**
     * Clear all areas
     */
    clearAreas() {
      this.areas = [];
    },
  },

  persist: {
    key: 'areas-store',
    storage: localStorage,
  },
});
