<template>
  <div class="dice-container">
    <div
      :class="['dice-wrapper', { rolling: isRolling, parked: !!parkingAreaLabel }]"
      :style="{ '--parking-color': parkingAreaColor, '--dice-color': diceColor } as any"
      @click="handleClick"
    >
      <div class="dice-type-label">D10</div>
      <div class="dice-face">
        <div class="dice-shape">
          <svg viewBox="0 0 100 100" class="dice-polygon">
            <polygon points="50,8 80,25 90,50 80,75 50,92 20,75 10,50 20,25" :fill="diceColor" />
          </svg>
          <div class="dice-value-container">
            <div class="dice-value" :style="{ color: textColor }">
              {{ displayValue }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="parkingAreaLabel"
        class="parking-panel"
        :style="{ backgroundColor: parkingAreaColor }"
      >
        {{ parkingAreaLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
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
const isRolling = ref(false);
const currentValue = ref(props.dice.value);
const displayValue = ref(props.dice.value);

const diceColor = computed(() => {
  return DICE_COLORS[props.dice.color as PresetDiceColor] || props.dice.color;
});

const textColor = computed(() => {
  const color = diceColor.value;
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#1f2937' : '#ffffff';
});

const parkingAreaLabel = computed(() => {
  if (!props.dice.areaId) return null;
  const area = areasStore.getAreaById(props.dice.areaId);
  return area?.label || null;
});

const parkingAreaColor = computed(() => {
  if (!props.dice.areaId) return '#3b82f6';
  const area = areasStore.getAreaById(props.dice.areaId);
  return area?.color || '#3b82f6';
});

const startRoll = () => {
  const newValue = props.dice.value;
  isRolling.value = true;

  let count = 0;
  const maxCount = 20;
  const interval = setInterval(() => {
    displayValue.value = Math.floor(Math.random() * 10) + 1;
    count++;

    if (count >= maxCount) {
      clearInterval(interval);
      displayValue.value = newValue;
      currentValue.value = newValue;
      isRolling.value = false;
    }
  }, 50);
};

const handleClick = () => {
  emit('click', props.dice.id);
};

watch(
  () => props.dice.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      startRoll();
    }
  },
  { immediate: false }
);

watch(
  () => diceStore.isRolling,
  (newIsRolling) => {
    if (newIsRolling && !isRolling.value && props.dice.areaId === null) {
      startRoll();
    }
  }
);

watch(
  () => props.dice.color,
  () => {
    if (!isRolling.value) {
      currentValue.value = props.dice.value;
      displayValue.value = props.dice.value;
    }
  }
);

onMounted(() => {
  currentValue.value = props.dice.value;
  displayValue.value = props.dice.value;
});
</script>

<style scoped>
.dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  padding-bottom: 20px;
}

.dice-wrapper {
  width: 120px;
  height: 120px;
  cursor: pointer;
  border: 3px solid transparent;
  border-radius: 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.dice-wrapper.parked {
  background: var(--parking-color, #3b82f6);
  border-radius: 0.375rem;
}

.dice-type-label {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.625rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
  z-index: 10;
}

.parking-panel {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.375rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dice-wrapper:not(.parked):hover {
  background: rgba(55, 65, 81, 0.7);
  transform: scale(1.05);
}

.dice-wrapper:active {
  transform: scale(0.95);
}

.dice-face {
  width: 90px;
  height: 90px;
  position: relative;
}

.dice-shape {
  position: relative;
  width: 100%;
  height: 100%;
}

.dice-polygon {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.dice-value-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice-value {
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow:
    1px 1px 2px rgba(0, 0, 0, 0.3),
    -1px -1px 2px rgba(255, 255, 255, 0.2);
  pointer-events: none;
  line-height: 1;
}

@media (min-width: 640px) {
  .dice-wrapper {
    width: 140px;
    height: 140px;
  }

  .dice-type-label {
    font-size: 0.75rem;
    top: 6px;
  }

  .dice-face {
    width: 110px;
    height: 110px;
  }

  .dice-value-container {
    height: 3.5rem;
  }

  .dice-value {
    font-size: 3rem;
  }

  .parking-panel {
    width: 140px;
  }
}

@media (min-width: 768px) {
  .dice-wrapper {
    width: 160px;
    height: 160px;
  }

  .dice-type-label {
    font-size: 0.875rem;
    top: auto;
    left: auto;
    bottom: 4px;
    right: 4px;
  }

  .dice-face {
    width: 130px;
    height: 130px;
  }

  .dice-value-container {
    height: 4rem;
  }

  .dice-value {
    font-size: 3.5rem;
  }

  .parking-panel {
    width: 160px;
  }
}
</style>
