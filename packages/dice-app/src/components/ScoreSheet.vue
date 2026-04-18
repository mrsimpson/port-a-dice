<template>
  <DrawerWrapper
    :title="$t('panels.score-sheet')"
    :is-open="uiStore.showScoreSheet"
    @close="uiStore.closeScoreSheet"
  >
    <!-- Toolbar -->
    <template #header>
      <div class="toolbar">
        <button
          class="tool-btn"
          :class="{ active: scoreSheetStore.currentTool === 'pen' }"
          @click="scoreSheetStore.setTool('pen')"
          :title="$t('tools.pen')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          class="tool-btn"
          :class="{ active: scoreSheetStore.currentTool === 'eraser' }"
          @click="scoreSheetStore.setTool('eraser')"
          :title="$t('tools.eraser')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
        <button class="tool-btn" @click="scoreSheetStore.clearCanvas" :title="$t('tools.clear')">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </template>

    <!-- Canvas Area -->
    <div class="canvas-container">
      <canvas
        ref="canvasRef"
        class="score-canvas"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      ></canvas>
    </div>

    <!-- Footer -->
    <template #footer>
      <BaseButton variant="primary" block @click="uiStore.closeScoreSheet">
        {{ $t('buttons.close') }}
      </BaseButton>
    </template>
  </DrawerWrapper>
</template>

<script setup lang="ts">
import BaseButton from './base/BaseButton.vue';
import DrawerWrapper from './DrawerWrapper.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useScoreSheetStore } from '@/stores/scoreSheet';

const uiStore = useUIStore();
const scoreSheetStore = useScoreSheetStore();
const canvasRef = ref<InstanceType<typeof HTMLCanvasElement> | null>(null);

// Mouse event handlers
const handleMouseDown = (e: globalThis.MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  scoreSheetStore.startDrawing(x, y);
};

const handleMouseMove = (e: globalThis.MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  scoreSheetStore.drawPoint(x, y);
  draw();
};

const handleMouseUp = () => {
  scoreSheetStore.endDrawing();
};

// Touch event handlers
const handleTouchStart = (e: globalThis.TouchEvent) => {
  e.preventDefault();
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  scoreSheetStore.startDrawing(x, y);
};

const handleTouchMove = (e: globalThis.TouchEvent) => {
  e.preventDefault();
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  scoreSheetStore.drawPoint(x, y);
  draw();
};

const handleTouchEnd = () => {
  scoreSheetStore.endDrawing();
};

// Canvas drawing functions
const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all paths
  scoreSheetStore.paths.forEach((path) => {
    ctx.beginPath();
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (path.points.length > 0) {
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
    }
    ctx.stroke();
  });

  // Draw current path
  if (scoreSheetStore.currentPath.length > 0) {
    ctx.beginPath();
    const currentColor =
      scoreSheetStore.currentTool === 'pen'
        ? scoreSheetStore.penColor
        : scoreSheetStore.eraserColor;
    const currentWidth =
      scoreSheetStore.currentTool === 'pen'
        ? scoreSheetStore.currentLineWidth
        : scoreSheetStore.eraserLineWidth;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(scoreSheetStore.currentPath[0].x, scoreSheetStore.currentPath[0].y);
    for (let i = 1; i < scoreSheetStore.currentPath.length; i++) {
      ctx.lineTo(scoreSheetStore.currentPath[i].x, scoreSheetStore.currentPath[i].y);
    }
    ctx.stroke();
  }
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const parent = canvas.parentElement;
  if (!parent) return;

  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
  draw();
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  // Redraw when store changes
  draw();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #374151;
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
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: #4b5563;
  color: #f3f4f6;
}

.tool-btn.active {
  background: #3b82f6;
  color: #ffffff;
}

.canvas-container {
  flex: 1;
  overflow: hidden;
  background: #111827;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.score-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: crosshair;
}
</style>
