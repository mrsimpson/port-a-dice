import { defineStore } from 'pinia';

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingPath {
  id: string;
  points: DrawingPoint[];
  color: string;
  width: number;
  mode: 'pen' | 'eraser';
}

export const useScoreSheetStore = defineStore('scoreSheet', {
  state: () => ({
    paths: [] as DrawingPath[],
    currentPath: [] as DrawingPoint[],
    currentTool: 'pen' as 'pen' | 'eraser',
    isDrawing: false,
    canvasRef: null as HTMLCanvasElement | null,
  }),

  getters: {
    penColor: () => '#f3f4f6', // White for pen
    eraserColor: () => '#111827', // Background color for eraser
    currentLineWidth: () => 4,
    eraserLineWidth: () => 20,
  },

  actions: {
    startDrawing(x: number, y: number) {
      this.isDrawing = true;
      this.currentPath = [{ x, y }];
    },

    drawPoint(x: number, y: number) {
      if (this.isDrawing) {
        this.currentPath.push({ x, y });
      }
    },

    endDrawing() {
      if (this.isDrawing && this.currentPath.length > 1) {
        const newPath: DrawingPath = {
          id: crypto.randomUUID(),
          points: [...this.currentPath],
          color: this.currentTool === 'pen' ? this.penColor : this.eraserColor,
          width: this.currentTool === 'pen' ? this.currentLineWidth : this.eraserLineWidth,
          mode: this.currentTool,
        };
        this.paths.push(newPath);
        this.currentPath = [];
      }
      this.isDrawing = false;
    },

    setTool(tool: 'pen' | 'eraser') {
      this.currentTool = tool;
    },

    clearCanvas() {
      this.paths = [];
      this.currentPath = [];
    },

    resetStore() {
      this.paths = [];
      this.currentPath = [];
      this.isDrawing = false;
      this.currentTool = 'pen';
    },
  },

  persist: {
    key: 'score-sheet-store',
    storage: localStorage,
    paths: ['paths'],
  },
});
