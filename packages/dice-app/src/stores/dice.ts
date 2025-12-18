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
      console.log('[STORE] rollAllDice called, isRolling:', this.isRolling);
      console.log('[STORE] Total dice in store:', this.dice.length);
      this.dice.forEach((d, i) => {
        console.log(
          `[STORE]   Dice ${i}: id=${d.id.substring(0, 8)}, value=${d.value}, areaId=${d.areaId}`
        );
      });

      const unparkedDice = this.dice.filter((d) => d.areaId === null);
      console.log('[STORE] Unparked dice count:', unparkedDice.length);
      unparkedDice.forEach((d, i) => {
        console.log(`[STORE]   Unparked ${i}: id=${d.id.substring(0, 8)}, value=${d.value}`);
      });

      if (unparkedDice.length === 0) {
        console.log('[STORE] No unparked dice');
        const toastStore = useToastStore();
        toastStore.show('All dice are parked');
        return;
      }

      if (this.isRolling) {
        console.log('[STORE] Already rolling, ignoring roll request');
        return;
      }

      console.log('[STORE] Starting roll, setting isRolling = true');
      this.isRolling = true;
      console.log('[STORE] After setting, isRolling is now:', this.isRolling);

      const oldDice = this.dice.map((d) => ({ id: d.id.substring(0, 8), value: d.value }));

      // Create new array with rolled dice
      const newDiceArray = this.dice.map((d, index) => {
        if (d.areaId === null) {
          const oldValue = d.value;
          const rolled = rollDice(d);
          console.log(
            `[STORE] [${index}] Rolling die ${d.id.substring(0, 8)}: ${oldValue} -> ${rolled.value}`
          );
          return rolled;
        }
        console.log(`[STORE] [${index}] Skipping parked die ${d.id.substring(0, 8)}`);
        return d;
      });

      // IMPORTANT: Assign the new array to trigger reactivity
      this.dice = newDiceArray;
      console.log('[STORE] Assigned new dice array, count:', this.dice.length);
      this.dice.forEach((d, i) => {
        console.log(`[STORE]   After roll ${i}: id=${d.id.substring(0, 8)}, value=${d.value}`);
      });

      const newDice = this.dice.map((d) => ({ id: d.id.substring(0, 8), value: d.value }));
      console.log('[STORE] Dice values changed:', { old: oldDice, new: newDice });

      const historyStore = useHistoryStore();
      const areasStore = useAreasStore();
      historyStore.addEntry(this.dice, areasStore.areas);

      // Use arrow function to preserve 'this' context
      const timeoutId = setTimeout(() => {
        console.log('[STORE] Resetting isRolling = false after 1500ms, was:', this.isRolling);
        this.isRolling = false;
        console.log('[STORE] After reset, isRolling is now:', this.isRolling);
      }, 1500);

      console.log('[STORE] Set setTimeout with ID:', timeoutId);
    },

    rollAllDiceForced() {
      console.log('[STORE] rollAllDiceForced called, isRolling:', this.isRolling);
      if (this.isRolling) {
        console.log('[STORE] Already rolling, ignoring rollAllDiceForced request');
        return;
      }

      console.log('[STORE] Starting forced roll, setting isRolling = true');
      this.isRolling = true;
      console.log('[STORE] After setting, isRolling is now:', this.isRolling);

      const oldDice = this.dice.map((d) => ({ id: d.id.substring(0, 8), value: d.value }));

      this.dice = this.dice.map((d) => rollDice(d));

      const newDice = this.dice.map((d) => ({ id: d.id.substring(0, 8), value: d.value }));
      console.log('[STORE] Forced roll - all dice values changed:', { old: oldDice, new: newDice });

      const historyStore = useHistoryStore();
      const areasStore = useAreasStore();
      historyStore.addEntry(this.dice, areasStore.areas);

      // Use arrow function to preserve 'this' context
      const timeoutId = setTimeout(() => {
        console.log(
          '[STORE] Resetting isRolling = false after 1500ms (forced), was:',
          this.isRolling
        );
        this.isRolling = false;
        console.log('[STORE] After reset, isRolling is now:', this.isRolling);
      }, 1500);

      console.log('[STORE] Set setTimeout with ID:', timeoutId);
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
