import { defineStore } from 'pinia';

// A single stroke as stored by vue-drawing-canvas
export interface Stroke {
  type: string;
  from: { x: number; y: number };
  coordinates: { x: number; y: number }[];
  color: string;
  width: number | string;
  fill: boolean;
  lineCap: string;
  lineJoin: string;
}

export const useScoreSheetStore = defineStore('scoresheet', {
  state: () => ({
    strokes: [] as Stroke[], // full stroke history for faithful restore & undo
    canvasData: null as string | null, // flattened PNG, kept for export
    lastUpdated: null as string | null,
  }),

  getters: {
    hasDrawing: (state) => state.strokes.length > 0,
  },

  actions: {
    updateStrokes(strokes: Stroke[], canvasData: string) {
      this.strokes = strokes;
      this.canvasData = canvasData;
      this.lastUpdated = new Date().toISOString();
    },

    clearCanvas() {
      this.strokes = [];
      this.canvasData = null;
      this.lastUpdated = null;
    },

    exportImage() {
      if (!this.canvasData) return;

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
