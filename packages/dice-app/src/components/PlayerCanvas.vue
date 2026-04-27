<template>
  <div class="canvas-container" ref="containerRef">
    <canvas
      ref="canvasRef"
      class="drawing-canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart.prevent="startDrawing"
      @touchmove.prevent="draw"
      @touchend.prevent="stopDrawing"
      @touchcancel.prevent="stopDrawing"
    />
  </div>
</template>

<script setup lang="ts">
/// <reference lib="dom" />

import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import type { SheetPath, DrawingTool, Point } from '@/types';

interface Props {
  paths: SheetPath[];
  backgroundImage: string | null;
  /** Drawing settings from toolbar */
  currentColor?: string;
  currentTool?: DrawingTool;
  currentLineWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentColor: '#ffffff',
  currentTool: 'pen',
  currentLineWidth: 3,
});

const emit = defineEmits<{
  'update:paths': [paths: SheetPath[]];
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const isDrawing = ref(false);
const currentPath = ref<Point[]>([]);
const paths = ref<SheetPath[]>([]);

// Generate unique ID for paths
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Get canvas coordinates from mouse/touch event
// Uses container rect for reliable coordinate calculation
function getCanvasCoordinates(event: MouseEvent | TouchEvent): Point {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return { x: 0, y: 0 };

  const containerRect = container.getBoundingClientRect();
  let clientX: number, clientY: number;

  if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
    const touch = event.touches[0] || event.changedTouches[0];
    clientX = touch?.clientX || 0;
    clientY = touch?.clientY || 0;
  } else {
    clientX = (event as MouseEvent).clientX;
    clientY = (event as MouseEvent).clientY;
  }

  // Calculate position as ratio of container, then map to canvas CSS dimensions
  // This avoids coordinate offset issues with DPR scaling
  const ratioX = (clientX - containerRect.left) / containerRect.width;
  const ratioY = (clientY - containerRect.top) / containerRect.height;

  const cssWidth = parseFloat(canvas.style.width) || containerRect.width;
  const cssHeight = parseFloat(canvas.style.height) || containerRect.height;

  // Store coordinates in CSS pixels (0 to cssWidth/cssHeight)
  return {
    x: ratioX * cssWidth,
    y: ratioY * cssHeight,
  };
}

// Start drawing
function startDrawing(event: MouseEvent | TouchEvent) {
  isDrawing.value = true;
  const point = getCanvasCoordinates(event);
  currentPath.value = [point];
}

// Continue drawing
function draw(event: MouseEvent | TouchEvent) {
  if (!isDrawing.value) return;

  const point = getCanvasCoordinates(event);
  currentPath.value.push(point);

  // Render the current stroke in real-time
  renderCanvas();

  // Draw the current path segment
  if (currentPath.value.length >= 2) {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Context is already scaled by DPR, so we draw in CSS pixels
    const effectiveColor = props.currentTool === 'eraser' ? '#1f2937' : props.currentColor;

    ctx.beginPath();
    ctx.strokeStyle = effectiveColor;
    ctx.lineWidth = props.currentLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const lastIndex = currentPath.value.length - 1;
    ctx.moveTo(currentPath.value[lastIndex - 1].x, currentPath.value[lastIndex - 1].y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }
}

// Stop drawing and save the path
function stopDrawing() {
  if (!isDrawing.value) return;

  isDrawing.value = false;

  // Only save if we have at least 2 points
  if (currentPath.value.length >= 2) {
    const effectiveColor = props.currentTool === 'eraser' ? '#1f2937' : props.currentColor;

    const newPath: SheetPath = {
      id: generateId(),
      points: [...currentPath.value],
      color: effectiveColor,
      lineWidth: props.currentLineWidth,
      tool: props.currentTool,
    };

    paths.value = [...paths.value, newPath];
    emit('update:paths', paths.value);
  }

  currentPath.value = [];
}

// Render all paths on canvas
// Coordinates are stored in CSS pixels; context is DPR-scaled, so we draw directly
function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background image if set
  if (props.backgroundImage) {
    const img = new Image();
    img.src = props.backgroundImage;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // Draw all saved paths in CSS pixels (context is DPR-scaled)
  paths.value.forEach((path) => {
    if (path.points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(path.points[0].x, path.points[0].y);
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }
    ctx.stroke();
  });
}

// Resize handler
function handleResize() {
  nextTick(() => {
    const canvas = canvasRef.value;
    const container = containerRef.value;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    renderCanvas();
  });
}

// Watch for path changes from props
watch(
  () => props.paths,
  (newPaths) => {
    paths.value = [...newPaths];
    renderCanvas();
  },
  { deep: true, immediate: true }
);

// Watch for drawing setting changes
watch(
  () => [props.currentColor, props.currentTool, props.currentLineWidth],
  () => {
    renderCanvas();
  }
);

// Watch for background image changes
watch(
  () => props.backgroundImage,
  () => {
    renderCanvas();
  }
);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  handleResize();

  // Use ResizeObserver for responsive canvas
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  background: #1f2937;
  border-radius: 0.5rem;
  overflow: hidden;
}

.drawing-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: crosshair;
}
</style>
