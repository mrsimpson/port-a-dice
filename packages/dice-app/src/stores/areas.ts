import { defineStore } from 'pinia';
import type { ParkingArea } from '@/types';
import { DEFAULT_AREAS } from '@/types';
import { createArea, updateAreaLabel, sortAreasByOrder, reorderAreas } from '@/utils/areas';

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

    addArea(label: string) {
      const order = this.areas.length;
      this.areas.push(createArea(label, order));
    },

    updateArea(id: string, label: string) {
      const index = this.areas.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.areas[index] = updateAreaLabel(this.areas[index], label);
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
  },

  persist: {
    key: 'areas-store',
    storage: localStorage,
  },
});
