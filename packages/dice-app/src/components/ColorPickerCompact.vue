<template>
  <div class="color-picker-compact">
    <label class="section-label">{{ label }}</label>
    <div class="color-picker-wrapper">
      <div class="color-grid-compact" @mouseleave="handleMouseLeave" @mouseup="handleMouseLeave">
        <button
          v-for="color in presetColors"
          :key="color"
          :style="{ backgroundColor: DICE_COLORS[color] }"
          :class="[
            'color-btn-compact',
            { active: !useCustomColor && selectedPresetColor === color },
          ]"
          :aria-label="`Select ${color}`"
          @mousedown="handlePresetColorMouseDown(color)"
          @mouseenter="handlePresetColorMouseEnter(color)"
          @mouseup="handlePresetColorMouseUp(color)"
          :title="color"
        />
        <div class="custom-color-btn-wrapper">
          <label class="custom-color-label-compact">Custom</label>
          <input
            v-model="localCustomColor"
            type="color"
            class="custom-color-btn-compact"
            :class="{ active: useCustomColor }"
            :aria-label="`Custom color: ${localCustomColor}`"
            @focus="handleCustomColorFocus"
            @input="handleCustomColorInput"
            :title="`Custom color: ${localCustomColor}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DICE_COLORS, type PresetDiceColor } from '@/types';

interface Props {
  modelValue: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Color',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const presetColors: PresetDiceColor[] = ['white', 'red', 'blue', 'green', 'yellow', 'orange'];

const selectedPresetColor = ref<PresetDiceColor | null>(null);
const localCustomColor = ref<string>('#3b82f6');
const useCustomColor = ref<boolean>(false);
const isMouseDown = ref<boolean>(false);

// Initialize based on modelValue
const initializeColor = () => {
  const preset = presetColors.find((c) => DICE_COLORS[c] === props.modelValue);
  if (preset) {
    selectedPresetColor.value = preset;
    useCustomColor.value = false;
  } else {
    localCustomColor.value = props.modelValue;
    useCustomColor.value = true;
  }
};

watch(() => props.modelValue, initializeColor, { immediate: true });

const handlePresetColorMouseDown = (color: PresetDiceColor) => {
  isMouseDown.value = true;
  selectedPresetColor.value = color;
  useCustomColor.value = false;
  emit('update:modelValue', DICE_COLORS[color]);
};

const handlePresetColorMouseEnter = (color: PresetDiceColor) => {
  if (isMouseDown.value) {
    selectedPresetColor.value = color;
    useCustomColor.value = false;
    emit('update:modelValue', DICE_COLORS[color]);
  }
};

const handlePresetColorMouseUp = (color: PresetDiceColor) => {
  isMouseDown.value = false;
  selectedPresetColor.value = color;
  useCustomColor.value = false;
  emit('update:modelValue', DICE_COLORS[color]);
};

const handleCustomColorFocus = () => {
  useCustomColor.value = true;
  selectedPresetColor.value = null;
};

const handleCustomColorInput = () => {
  useCustomColor.value = true;
  selectedPresetColor.value = null;
  emit('update:modelValue', localCustomColor.value);
};

const handleMouseLeave = () => {
  isMouseDown.value = false;
};
</script>

<style scoped>
.color-picker-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
}

.section-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #d1d5db;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Compact Color Grid */
.color-grid-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-btn-compact {
  width: 2rem;
  height: 2rem;
  border: 2px solid transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.color-btn-compact:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.color-btn-compact:active {
  transform: scale(0.95);
}

.color-btn-compact.active {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}

.custom-color-btn-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.25rem 0.375rem;
  background: #374151;
  border-radius: 0.375rem;
  border: 2px solid #4b5563;
  flex-shrink: 0;
  transition: all 0.2s;
}

.custom-color-btn-wrapper:hover {
  border-color: #60a5fa;
}

.custom-color-label-compact {
  font-size: 0.625rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.custom-color-btn-compact {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  background: transparent;
}

.custom-color-btn-compact:hover {
  filter: brightness(1.1);
}

.custom-color-btn-compact.active {
  box-shadow: inset 0 0 0 2px #60a5fa;
}
</style>
