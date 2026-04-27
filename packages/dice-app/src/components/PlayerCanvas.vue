<template>
  <div class="canvas-container" ref="containerRef">
    <canvas
      ref="canvasRef"
      class="drawing-canvas"
      @mousedown="startDrawing"
      @mousemove="handleCanvasMouseMove"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart.prevent="startDrawing"
      @touchmove.prevent="handleCanvasMouseMove"
      @touchend.prevent="stopDrawing"
      @touchcancel.prevent="stopDrawing"
    />
    <!-- Brush preview cursor -->
    <div ref="previewRef" class="brush-preview" />
  </div>
</template>

<script setup lang="ts">
/// <reference lib="dom" />

import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import type { SheetPath, DrawingTool, Point } from '@/types';

interface Props {
  paths: SheetPath[];
  backgroundImage: string | null;
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
const previewRef = ref<HTMLDivElement | null>(null);

const isDrawing = ref(false);
const currentPath = ref<Point[]>([]);
const paths = ref<SheetPath[]>([]);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

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

  const ratioX = (clientX - containerRect.left) / containerRect.width;
  const ratioY = (clientY - containerRect.top) / containerRect.height;

  const cssWidth = parseFloat(canvas.style.width) || containerRect.width;
  const cssHeight = parseFloat(canvas.style.height) || containerRect.height;

  return {
    x: ratioX * cssWidth,
    y: ratioY * cssHeight,
  };
}

function updatePreview(x: number, y: number) {
  const el = previewRef.value;
  if (!el) return;

  const size = Math.max(props.currentLineWidth * 2, 8);
  const fillColor =
    props.currentTool === 'eraser' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.3)';
  const strokeColor = 'rgba(255,255,255,0.7)';

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.backgroundColor = fillColor;
  el.style.borderColor = strokeColor;
  el.style.display = 'block';
}

function hidePreview() {
  const el = previewRef.value;
  if (el) el.style.display = 'none';
}

function startDrawing(event: MouseEvent | TouchEvent) {
  isDrawing.value = true;
  hidePreview();
  const point = getCanvasCoordinates(event);
  currentPath.value = [point];
}

function handleCanvasMouseMove(event: MouseEvent | TouchEvent) {
  const point = getCanvasCoordinates(event);
  updatePreview(point.x, point.y);

  if (!isDrawing.value) return;

  currentPath.value.push(point);

  // Full redraw: background + saved paths
  renderCanvas();

  // Draw current segment on top
  if (currentPath.value.length >= 2) {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

function stopDrawing() {
  if (!isDrawing.value) return;

  isDrawing.value = false;

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

function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background if available and loaded
  if (props.backgroundImage && backgroundImg) {
    if (backgroundImg.complete && backgroundImg.naturalWidth > 0) {
      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }
  }

  // Draw all saved paths
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

// Shared image element for background loading

let backgroundImg: Image | null = null;

function handleResize() {
  nextTick(() => {
    const canvas = canvasRef.value;
    const container = containerRef.value;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    renderCanvas();
  });
}

watch(
  () => props.paths,
  (newPaths) => {
    paths.value = [...newPaths];
    renderCanvas();
  },
  { deep: true, immediate: true }
);

watch(
  () => [props.currentColor, props.currentTool, props.currentLineWidth],
  () => {
    renderCanvas();
  }
);

watch(
  () => props.backgroundImage,
  () => {
    if (props.backgroundImage) {
      const img = new Image();
      img.src = props.backgroundImage;
      backgroundImg = img;
    } else {
      backgroundImg = null;
    }
    renderCanvas();
  }
);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  handleResize();

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
  position: relative;
}

.drawing-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: none;
}

.brush-preview {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
  pointer-events: none;
  z-index: 10;
  display: none;
  transform: translate(-50%, -50%);
}
</style>
