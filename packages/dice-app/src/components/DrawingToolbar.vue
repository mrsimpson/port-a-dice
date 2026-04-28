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
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 3a2.83 2.83 0 114 4l-7 7-1.5 5.5 5.5-1.5 7-7a2.83 2.83 0 00-4-4z"
          />
        </svg>
      </button>
      <button
        class="tool-btn"
        :class="{ active: currentTool === 'eraser' }"
        :title="$t('sheets.eraser')"
        @click="$emit('update:tool', 'eraser')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 3H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM3 14h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z"
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

    <!-- Clear button (trash whole drawing) -->
    <div class="toolbar-section">
      <button class="tool-btn clear-btn" :title="$t('sheets.clear')" @click="$emit('clear')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6h16z"
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
