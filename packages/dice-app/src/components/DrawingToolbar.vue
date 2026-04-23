<template>
  <div class="toolbar">
    <!-- Undo/Redo buttons -->
    <div class="toolbar-section">
      <button
        class="tool-btn"
        :disabled="!canUndo"
        :title="$t('sheets.undo')"
        @click="$emit('undo')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </button>
      <button
        class="tool-btn"
        :disabled="!canRedo"
        :title="$t('sheets.redo')"
        @click="$emit('redo')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
          />
        </svg>
      </button>
    </div>

    <!-- Tool selection (Pen/Eraser) -->
    <div class="toolbar-section">
      <button
        class="tool-btn"
        :class="{ active: currentTool === 'pen' }"
        :title="$t('sheets.pen')"
        @click="$emit('update:tool', 'pen')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 15.232l2.536 2.536m0-2.536l-2.536 2.536m2.536-2.536l-8.464 8.464m-2.536 2.536l8.464-8.464m-5.928 0l5.928 5.928"
          />
        </svg>
      </button>
      <button
        class="tool-btn"
        :class="{ active: currentTool === 'eraser' }"
        :title="$t('sheets.eraser')"
        @click="$emit('update:tool', 'eraser')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </button>
    </div>

    <!-- Color picker -->
    <div class="toolbar-section">
      <input
        type="color"
        class="color-picker"
        :value="currentColor"
        :title="$t('sheets.color')"
        @input="$emit('update:color', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- Line width -->
    <div class="toolbar-section line-width-section">
      <label class="line-width-label">{{ lineWidth }}px</label>
      <input
        type="range"
        class="line-width-slider"
        min="1"
        max="20"
        :value="lineWidth"
        :title="$t('sheets.lineWidth')"
        @input="$emit('update:lineWidth', parseInt(($event.target as HTMLInputElement).value))"
      />
    </div>

    <!-- Clear button -->
    <div class="toolbar-section">
      <button class="tool-btn clear-btn" :title="$t('sheets.clear')" @click="$emit('clear')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M5 7h14"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DrawingTool } from '@/types';

interface Props {
  currentColor: string;
  currentTool: DrawingTool;
  lineWidth: number;
  canUndo: boolean;
  canRedo: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:color': [color: string];
  'update:tool': [tool: DrawingTool];
  'update:lineWidth': [lineWidth: number];
  clear: [];
  undo: [];
  redo: [];
}>();
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #1f2937;
  border-radius: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #374151;
  border: none;
  border-radius: 0.375rem;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover:not(:disabled) {
  background: #4b5563;
  color: #f3f4f6;
}

.tool-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tool-btn.active {
  background: #3b82f6;
  color: #f3f4f6;
}

.clear-btn:hover:not(:disabled) {
  background: #dc2626;
  color: #f3f4f6;
}

.color-picker {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  background: transparent;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 0.375rem;
}

.line-width-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.line-width-label {
  color: #9ca3af;
  font-size: 0.75rem;
  min-width: 2rem;
  text-align: center;
}

.line-width-slider {
  width: 80px;
  height: 0.5rem;
  border-radius: 0.25rem;
  background: #4b5563;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.line-width-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

@media (max-width: 640px) {
  .toolbar {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .tool-btn {
    width: 2rem;
    height: 2rem;
  }

  .color-picker {
    width: 2rem;
    height: 2rem;
  }

  .line-width-slider {
    width: 60px;
  }
}
</style>
