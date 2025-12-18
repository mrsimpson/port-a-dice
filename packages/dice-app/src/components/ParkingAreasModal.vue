<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="uiStore.showParkingAreas" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Parking Areas</h2>
            <button @click="uiStore.closeParkingAreas" class="btn-close" aria-label="Close">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="areas-container">
              <div v-if="areasStore.sortedAreas.length === 0" class="empty-state">
                <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>No parking areas yet. Add one below.</p>
              </div>

              <div v-else class="areas-list">
                <ParkingAreaItem
                  v-for="area in areasStore.sortedAreas"
                  :key="area.id"
                  :area="area"
                  @assign="handleAssign"
                  @delete="handleDelete"
                />
              </div>

              <div class="add-area-form">
                <input
                  ref="newAreaInput"
                  v-model="newAreaName"
                  type="text"
                  placeholder="New area name..."
                  class="area-name-input"
                  @keyup.enter="handleAddArea"
                />
                <button @click="handleAddArea" class="btn-add" :disabled="!newAreaName.trim()">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ParkingAreaItem from './ParkingAreaItem.vue';
import { useAreasStore } from '@/stores/areas';
import { useDiceStore } from '@/stores/dice';
import { useUIStore } from '@/stores/ui';
import { useToastStore } from '@/stores/toast';
import { isAreaNameUnique } from '@/utils/areas';

const areasStore = useAreasStore();
const diceStore = useDiceStore();
const uiStore = useUIStore();
const toastStore = useToastStore();

const newAreaName = ref('');
const newAreaInput = ref<HTMLInputElement | null>(null);

const handleAssign = (areaId: string) => {
  // Individual dice parking is handled by clicking on dice directly
};

const handleAddArea = () => {
  const trimmedName = newAreaName.value.trim();

  if (!trimmedName) {
    toastStore.show('Area name cannot be empty');
    return;
  }

  if (!isAreaNameUnique(areasStore.areas, trimmedName)) {
    toastStore.show('Area name already exists');
    return;
  }

  areasStore.addArea(trimmedName);
  newAreaName.value = '';
  toastStore.show('Area added');
  newAreaInput.value?.focus();
};

const handleDelete = (areaId: string) => {
  const diceInArea = diceStore.diceInArea(areaId);
  diceInArea.forEach((dice) => {
    diceStore.assignDiceToAreaById(dice.id, null);
  });

  areasStore.removeArea(areaId);
  toastStore.show('Area deleted');
};

const handleOverlayClick = () => {
  uiStore.closeParkingAreas();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #1f2937;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #374151;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f3f4f6;
  margin: 0;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #374151;
  color: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  color: #9ca3af;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.75rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 0.875rem;
  margin: 0;
}

.areas-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.areas-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 50vh;
  overflow-y: auto;
}

.add-area-form {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #374151;
}

.area-name-input {
  flex: 1;
  padding: 0.75rem;
  background: #374151;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  color: #f3f4f6;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.area-name-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #1f2937;
}

.area-name-input::placeholder {
  color: #6b7280;
}

.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  background: #10b981;
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-add:hover:not(:disabled) {
  background: #059669;
}

.btn-add:active:not(:disabled) {
  transform: scale(0.95);
}

.btn-add:disabled {
  background: #374151;
  color: #6b7280;
  cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
