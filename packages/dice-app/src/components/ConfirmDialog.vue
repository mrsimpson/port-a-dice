<template>
  <Teleport to="body">
    <div v-if="uiStore.showResetConfirm" class="modal-overlay" @click="handleCancel">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Confirm Reset</h2>
        </div>

        <div class="modal-content">
          <p class="message">
            Are you sure you want to reset all dice? This action cannot be undone.
          </p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-cancel" @click="handleCancel">Cancel</button>
          <button class="btn btn-confirm" @click="handleConfirm">Reset</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useDiceStore } from '@/stores/dice';
import { useUIStore } from '@/stores/ui';

const diceStore = useDiceStore();
const uiStore = useUIStore();

const handleConfirm = () => {
  diceStore.resetAll();
  uiStore.closeResetConfirm();
};

const handleCancel = () => {
  uiStore.closeResetConfirm();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  width: 100%;
  max-width: 400px;
  background: #1f2937;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #374151;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f3f4f6;
  margin: 0;
}

.modal-content {
  padding: 1.5rem;
}

.message {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #374151;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-cancel {
  background: #6b7280;
  color: white;
}

.btn-cancel:hover {
  background: #4b5563;
}

.btn-confirm {
  background: #ef4444;
  color: white;
}

.btn-confirm:hover {
  background: #dc2626;
}
</style>
