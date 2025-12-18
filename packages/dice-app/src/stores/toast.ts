import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    visible: false,
    timeoutId: null as number | null,
  }),

  actions: {
    show(message: string, duration: number = 3000) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.message = message;
      this.visible = true;

      this.timeoutId = window.setTimeout(() => {
        this.hide();
      }, duration);
    },

    hide() {
      this.visible = false;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    },
  },
});
