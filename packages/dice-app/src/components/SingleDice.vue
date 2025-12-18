<template>
  <div class="dice-container">
    <div :class="['dice-wrapper', { rolling: isRolling }]" @click="handleClick">
      <div class="dice-scene">
        <div
          ref="diceRef"
          :class="['dice', `show-${currentValue}`, { 'is-rolling': isRolling }]"
          :style="rollTransform"
        >
          <div class="dice-face face-1" :style="{ backgroundColor: diceColor }">
            <span class="dot"></span>
          </div>
          <div class="dice-face face-2" :style="{ backgroundColor: diceColor }">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="dice-face face-3" :style="{ backgroundColor: diceColor }">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="dice-face face-4" :style="{ backgroundColor: diceColor }">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="dice-face face-5" :style="{ backgroundColor: diceColor }">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="dice-face face-6" :style="{ backgroundColor: diceColor }">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="parkingAreaLabel" class="parking-panel">
      {{ parkingAreaLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import type { Dice } from '@/types';
import { useDiceStore } from '@/stores/dice';
import { useAreasStore } from '@/stores/areas';
import { DICE_COLORS, type PresetDiceColor } from '@/types';

const props = defineProps<{
  dice: Dice;
}>();

const emit = defineEmits<{
  click: [id: string];
}>();

const diceStore = useDiceStore();
const areasStore = useAreasStore();
const diceRef = ref<HTMLElement | null>(null);
const isRolling = ref(false);
const currentValue = ref(props.dice.value);
const rollRotation = ref({ x: 0, y: 0, z: 0 });

const diceColor = computed(() => {
  return DICE_COLORS[props.dice.color as PresetDiceColor] || props.dice.color;
});

const parkingAreaLabel = computed(() => {
  if (!props.dice.areaId) return null;
  const area = areasStore.getAreaById(props.dice.areaId);
  return area?.label || null;
});

const rollTransform = computed(() => {
  if (isRolling.value) {
    return {
      transform: `rotateX(${rollRotation.value.x}deg) rotateY(${rollRotation.value.y}deg) rotateZ(${rollRotation.value.z}deg)`,
    };
  }
  return undefined;
});

const startRoll = () => {
  const newValue = props.dice.value;
  console.log(
    '[SingleDice] startRoll() called for dice:',
    props.dice.id.substring(0, 8),
    'new value:',
    newValue
  );
  isRolling.value = true;
  console.log('[SingleDice] Set isRolling = true, applying animation');

  const randomX = Math.random() * 720 + 1080;
  const randomY = Math.random() * 720 + 1080;
  const randomZ = Math.random() * 360;

  rollRotation.value = { x: randomX, y: randomY, z: randomZ };
  console.log('[SingleDice] Set rollRotation:', { x: randomX, y: randomY, z: randomZ });

  setTimeout(() => {
    console.log(
      '[SingleDice] Animation complete (1000ms), updating currentValue from',
      currentValue.value,
      'to',
      newValue
    );
    currentValue.value = newValue;
    isRolling.value = false;
  }, 1000);
};

const handleClick = () => {
  emit('click', props.dice.id);
};

watch(
  () => props.dice.value,
  (newValue, oldValue) => {
    const diceId = props.dice.id.substring(0, 8);
    console.log(
      `[SingleDice] Die ${diceId}: Value changed from ${oldValue} to ${newValue}, isRolling: ${diceStore.isRolling}`
    );
    if (newValue !== oldValue) {
      startRoll();
    }
  },
  { immediate: false }
);

// IMPORTANT: Also watch diceStore.isRolling to animate ALL dice, even if value doesn't change
watch(
  () => diceStore.isRolling,
  (newIsRolling) => {
    const diceId = props.dice.id.substring(0, 8);
    // Only animate if this die is UNPARKED (areaId === null)
    if (newIsRolling && !isRolling.value && props.dice.areaId === null) {
      console.log(
        `[SingleDice] Die ${diceId}: Triggered by isRolling=true (value=${props.dice.value}, areaId=${props.dice.areaId})`
      );
      startRoll();
    }
  }
);

watch(
  () => props.dice.color,
  () => {
    if (!isRolling.value) {
      currentValue.value = props.dice.value;
    }
  }
);

onMounted(() => {
  const diceId = props.dice.id.substring(0, 8);
  console.log(`[SingleDice] Mounted: Die ${diceId}, initial value: ${props.dice.value}`);
  currentValue.value = props.dice.value;
});
</script>

<style scoped>
.dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.dice-wrapper {
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
  border-radius: 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  position: relative;
  padding: 10px;
}

.parking-panel {
  background: #3b82f6;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dice-wrapper:hover {
  background: rgba(55, 65, 81, 0.7);
  transform: scale(1.05);
}

.dice-wrapper:active {
  transform: scale(0.95);
}

.dice-scene {
  width: 100%;
  height: 100%;
  perspective: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice {
  position: relative;
  width: 80px;
  height: 80px;
  transform-style: preserve-3d;
  transition: none;
}

.dice.is-rolling {
  transition: transform 1s ease-out;
}

.dice-face {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: grid;
  padding: 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.face-1 {
  transform: rotateY(0deg) translateZ(40px);
  grid-template: 1fr / 1fr;
  place-items: center;
}

.face-2 {
  transform: rotateY(90deg) translateZ(40px);
  grid-template: 1fr 1fr / 1fr;
  place-items: center;
}

.face-2 .dot:first-child {
  justify-self: end;
  align-self: start;
}
.face-2 .dot:last-child {
  justify-self: start;
  align-self: end;
}

.face-3 {
  transform: rotateY(180deg) translateZ(40px);
  grid-template: 1fr 1fr 1fr / 1fr;
  place-items: center;
}

.face-3 .dot:nth-child(1) {
  justify-self: end;
  align-self: start;
}
.face-3 .dot:nth-child(3) {
  justify-self: start;
  align-self: end;
}

.face-4 {
  transform: rotateY(-90deg) translateZ(40px);
  grid-template: 1fr 1fr / 1fr 1fr;
  place-items: center;
}

.face-5 {
  transform: rotateX(90deg) translateZ(40px);
  grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr;
  place-items: center;
}

.face-5 .dot:nth-child(1) {
  grid-column: 1;
  grid-row: 1;
}
.face-5 .dot:nth-child(2) {
  grid-column: 3;
  grid-row: 1;
}
.face-5 .dot:nth-child(3) {
  grid-column: 2;
  grid-row: 2;
}
.face-5 .dot:nth-child(4) {
  grid-column: 1;
  grid-row: 3;
}
.face-5 .dot:nth-child(5) {
  grid-column: 3;
  grid-row: 3;
}

.face-6 {
  transform: rotateX(-90deg) translateZ(40px);
  grid-template: 1fr 1fr 1fr / 1fr 1fr;
  place-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.show-1 {
  transform: rotateY(0deg) rotateX(0deg);
}
.show-2 {
  transform: rotateY(-90deg) rotateX(0deg);
}
.show-3 {
  transform: rotateY(180deg) rotateX(0deg);
}
.show-4 {
  transform: rotateY(90deg) rotateX(0deg);
}
.show-5 {
  transform: rotateX(-90deg) rotateY(0deg);
}
.show-6 {
  transform: rotateX(90deg) rotateY(0deg);
}

.dice-wrapper.rolling .dice {
  animation: none;
}

@media (min-width: 640px) {
  .dice-wrapper {
    width: 140px;
    height: 140px;
  }

  .dice {
    width: 100px;
    height: 100px;
  }

  .dice-face {
    width: 100px;
    height: 100px;
  }

  .face-1 {
    transform: rotateY(0deg) translateZ(50px);
  }
  .face-2 {
    transform: rotateY(90deg) translateZ(50px);
  }
  .face-3 {
    transform: rotateY(180deg) translateZ(50px);
  }
  .face-4 {
    transform: rotateY(-90deg) translateZ(50px);
  }
  .face-5 {
    transform: rotateX(90deg) translateZ(50px);
  }
  .face-6 {
    transform: rotateX(-90deg) translateZ(50px);
  }

  .dot {
    width: 14px;
    height: 14px;
  }
}

@media (min-width: 768px) {
  .dice-wrapper {
    width: 160px;
    height: 160px;
  }

  .dice {
    width: 120px;
    height: 120px;
  }

  .dice-face {
    width: 120px;
    height: 120px;
  }

  .face-1 {
    transform: rotateY(0deg) translateZ(60px);
  }
  .face-2 {
    transform: rotateY(90deg) translateZ(60px);
  }
  .face-3 {
    transform: rotateY(180deg) translateZ(60px);
  }
  .face-4 {
    transform: rotateY(-90deg) translateZ(60px);
  }
  .face-5 {
    transform: rotateX(90deg) translateZ(60px);
  }
  .face-6 {
    transform: rotateX(-90deg) translateZ(60px);
  }

  .dot {
    width: 16px;
    height: 16px;
  }
}
</style>
