<template>
  <DrawerWrapper
    :title="$t('scoreSheet.title')"
    :is-open="uiStore.showScoreSheet"
    @close="uiStore.closeScoreSheet"
  >
    <!-- Drawing Toolbar -->
    <div class="toolbar">
      <!-- Color Picker (hidden when eraser is active) -->
      <div v-if="!eraserActive" class="toolbar-group">
        <label class="toolbar-label">{{ $t('scoreSheet.color') }}</label>
        <div class="color-picker">
          <button
            v-for="color in colors"
            :key="color"
            class="color-swatch"
            :class="{ active: selectedColor === color }"
            :style="{
              backgroundColor: color,
              borderColor: color === '#ffffff' ? '#6b7280' : 'transparent',
            }"
            :aria-label="color"
            @click="selectedColor = color"
          />
        </div>
      </div>

      <!-- Stroke Width -->
      <div class="toolbar-group">
        <label class="toolbar-label">{{ $t('scoreSheet.strokeWidth') }}</label>
        <div class="stroke-width-picker">
          <button
            v-for="width in strokeWidths"
            :key="width"
            class="stroke-option"
            :class="{ active: selectedStrokeWidth === width }"
            :aria-label="`${width}px`"
            @click="selectedStrokeWidth = width"
          >
            <span class="stroke-preview" :style="{ height: `${Math.min(width, 20)}px` }" />
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="toolbar-group toolbar-actions">
        <!-- Eraser toggle -->
        <button
          class="btn-tool"
          :class="{ active: eraserActive }"
          :aria-label="$t('scoreSheet.eraser')"
          @click="eraserActive = !eraserActive"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </button>

        <button
          class="btn-tool"
          :aria-label="$t('scoreSheet.undo')"
          :disabled="!canUndo"
          @click="handleUndo"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4"
            />
          </svg>
        </button>

        <button
          class="btn-tool"
          :aria-label="$t('scoreSheet.redo')"
          :disabled="!canRedo"
          @click="handleRedo"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4"
            />
          </svg>
        </button>

        <button class="btn-tool" :aria-label="$t('scoreSheet.clear')" @click="handleClear">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        <button
          class="btn-tool"
          :aria-label="$t('scoreSheet.export')"
          :disabled="!scoreSheetStore.hasDrawing"
          @click="handleExport"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Inline Clear Confirmation Banner -->
    <div v-if="showClearConfirm" class="clear-confirm-banner">
      <span>{{ $t('scoreSheet.clearConfirm') }}</span>
      <div class="clear-confirm-actions">
        <button class="btn-confirm-cancel" @click="showClearConfirm = false">
          {{ $t('buttons.cancel') }}
        </button>
        <button class="btn-confirm-delete" @click="confirmClear">
          {{ $t('scoreSheet.clear') }}
        </button>
      </div>
    </div>

    <!-- Canvas Container with Fixed Sheet Scaling -->
    <div
      ref="canvasContainerRef"
      class="canvas-container"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <!-- Reset zoom pill (visible only when zoom/pan is active) -->
      <button v-if="isZoomOrPanActive" class="reset-zoom-btn" @click="resetZoomAndPan">
        ↩ Reset zoom
      </button>

      <div
        class="fixed-sheet"
        :style="{
          transform: `scale(${scaleFactor * userZoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: 'center center',
        }"
      >
        <drawing-canvas
          ref="drawingCanvasRef"
          :width="800"
          :height="1200"
          :color="selectedColor"
          :line-width="selectedStrokeWidth"
          :eraser="eraserActive"
          :initial-image="scoreSheetStore.strokes"
          @update:image="onCanvasUpdate"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!scoreSheetStore.hasDrawing" class="empty-state">
      <p>{{ $t('scoreSheet.noDrawing') }}</p>
    </div>
  </DrawerWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import DrawingCanvas from 'vue-drawing-canvas';
import DrawerWrapper from './DrawerWrapper.vue';
import { useUIStore } from '@/stores/ui';
import { useScoreSheetStore, type Stroke } from '@/stores/scoresheet';

const uiStore = useUIStore();
const scoreSheetStore = useScoreSheetStore();

// Canvas refs
const drawingCanvasRef = ref<InstanceType<typeof DrawingCanvas> | null>(null);
const canvasContainerRef = ref<HTMLElement | null>(null);

// Drawing state
const selectedColor = ref('#000000'); // default black
const selectedStrokeWidth = ref(3);
const eraserActive = ref(false);
const canUndo = ref(false);
const canRedo = ref(false);
const showClearConfirm = ref(false);

// Fixed sheet scaling
const scaleFactor = ref(1);

// User-controlled zoom & pan
const userZoom = ref(1);
const panOffset = ref({ x: 0, y: 0 });

const isZoomOrPanActive = computed(
  () => userZoom.value !== 1 || panOffset.value.x !== 0 || panOffset.value.y !== 0
);

const resetZoomAndPan = () => {
  userZoom.value = 1;
  panOffset.value = { x: 0, y: 0 };
};

// Predefined colors for score sheet (black replaces white as first/default)
const colors = [
  '#000000', // Black (default)
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ffffff', // White (kept as option with visible border)
];

// Stroke width options
const strokeWidths = [1, 2, 3, 5, 8, 12];

// Internal canvas shape exposed by vue-drawing-canvas
interface LibCanvas {
  images: Stroke[];
  trash: Stroke[];
  save: () => void;
}

const getLibCanvas = (): LibCanvas | null => drawingCanvasRef.value as unknown as LibCanvas | null;

// Update undo/redo availability and persist the current stroke array + PNG
const syncState = (canvasData?: string) => {
  const lib = getLibCanvas();
  if (!lib) return;
  canUndo.value = lib.images.length > 0;
  canRedo.value = lib.trash.length > 0;
  if (canvasData !== undefined) {
    scoreSheetStore.updateStrokes([...lib.images], canvasData);
  }
};

// Keep for compatibility where we only need UI state refresh (no PNG yet)
const updateUndoRedoState = () => syncState();

// Calculate scale factor to fit the fixed 800x1200 sheet in the container
const calculateScale = () => {
  if (!canvasContainerRef.value) return;

  const container = canvasContainerRef.value;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Fixed sheet dimensions (portrait)
  const sheetWidth = 800;
  const sheetHeight = 1200;

  const scaleX = containerWidth / sheetWidth;
  const scaleY = containerHeight / sheetHeight;

  // On mobile (portrait, < 768 px wide): scale to fill width and allow vertical scrolling.
  // On desktop: fit both axes so the whole sheet is visible at once.
  if (containerWidth < 768) {
    scaleFactor.value = Math.min(scaleX, 1); // width-only, don't scale up beyond 1:1
  } else {
    scaleFactor.value = Math.min(scaleX, scaleY, 1); // fit both axes
  }
};

// ─── Pinch-to-zoom / two-finger-pan ────────────────────────────────────────

interface TouchState {
  active: boolean;
  startDist: number;
  startZoom: number;
  startMidX: number;
  startMidY: number;
  startPanX: number;
  startPanY: number;
}

const touchState: TouchState = {
  active: false,
  startDist: 0,
  startZoom: 1,
  startMidX: 0,
  startMidY: 0,
  startPanX: 0,
  startPanY: 0,
};

const getTouchDist = (a: Touch, b: Touch): number => {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
};

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length !== 2) {
    touchState.active = false;
    return;
  }
  const [t0, t1] = [e.touches[0], e.touches[1]];
  touchState.active = true;
  touchState.startDist = getTouchDist(t0, t1);
  touchState.startZoom = userZoom.value;
  touchState.startMidX = (t0.clientX + t1.clientX) / 2;
  touchState.startMidY = (t0.clientY + t1.clientY) / 2;
  touchState.startPanX = panOffset.value.x;
  touchState.startPanY = panOffset.value.y;
};

const onTouchMove = (e: TouchEvent) => {
  if (!touchState.active || e.touches.length !== 2) return;

  // Prevent page scroll and block single-touch drawing from firing
  e.preventDefault();

  const [t0, t1] = [e.touches[0], e.touches[1]];
  const currentDist = getTouchDist(t0, t1);

  // Zoom
  const rawZoom = touchState.startZoom * (currentDist / touchState.startDist);
  userZoom.value = Math.min(Math.max(rawZoom, 0.5), 4);

  // Pan (midpoint delta, scaled back so it feels 1:1 relative to the sheet)
  const midX = (t0.clientX + t1.clientX) / 2;
  const midY = (t0.clientY + t1.clientY) / 2;
  const effectiveScale = scaleFactor.value * userZoom.value;
  panOffset.value = {
    x: touchState.startPanX + (midX - touchState.startMidX) / effectiveScale,
    y: touchState.startPanY + (midY - touchState.startMidY) / effectiveScale,
  };
};

const onTouchEnd = (e: TouchEvent) => {
  if (e.touches.length < 2) {
    touchState.active = false;
  }
};

// ───────────────────────────────────────────────────────────────────────────

// ResizeObserver for responsive scaling
let resizeObserver: ResizeObserver | null = null;

// Called by vue-drawing-canvas after every stroke/undo/redo/redraw with the
// current flattened PNG. We use this to persist both the stroke array and the
// PNG (kept for export).
const onCanvasUpdate = (imageData: string) => {
  syncState(imageData);
};

// Undo/Redo handlers — the library emits @update:image after redraw,
// so onCanvasUpdate will persist the updated stroke array automatically.
const handleUndo = () => {
  drawingCanvasRef.value?.undo();
};

const handleRedo = () => {
  drawingCanvasRef.value?.redo();
};

// Clear handlers
const handleClear = () => {
  showClearConfirm.value = true;
};

const confirmClear = () => {
  drawingCanvasRef.value?.reset();
  scoreSheetStore.clearCanvas();
  showClearConfirm.value = false;
  canUndo.value = false;
  canRedo.value = false;
};

// Export handler
const handleExport = () => {
  scoreSheetStore.exportImage();
};

// Watch for drawer open/close to recalculate scale.
// Stroke restore is handled automatically via :initial-image on mount.
watch(
  () => uiStore.showScoreSheet,
  (isOpen) => {
    if (isOpen) {
      setTimeout(() => {
        calculateScale();
        updateUndoRedoState();
      }, 100);
    }
  }
);

onMounted(() => {
  // Set up ResizeObserver for responsive scaling
  if (canvasContainerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });
    resizeObserver.observe(canvasContainerRef.value);
  }

  // Initial scale calculation
  calculateScale();

  // Handle window resize and orientation change
  window.addEventListener('resize', calculateScale);
  window.addEventListener('orientationchange', calculateScale);
});

onUnmounted(() => {
  // Clean up observer and listeners
  if (resizeObserver && canvasContainerRef.value) {
    resizeObserver.unobserve(canvasContainerRef.value);
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', calculateScale);
  window.removeEventListener('orientationchange', calculateScale);
});
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #111827;
  border-bottom: 1px solid #374151;
  align-items: center;
}

.toolbar-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toolbar-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.color-picker {
  display: flex;
  gap: 0.375rem;
}

.color-swatch {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  border-color: #f3f4f6;
  box-shadow:
    0 0 0 2px #1f2937,
    0 0 0 4px currentColor;
}

.stroke-width-picker {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.stroke-option {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.stroke-option:hover {
  background: #374151;
}

.stroke-option.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.stroke-preview {
  width: 1.25rem;
  background: #f3f4f6;
  border-radius: 1px;
  min-height: 1px;
}

.toolbar-actions {
  flex-direction: row;
  margin-left: auto;
  gap: 0.5rem;
}

.btn-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #374151;
  border: none;
  border-radius: 0.5rem;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-tool:hover:not(:disabled) {
  background: #4b5563;
  color: #f3f4f6;
}

.btn-tool:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-tool:active:not(:disabled) {
  transform: scale(0.95);
}

.btn-tool.active {
  background: #3b82f6;
  color: #ffffff;
}

.btn-tool.active:hover {
  background: #2563eb;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

.clear-confirm-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  background: #7f1d1d;
  border-bottom: 1px solid #991b1b;
  color: #fecaca;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.clear-confirm-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-confirm-cancel {
  padding: 0.25rem 0.75rem;
  background: transparent;
  border: 1px solid #fca5a5;
  border-radius: 0.375rem;
  color: #fecaca;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-confirm-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-confirm-delete {
  padding: 0.25rem 0.75rem;
  background: #dc2626;
  border: none;
  border-radius: 0.375rem;
  color: #fff;
  font-size: 0.8125rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s;
}

.btn-confirm-delete:hover {
  background: #b91c1c;
}

.canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111827;
  padding: 1rem;
  /* Prevent browser from intercepting pinch-zoom gesture */
  touch-action: none;
  /* On mobile: allow vertical scrolling for the taller scaled sheet */
  overflow-x: hidden;
  overflow-y: auto;
  /* On desktop: clip content so the sheet doesn't overflow the panel */
  position: relative;
  min-height: 0;
}

@media (min-width: 768px) {
  .canvas-container {
    overflow: hidden;
  }
}

.reset-zoom-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  padding: 0.375rem 0.75rem;
  background: rgba(59, 130, 246, 0.85);
  border: none;
  border-radius: 9999px;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.15s;
}

.reset-zoom-btn:hover {
  background: rgba(37, 99, 235, 0.95);
}

.fixed-sheet {
  width: 800px;
  height: 1200px;
  position: relative;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  /* The transform scale is applied dynamically via :style binding */
  flex-shrink: 0;
}

.fixed-sheet > * {
  /* Ensure the canvas fills the fixed sheet */
  width: 100% !important;
  height: 100% !important;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  pointer-events: none;
}
</style>

<!-- Global styles for the drawing canvas to ensure it fills the fixed sheet -->
<style>
.fixed-sheet canvas {
  width: 100% !important;
  height: 100% !important;
  border-radius: 0.5rem;
  cursor: crosshair;
}
</style>
