<template>
  <div class="app">
    <header class="header">
      <h1 class="title">Port-A-Dice</h1>
      <div class="header-actions">
        <button @click="uiStore.toggleDiceConfig" class="btn-icon" aria-label="Dice Configuration">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
        <button @click="uiStore.toggleParkingAreas" class="btn-icon" aria-label="Parking Areas">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </button>
        <button @click="uiStore.toggleHistory" class="btn-icon" aria-label="History">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>

    <main class="main">
      <DiceScene />
    </main>

    <FloatingActions />
    <HistoryDrawer />
    <ConfirmDialog />
    <DiceConfigModal />
    <ParkingAreasModal />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DiceScene from './components/DiceScene.vue';
import FloatingActions from './components/FloatingActions.vue';
import HistoryDrawer from './components/HistoryDrawer.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
import DiceConfigModal from './components/DiceConfigModal.vue';
import ParkingAreasModal from './components/ParkingAreasModal.vue';
import Toast from './components/Toast.vue';
import { useAreasStore } from './stores/areas';
import { useUIStore } from './stores/ui';

const areasStore = useAreasStore();
const uiStore = useUIStore();

onMounted(() => {
  areasStore.initializeDefaultAreas();
});
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #111827;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #1f2937;
  border-bottom: 1px solid #374151;
  z-index: 10;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f3f4f6;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #374151;
  color: #f3f4f6;
}

.btn-icon:active {
  transform: scale(0.95);
}

.main {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
