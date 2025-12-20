import { defineStore } from 'pinia';
import { isBrowserLanguageDetected } from '@/i18n';

export const useUIStore = defineStore('ui', {
  state: () => ({
    isRolling: false,
    rollTrigger: 0,
    showHistory: false,
    showResetConfirm: false,
    showConfig: false,
    showLanguageSwitcher: true, // Will be initialized during app setup
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

    toggleConfig() {
      this.showConfig = !this.showConfig;
    },

    openConfig() {
      this.showConfig = true;
    },

    closeConfig() {
      this.showConfig = false;
    },

    initializeLanguageSwitcherVisibility() {
      this.showLanguageSwitcher = !isBrowserLanguageDetected();
    },
  },
});
