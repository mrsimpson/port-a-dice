import { defineStore } from 'pinia';
import type { ScoreSheet } from '@/types';
import {
  createScoreSheet,
  updateCellValue,
  toggleCellLock,
  clearSheet,
  getCellAt,
} from '@/utils/scoreSheet';

/**
 * Score Sheet store manages a virtual score sheet for manual score entry.
 * The sheet is persisted to localStorage for session persistence.
 */
export const useScoreSheetStore = defineStore('scoreSheet', {
  state: () => ({
    sheet: null as ScoreSheet | null,
    isInitialized: false,
  }),

  getters: {
    cells: (state) => state.sheet?.cells ?? [],

    getCellByPosition: (state) => (row: number, col: number) => {
      if (!state.sheet) return undefined;
      return getCellAt(state.sheet, row, col);
    },

    isEmpty: (state) => state.sheet?.cells.every((c) => c.value === null) ?? true,
  },

  actions: {
    /**
     * Initialize the score sheet (creates default if not exists)
     */
    initializeSheet() {
      if (this.isInitialized) return;

      if (!this.sheet) {
        this.sheet = createScoreSheet('Score Sheet', 3, 6);
      }
      this.isInitialized = true;
    },

    /**
     * Set a cell's value
     */
    setCellValue(row: number, col: number, value: number | null) {
      if (!this.sheet) return;

      const cell = getCellAt(this.sheet, row, col);
      if (!cell || cell.locked) return;

      this.sheet = updateCellValue(this.sheet, cell.id, value);
    },

    /**
     * Lock/unlock a cell
     */
    toggleCellLock(row: number, col: number) {
      if (!this.sheet) return;

      const cell = getCellAt(this.sheet, row, col);
      if (!cell) return;

      this.sheet = toggleCellLock(this.sheet, cell.id);
    },

    /**
     * Clear all cell values
     */
    clearSheet() {
      if (!this.sheet) return;
      this.sheet = clearSheet(this.sheet);
    },

    /**
     * Reset the sheet (create new)
     */
    resetSheet() {
      this.sheet = createScoreSheet('Score Sheet', 3, 6);
    },
  },

  persist: {
    key: 'score-sheet-store',
    storage: localStorage,
    paths: ['sheet'],
  },
});
