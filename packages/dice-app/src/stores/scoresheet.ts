import { defineStore } from 'pinia';

export const useScoreSheetStore = defineStore('scoresheet', {
  state: () => ({
    canvasData: null as string | null, // base64 data for persistence
    lastUpdated: null as string | null, // ISO timestamp
  }),

  getters: {
    hasDrawing: (state) => state.canvasData !== null,
  },

  actions: {
    updateCanvas(canvasData: string) {
      this.canvasData = canvasData;
      this.lastUpdated = new Date().toISOString();
    },

    clearCanvas() {
      this.canvasData = null;
      this.lastUpdated = null;
    },

    exportImage() {
      if (!this.canvasData) return;

      // Create downloadable link and trigger download
      const link = document.createElement('a');
      link.download = `scoresheet-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = this.canvasData;
      link.click();
    },
  },

  persist: {
    key: 'port-a-dice-scoresheet',
    storage: localStorage,
  },
});
