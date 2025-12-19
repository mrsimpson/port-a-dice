import { defineStore } from 'pinia';
import type { Dice, DiceColor } from '@/types';
import { createDice, rollDice, assignDiceToArea } from '@/utils/dice';
import { useHistoryStore } from './history';
import { useAreasStore } from './areas';
import { useToastStore } from './toast';
import { getNextAreaInCycle, sortAreasByOrder } from '@/utils/areas';

export const useDiceStore = defineStore('dice', {
  state: () => ({
    dice: [] as Dice[],
    isRolling: false,
  }),

  getters: {
    getDiceById: (state) => (id: string) => state.dice.find((d) => d.id === id),

    unassignedDice: (state) => state.dice.filter((d) => d.areaId === null),

    diceInArea: (state) => (areaId: string) => state.dice.filter((d) => d.areaId === areaId),
  },

  actions: {
    addDice(color: DiceColor, count: number = 1) {
      for (let i = 0; i < count; i++) {
        this.dice.push(createDice(color));
      }
    },

    removeDice(id: string) {
      const index = this.dice.findIndex((d) => d.id === id);
      if (index !== -1) {
        this.dice.splice(index, 1);
      }
    },

    rollAllDice() {
      const unparkedDice = this.dice.filter((d) => d.areaId === null);

      if (unparkedDice.length === 0) {
        const toastStore = useToastStore();
        toastStore.show('All dice are parked');
        return;
      }

      if (this.isRolling) {
        return;
      }

      this.isRolling = true;

      // Create new array with rolled dice
      const newDiceArray = this.dice.map((d) => {
        if (d.areaId === null) {
          return rollDice(d);
        }
        return d;
      });

      // IMPORTANT: Assign the new array to trigger reactivity
      this.dice = newDiceArray;

      const historyStore = useHistoryStore();
      const areasStore = useAreasStore();
      historyStore.addEntry(this.dice, areasStore.areas);

      // Use arrow function to preserve 'this' context
      setTimeout(() => {
        this.isRolling = false;
      }, 1500);
    },

    rollAllDiceForced() {
      if (this.isRolling) {
        return;
      }

      this.isRolling = true;

      this.dice = this.dice.map((d) => rollDice(d));

      const historyStore = useHistoryStore();
      const areasStore = useAreasStore();
      historyStore.addEntry(this.dice, areasStore.areas);

      // Use arrow function to preserve 'this' context
      setTimeout(() => {
        this.isRolling = false;
      }, 1500);
    },

    assignDiceToAreaById(diceId: string, areaId: string | null) {
      const index = this.dice.findIndex((d) => d.id === diceId);
      if (index !== -1) {
        this.dice[index] = assignDiceToArea(this.dice[index], areaId);
      }
    },

    cycleDiceParking(diceId: string) {
      const areasStore = useAreasStore();
      const sortedAreas = sortAreasByOrder(areasStore.areas);
      const dice = this.getDiceById(diceId);

      if (!dice) return;

      const nextAreaId = getNextAreaInCycle(dice.areaId, sortedAreas);
      this.assignDiceToAreaById(diceId, nextAreaId);
    },

    restoreFromHistory(entry: import('@/types').RollHistoryEntry) {
      this.dice = JSON.parse(JSON.stringify(entry.dice));
      this.isRolling = false;
    },

    resetAll() {
      this.dice = [];
      this.isRolling = false;
    },
  },

  persist: {
    key: 'dice-store',
    storage: localStorage,
    paths: ['dice'],
  },
});
