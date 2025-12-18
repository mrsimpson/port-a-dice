import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    isRolling: false,
    rollTrigger: 0,
    showHistory: false,
    showResetConfirm: false,
    showDiceConfig: false,
    showParkingAreas: false,
  }),

  actions: {
    startRolling() {
      this.isRolling = true;
      this.rollTrigger++;
    },

    stopRolling() {
      this.isRolling = false;
    },

    toggleHistory() {
      this.showHistory = !this.showHistory;
    },

    openHistory() {
      this.showHistory = true;
    },

    closeHistory() {
      this.showHistory = false;
    },

    openResetConfirm() {
      this.showResetConfirm = true;
    },

    closeResetConfirm() {
      this.showResetConfirm = false;
    },

    toggleDiceConfig() {
      this.showDiceConfig = !this.showDiceConfig;
    },

    openDiceConfig() {
      this.showDiceConfig = true;
    },

    closeDiceConfig() {
      this.showDiceConfig = false;
    },

    toggleParkingAreas() {
      this.showParkingAreas = !this.showParkingAreas;
    },

    openParkingAreas() {
      this.showParkingAreas = true;
    },

    closeParkingAreas() {
      this.showParkingAreas = false;
    },
  },
});
