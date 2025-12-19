<template>
  <div class="base-color-picker">
    <label v-if="label" class="base-color-picker__label">{{ label }}</label>
    <div class="base-color-picker__wrapper">
      <div
        class="base-color-picker__grid"
        @mouseleave="handleMouseLeave"
        @mouseup="handleMouseLeave"
      >
        <button
          v-for="color in presetColors"
          :key="color"
          :style="{ backgroundColor: DICE_COLORS[color] }"
          :class="[
            'base-color-picker__btn',
            { 'base-color-picker__btn--active': !useCustomColor && selectedPresetColor === color },
          ]"
          :aria-label="`Select ${color}`"
          @mousedown="handlePresetColorMouseDown(color)"
          @mouseenter="handlePresetColorMouseEnter(color)"
          @mouseup="handlePresetColorMouseUp(color)"
          :title="color"
        />
        <div class="base-color-picker__custom-wrapper">
          <label class="base-color-picker__custom-label">Custom</label>
          <input
            v-model="localCustomColor"
            type="color"
            class="base-color-picker__custom-input"
            :class="{ 'base-color-picker__custom-input--active': useCustomColor }"
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
  presetColors?: PresetDiceColor[];
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  presetColors: () => ['white', 'red', 'blue', 'green', 'yellow', 'orange'],
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const selectedPresetColor = ref<PresetDiceColor | null>(null);
const localCustomColor = ref<string>('#3b82f6');
const useCustomColor = ref<boolean>(false);
const isMouseDown = ref<boolean>(false);

// Initialize based on modelValue
const initializeColor = () => {
  const preset = props.presetColors.find((c) => DICE_COLORS[c] === props.modelValue);
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
.base-color-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-color-picker__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.base-color-picker__wrapper {
  display: flex;
  align-items: center;
}

.base-color-picker__grid {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.base-color-picker__btn {
  width: 2rem;
  height: 2rem;
  border: 2px solid transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: var(--transition-default);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  padding: 0;
  background-size: 100% 100%;
}

.base-color-picker__btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.base-color-picker__btn:active {
  transform: scale(0.95);
}

.base-color-picker__btn--active {
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}

.base-color-picker__custom-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.25rem 0.375rem;
  background: var(--color-bg-darker);
  border-radius: 0.375rem;
  border: 2px solid var(--color-border);
  flex-shrink: 0;
  transition: var(--transition-default);
}

.base-color-picker__custom-wrapper:hover {
  border-color: var(--color-accent-blue);
}

.base-color-picker__custom-label {
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--color-text-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.base-color-picker__custom-input {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: var(--transition-default);
  padding: 0;
  background: transparent;
}

.base-color-picker__custom-input:hover {
  filter: brightness(1.1);
}

.base-color-picker__custom-input--active {
  box-shadow: inset 0 0 0 2px var(--color-accent-blue);
}
</style>
