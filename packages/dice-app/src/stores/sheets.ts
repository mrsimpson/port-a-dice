import { defineStore } from 'pinia';
import type { PlayerSheet, SheetPath, SheetsState } from '@/types';

/** Maximum number of undo states to preserve */
const MAX_UNDO_STACK = 50;

/**
 * Generate a unique ID for sheets and paths
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new player sheet
 */
function createPlayerSheet(playerName: string): PlayerSheet {
  const now = Date.now();
  return {
    id: generateId(),
    playerName,
    paths: [],
    backgroundImage: null,
    createdAt: now,
    updatedAt: now,
    undoStack: [],
    redoStack: [],
  };
}

/**
 * Deep clone the paths array
 */
function clonePaths(paths: SheetPath[]): SheetPath[] {
  return paths.map((p) => ({
    ...p,
    points: [...p.points],
  }));
}

/**
 * Sheets store manages per-player drawing canvases (scribble sheets).
 * Each player gets their own canvas with freeform drawing/writing.
 * Supports undo/redo with ~50 action limit.
 */
export const useSheetsStore = defineStore('sheets', {
  state: (): SheetsState => ({
    sheets: [],
    activeSheetId: null,
  }),

  getters: {
    /** Get the currently active sheet */
    activeSheet: (state): PlayerSheet | undefined => {
      if (!state.activeSheetId) return undefined;
      return state.sheets.find((s) => s.id === state.activeSheetId);
    },

    /** Get total number of sheets */
    sheetCount: (state): number => state.sheets.length,

    /** Get sheets sorted by creation time */
    sortedSheets: (state): PlayerSheet[] => {
      return [...state.sheets].sort((a, b) => a.createdAt - b.createdAt);
    },

    /** Check if active sheet can undo */
    canUndo: (state): boolean => {
      const active = state.sheets.find((s) => s.id === state.activeSheetId);
      return active ? active.undoStack.length > 0 : false;
    },

    /** Check if active sheet can redo */
    canRedo: (state): boolean => {
      const active = state.sheets.find((s) => s.id === state.activeSheetId);
      return active ? active.redoStack.length > 0 : false;
    },

    /** Get sheet by ID */
    getSheetById:
      (state) =>
      (id: string): PlayerSheet | undefined => {
        return state.sheets.find((s) => s.id === id);
      },
  },

  actions: {
    /**
     * Add a new player sheet
     */
    addPlayerSheet(playerName: string): string {
      const sheet = createPlayerSheet(playerName);
      this.sheets.push(sheet);
      this.activeSheetId = sheet.id;
      return sheet.id;
    },

    /**
     * Remove a player sheet
     */
    removePlayerSheet(id: string): void {
      const index = this.sheets.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.sheets.splice(index, 1);
        // If we removed the active sheet, switch to another
        if (this.activeSheetId === id) {
          this.activeSheetId = this.sheets.length > 0 ? this.sheets[0].id : null;
        }
      }
    },

    /**
     * Set the active sheet
     */
    setActiveSheet(id: string): void {
      const sheet = this.sheets.find((s) => s.id === id);
      if (sheet) {
        this.activeSheetId = id;
        // Switching sheets clears the redo stack
        const active = this.sheets.find((s) => s.id === this.activeSheetId);
        if (active) {
          active.redoStack = [];
        }
      }
    },

    /**
     * Update player name for a sheet
     */
    updateSheetPlayerName(id: string, playerName: string): void {
      const sheet = this.sheets.find((s) => s.id === id);
      if (sheet) {
        sheet.playerName = playerName;
        sheet.updatedAt = Date.now();
      }
    },

    /**
     * Update background image for a sheet
     */
    updateSheetBackground(id: string, backgroundImage: string | null): void {
      const sheet = this.sheets.find((s) => s.id === id);
      if (sheet) {
        sheet.backgroundImage = backgroundImage;
        sheet.updatedAt = Date.now();
      }
    },

    /**
     * Clear all paths from a sheet (with undo support)
     */
    clearSheet(id: string): void {
      const sheet = this.sheets.find((s) => s.id === id);
      if (!sheet || sheet.paths.length === 0) return;

      // Push current state to undo stack before clearing
      this.pushToUndoStack(sheet, sheet.paths);

      // Clear paths
      sheet.paths = [];
      sheet.updatedAt = Date.now();
    },

    /**
     * Add a new path to a sheet (for undo/redo tracking)
     */
    addPath(id: string, path: SheetPath): void {
      const sheet = this.sheets.find((s) => s.id === id);
      if (!sheet) return;

      // Push current paths to undo stack before adding new path
      this.pushToUndoStack(sheet, sheet.paths);

      // Add the new path
      sheet.paths.push(path);
      sheet.updatedAt = Date.now();
    },

    /**
     * Set paths directly (without undo tracking - for initial load)
     */
    setPathsDirect(id: string, paths: SheetPath[]): void {
      const sheet = this.sheets.find((s) => s.id === id);
      if (!sheet) return;

      sheet.paths = paths;
      sheet.updatedAt = Date.now();
    },

    /**
     * Push current paths state to undo stack
     */
    pushToUndoStack(sheet: PlayerSheet, currentPaths: SheetPath[]): void {
      // Clone current state
      const clonedPaths = clonePaths(currentPaths);

      // Add to undo stack
      sheet.undoStack.push(clonedPaths);

      // Limit stack size
      if (sheet.undoStack.length > MAX_UNDO_STACK) {
        sheet.undoStack.shift();
      }

      // Adding new action clears redo stack
      sheet.redoStack = [];
    },

    /**
     * Undo the last drawing action
     */
    undo(id: string): void {
      const sheet = this.sheets.find((s) => s.id === id);
      if (!sheet || sheet.undoStack.length === 0) return;

      // Save current state to redo stack
      sheet.redoStack.push(clonePaths(sheet.paths));

      // Restore previous state
      const previousPaths = sheet.undoStack.pop();
      sheet.paths = previousPaths ? clonePaths(previousPaths) : [];
      sheet.updatedAt = Date.now();
    },

    /**
     * Redo the last undone action
     */
    redo(id: string): void {
      const sheet = this.sheets.find((s) => s.id === id);
      if (!sheet || sheet.redoStack.length === 0) return;

      // Save current state to undo stack
      sheet.undoStack.push(clonePaths(sheet.paths));

      // Restore next state
      const nextPaths = sheet.redoStack.pop();
      sheet.paths = nextPaths ? clonePaths(nextPaths) : [];
      sheet.updatedAt = Date.now();
    },

    /**
     * Set sheets directly (used when loading from config)
     */
    setSheets(sheets: PlayerSheet[]): void {
      this.sheets = sheets;
      // Set first sheet as active if none selected
      if (!this.activeSheetId && sheets.length > 0) {
        this.activeSheetId = sheets[0].id;
      }
    },

    /**
     * Clear all sheets
     */
    clearAllSheets(): void {
      this.sheets = [];
      this.activeSheetId = null;
    },
  },

  persist: {
    key: 'sheets-store',
    storage: localStorage,
  },
});
