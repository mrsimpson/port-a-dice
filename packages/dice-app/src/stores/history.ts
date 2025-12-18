import { defineStore } from 'pinia';
import type { RollHistoryEntry, Dice, ParkingArea } from '@/types';

export const useHistoryStore = defineStore('history', {
  state: () => ({
    entries: [] as RollHistoryEntry[],
    maxEntries: 50,
  }),

  getters: {
    sortedEntries: (state) => [...state.entries].sort((a, b) => b.timestamp - a.timestamp),

    latestEntry: (state) => state.entries[state.entries.length - 1],

    entryCount: (state) => state.entries.length,
  },

  actions: {
    addEntry(dice: Dice[], areas: ParkingArea[]) {
      console.log(
        '[History] addEntry called with dice:',
        dice.map((d) => ({ id: d.id.substring(0, 8), value: d.value, color: d.color }))
      );

      const entry: RollHistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        dice: JSON.parse(JSON.stringify(dice)),
        areas: JSON.parse(JSON.stringify(areas)),
      };

      console.log('[History] Created entry:', {
        id: entry.id.substring(0, 8),
        dice: entry.dice.map((d) => ({ id: d.id.substring(0, 8), value: d.value })),
      });

      this.entries.push(entry);

      if (this.entries.length > this.maxEntries) {
        this.entries.shift();
      }

      console.log('[History] Total entries:', this.entries.length);
    },

    removeEntry(id: string) {
      const index = this.entries.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.entries.splice(index, 1);
      }
    },

    clearHistory() {
      this.entries = [];
    },
  },

  persist: {
    key: 'history-store',
    storage: localStorage,
  },
});
