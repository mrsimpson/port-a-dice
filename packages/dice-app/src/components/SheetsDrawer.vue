<template>
  <DrawerWrapper
    :title="$t('sheets.title')"
    :is-open="uiStore.showSheets"
    @close="uiStore.closeSheets"
  >
    <!-- Player tabs -->
    <template #header>
      <div class="tabs-container">
        <div class="tabs-scroll">
          <PlayerTab
            v-for="sheet in sheetsStore.sortedSheets"
            :key="sheet.id"
            :player-name="sheet.playerName"
            :is-active="sheet.id === sheetsStore.activeSheetId"
            :show-delete="sheetsStore.sheetCount > 1"
            @select="sheetsStore.setActiveSheet(sheet.id)"
            @delete="sheetsStore.removePlayerSheet(sheet.id)"
          />
        </div>
        <button
          class="add-player-btn"
          :title="$t('sheets.addPlayer')"
          @click="showAddPlayerModal = true"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </template>

    <!-- Canvas area or empty state -->
    <div v-if="activeSheet" class="canvas-area">
      <PlayerCanvas
        :paths="activeSheet.paths"
        :background-image="activeSheet.backgroundImage"
        :current-color="drawingColor"
        :current-tool="drawingTool"
        :current-line-width="drawingLineWidth"
        @update:paths="handlePathsUpdate"
      />
    </div>

    <!-- Empty state - show when no sheets -->
    <div v-else class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M15.232 15.232l2.536 2.536m0-2.536l-2.536 2.536m2.536-2.536l-8.464 8.464m-2.536 2.536l8.464-8.464m-5.928 0l5.928 5.928"
        />
      </svg>
      <p>{{ $t('sheets.noSheets') }}</p>
      <button class="btn-primary" @click="showAddPlayerModal = true">
        {{ $t('sheets.addPlayer') }}
      </button>
    </div>

    <!-- Toolbar -->
    <template #footer>
      <DrawingToolbar
        v-if="activeSheet"
        :current-color="drawingColor"
        :current-tool="drawingTool"
        :line-width="drawingLineWidth"
        :can-undo="sheetsStore.canUndo"
        :can-redo="sheetsStore.canRedo"
        @update:color="drawingColor = $event"
        @update:tool="drawingTool = $event"
        @update:line-width="drawingLineWidth = $event"
        @clear="handleClear"
        @undo="handleUndo"
        @redo="handleRedo"
      />
    </template>

    <!-- Add player modal -->
    <Teleport to="body">
      <div v-if="showAddPlayerModal" class="modal-overlay" @click="showAddPlayerModal = false">
        <div class="modal" @click.stop>
          <h3 class="modal-title">{{ $t('sheets.addPlayer') }}</h3>
          <input
            v-model="newPlayerName"
            type="text"
            class="modal-input"
            :placeholder="$t('sheets.enterPlayerName')"
            @keyup.enter="handleAddPlayer"
          />
          <div class="modal-actions">
            <button class="btn-secondary" @click="showAddPlayerModal = false">
              {{ $t('buttons.cancel') }}
            </button>
            <button class="btn-primary" :disabled="!newPlayerName.trim()" @click="handleAddPlayer">
              {{ $t('buttons.add') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </DrawerWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DrawerWrapper from './DrawerWrapper.vue';
import PlayerTab from './PlayerTab.vue';
import PlayerCanvas from './PlayerCanvas.vue';
import DrawingToolbar from './DrawingToolbar.vue';
import { useSheetsStore } from '@/stores/sheets';
import { useUIStore } from '@/stores/ui';
import type { DrawingTool, SheetPath } from '@/types';

const sheetsStore = useSheetsStore();
const uiStore = useUIStore();

// Drawing state
const drawingColor = ref('#ffffff');
const drawingTool = ref<DrawingTool>('pen');
const drawingLineWidth = ref(3);

// Add player modal
const showAddPlayerModal = ref(false);
const newPlayerName = ref('');

// Get active sheet
const activeSheet = computed(() => sheetsStore.activeSheet);

// Handle paths update from canvas
function handlePathsUpdate(paths: SheetPath[]) {
  if (!activeSheet.value) return;

  // We only emit if the paths actually changed (new path added)
  // The store handles the undo stack when adding paths
  const currentPaths = activeSheet.value.paths;
  const lastPath = paths.length > 0 ? paths[paths.length - 1] : null;
  const lastCurrentPath = currentPaths.length > 0 ? currentPaths[currentPaths.length - 1] : null;

  if (lastPath && lastPath !== lastCurrentPath) {
    sheetsStore.addPath(activeSheet.value.id, lastPath);
  }
}

// Handle clear canvas
function handleClear() {
  if (!activeSheet.value) return;
  sheetsStore.clearSheet(activeSheet.value.id);
}

// Handle undo
function handleUndo() {
  if (!activeSheet.value) return;
  sheetsStore.undo(activeSheet.value.id);
}

// Handle redo
function handleRedo() {
  if (!activeSheet.value) return;
  sheetsStore.redo(activeSheet.value.id);
}

// Handle add player
function handleAddPlayer() {
  if (!newPlayerName.value.trim()) return;

  sheetsStore.addPlayerSheet(newPlayerName.value.trim());
  newPlayerName.value = '';
  showAddPlayerModal.value = false;
}
</script>

<style scoped>
.tabs-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #374151;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tabs-scroll {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.add-player-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #374151;
  border: none;
  border-radius: 0.375rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.add-player-btn:hover {
  background: #4b5563;
  color: #f3f4f6;
}

.canvas-area {
  flex: 1;
  min-height: 200px;
  padding: 1rem;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  color: #9ca3af;
  text-align: center;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  opacity: 0.5;
}

.btn-primary {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  border: none;
  border-radius: 0.375rem;
  color: #f3f4f6;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #374151;
  border: none;
  border-radius: 0.375rem;
  color: #f3f4f6;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  background: #1f2937;
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f3f4f6;
  margin: 0 0 1rem;
}

.modal-input {
  width: 100%;
  padding: 0.75rem;
  background: #374151;
  border: none;
  border-radius: 0.375rem;
  color: #f3f4f6;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.modal-input::placeholder {
  color: #9ca3af;
}

.modal-input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
