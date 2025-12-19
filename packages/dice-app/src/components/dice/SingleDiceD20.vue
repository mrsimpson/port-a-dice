<template>
  <div class="dice-container">
    <div
      :class="['dice-wrapper', { rolling: isRolling, parked: !!parkingAreaLabel }]"
      :style="{ '--parking-color': parkingAreaColor } as any"
      @click="handleClick"
    >
      <div class="dice-scene">
        <div :class="['d20-dice', { 'is-rolling': isRolling }]" :style="rollTransform">
          <div class="d20-value" :style="{ backgroundColor: diceColor }">
            {{ currentValue }}
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
const rollRotation = ref({ x: 0, y: 0, z: 0 });

const diceColor = computed(() => {
  return DICE_COLORS[props.dice.color as PresetDiceColor] || props.dice.color;
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

const rollTransform = computed(() => {
  if (isRolling.value) {
    return {
      transform: `rotate(${rollRotation.value.z}deg) scale(0.8)`,
    };
  }
  return undefined;
});

const startRoll = () => {
  const newValue = props.dice.value;
  isRolling.value = true;

  const randomZ = Math.random() * 720 + 1080;

  rollRotation.value = { x: 0, y: 0, z: randomZ };

  setTimeout(() => {
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
    }
  }
);

onMounted(() => {
  currentValue.value = props.dice.value;
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
  transition: none;
  border: 3px solid transparent;
  border-radius: 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  position: relative;
  padding: 10px;
  will-change: transform;
  overflow: visible;
}

.dice-wrapper.parked {
  background: var(--parking-color, #3b82f6);
  border-radius: 0.375rem;
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

.dice-scene {
  width: 100%;
  height: 100%;
  perspective: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.d20-dice {
  position: relative;
  width: 80px;
  height: 80px;
  transition: none;
}

.d20-dice.is-rolling {
  transition: transform 1s ease-out;
}

.d20-value {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(31, 41, 55, 0.4);
}

.dice-wrapper.rolling .d20-dice {
  animation: none;
}

@media (min-width: 640px) {
  .dice-wrapper {
    width: 140px;
    height: 140px;
  }

  .parking-panel {
    width: 140px;
  }

  .d20-dice {
    width: 100px;
    height: 100px;
  }

  .d20-value {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }
}

@media (min-width: 768px) {
  .dice-wrapper {
    width: 160px;
    height: 160px;
  }

  .parking-panel {
    width: 160px;
  }

  .d20-dice {
    width: 120px;
    height: 120px;
  }

  .d20-value {
    width: 120px;
    height: 120px;
    font-size: 3.5rem;
  }
}
</style>
