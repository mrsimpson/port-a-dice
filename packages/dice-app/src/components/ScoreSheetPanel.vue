<template>
  <div class="score-sheet-panel">
    <div class="sheet-header">
      <h3 class="sheet-title">{{ $t('scoreSheet.title') }}</h3>
      <BaseButton variant="secondary" size="sm" @click="handleClear">
        {{ $t('scoreSheet.clear') }}
      </BaseButton>
    </div>

    <div class="sheet-grid" :style="{ '--cols': sheet?.cols ?? 6 }">
      <div
        v-for="cell in displayedCells"
        :key="cell.id"
        class="sheet-cell"
        :class="{
          'sheet-cell--locked': cell.locked,
          'sheet-cell--empty': cell.value === null,
        }"
        @click="handleCellClick(cell.row, cell.col)"
        @contextmenu.prevent="handleCellLongPress(cell.row, cell.col)"
      >
        <span v-if="cell.value !== null" class="cell-value">{{ cell.value }}</span>
        <span v-else class="cell-placeholder">-</span>
        <svg
          v-if="cell.locked"
          class="cell-lock-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
    </div>

    <!-- Edit Dialog -->
    <div v-if="showEditDialog" class="edit-dialog-overlay" @click="closeEditDialog">
      <div class="edit-dialog" @click.stop>
        <h4 class="edit-dialog-title">{{ $t('scoreSheet.enterScore') }}</h4>
        <BaseInput
          ref="editInput"
          v-model="editValue"
          type="number"
          class="edit-input"
          :placeholder="$t('scoreSheet.scorePlaceholder')"
          @keyup.enter="saveEditValue"
          @keyup.esc="closeEditDialog"
        />
        <div class="edit-dialog-actions">
          <BaseButton variant="secondary" @click="closeEditDialog">
            {{ $t('common.cancel') }}
          </BaseButton>
          <BaseButton variant="danger" @click="clearEditValue">
            {{ $t('scoreSheet.clearCell') }}
          </BaseButton>
          <BaseButton @click="saveEditValue">
            {{ $t('common.save') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseButton from './base/BaseButton.vue';
import BaseInput from './base/BaseInput.vue';
import { useScoreSheetStore } from '@/stores/scoreSheet';
import { useToastStore } from '@/stores/toast';

const { t } = useI18n();
const scoreSheetStore = useScoreSheetStore();
const toastStore = useToastStore();

const showEditDialog = ref(false);
const editValue = ref('');
const editInput = ref<HTMLInputElement | null>(null);
const editingCell = ref<{ row: number; col: number } | null>(null);

onMounted(() => {
  scoreSheetStore.initializeSheet();
});

const sheet = computed(() => scoreSheetStore.sheet);
const displayedCells = computed(() => scoreSheetStore.cells);

const handleCellClick = (row: number, col: number) => {
  const cell = scoreSheetStore.getCellByPosition(row, col);
  if (!cell) return;

  if (cell.locked) {
    toastStore.show(t('scoreSheet.cellLocked'));
    return;
  }

  editingCell.value = { row, col };
  editValue.value = cell.value !== null ? String(cell.value) : '';
  showEditDialog.value = true;

  nextTick(() => {
    editInput.value?.focus();
  });
};

const handleCellLongPress = (row: number, col: number) => {
  const cell = scoreSheetStore.getCellByPosition(row, col);
  if (!cell || cell.value === null) {
    toastStore.show(t('scoreSheet.lockRequiresValue'));
    return;
  }

  scoreSheetStore.toggleCellLock(row, col);
  const message = cell.locked ? t('scoreSheet.unlocked') : t('scoreSheet.locked');
  toastStore.show(message);
};

const saveEditValue = () => {
  if (!editingCell.value) return;

  const value = editValue.value.trim();
  const numValue = value === '' ? null : parseInt(value, 10);

  if (numValue !== null && isNaN(numValue)) {
    toastStore.show(t('scoreSheet.invalidNumber'));
    return;
  }

  scoreSheetStore.setCellValue(editingCell.value.row, editingCell.value.col, numValue);
  closeEditDialog();
};

const clearEditValue = () => {
  if (!editingCell.value) return;
  scoreSheetStore.setCellValue(editingCell.value.row, editingCell.value.col, null);
  closeEditDialog();
};

const closeEditDialog = () => {
  showEditDialog.value = false;
  editValue.value = '';
  editingCell.value = null;
};

const handleClear = () => {
  scoreSheetStore.clearSheet();
  toastStore.show(t('scoreSheet.cleared'));
};
</script>

<style scoped>
.score-sheet-panel {
  padding: 1rem;
  background: var(--color-bg-darker, #1f2937);
  border-radius: 0.5rem;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sheet-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-light, #f3f4f6);
  margin: 0;
}

.sheet-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: 0.5rem;
}

.sheet-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-dark, #374151);
  border: 1px solid var(--color-border, #4b5563);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-height: 3rem;
}

.sheet-cell:hover {
  background: var(--color-bg-light, #4b5563);
  border-color: var(--color-primary-blue, #3b82f6);
}

.sheet-cell--locked {
  background: var(--color-bg-darker, #1f2937);
  border-color: var(--color-primary-yellow, #eab308);
  opacity: 0.8;
}

.sheet-cell--empty {
  opacity: 0.5;
}

.cell-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-light, #f3f4f6);
}

.cell-placeholder {
  font-size: 1rem;
  color: var(--color-text-gray, #9ca3af);
}

.cell-lock-icon {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 0.75rem;
  height: 0.75rem;
  color: var(--color-primary-yellow, #eab308);
}

/* Edit Dialog */
.edit-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-dialog {
  background: var(--color-bg-darker, #1f2937);
  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 20rem;
}

.edit-dialog-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-light, #f3f4f6);
  margin: 0 0 1rem 0;
}

.edit-input {
  width: 100%;
  margin-bottom: 1rem;
}

.edit-dialog-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
