<template>
  <div class="area-item">
    <div class="area-content">
      <div v-if="!isEditing && !isEditingColor" class="area-info">
        <div class="area-label" @click.stop="startEditing">{{ area.label }}</div>
        <div class="area-count">{{ diceCount }} dice</div>
      </div>
      <BaseInput
        v-else-if="isEditing && !isEditingColor"
        ref="editInput"
        v-model="editedLabel"
        type="text"
        class="area-input"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @click.stop
      />
      <div v-else-if="isEditingColor" class="color-editor">
        <BaseColorPicker v-model="editingColor" label="Area Color" />
      </div>
    </div>

    <div class="area-actions">
      <button
        class="btn-color"
        :style="{ backgroundColor: area.color || '#3b82f6' }"
        :title="area.color || '#3b82f6'"
        @click.stop="startEditingColor"
        aria-label="Edit area color"
      />
      <BaseButton variant="danger" class="btn-delete-area" @click.stop="handleDelete">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import BaseButton from './base/BaseButton.vue';
import BaseInput from './base/BaseInput.vue';
import BaseColorPicker from './base/BaseColorPicker.vue';
import type { ParkingArea } from '@/types';
import { useDiceStore } from '@/stores/dice';
import { useAreasStore } from '@/stores/areas';
import { useToastStore } from '@/stores/toast';
import { isAreaNameUnique } from '@/utils/areas';

interface Props {
  area: ParkingArea;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  delete: [areaId: string];
}>();

const diceStore = useDiceStore();
const areasStore = useAreasStore();
const toastStore = useToastStore();

const isEditing = ref(false);
const isEditingColor = ref(false);
const editedLabel = ref('');
const editingColor = ref('');
const editInput = ref<HTMLInputElement | null>(null);

const diceCount = computed(() => diceStore.diceInArea(props.area.id).length);

// Watch for color changes and update the store
watch(editingColor, (newColor) => {
  if (isEditingColor.value && newColor) {
    areasStore.updateAreaColor(props.area.id, newColor);
  }
});

const startEditing = async () => {
  isEditing.value = true;
  isEditingColor.value = false;
  editedLabel.value = props.area.label;
  await nextTick();
  editInput.value?.focus();
  editInput.value?.select();
};

const startEditingColor = async () => {
  isEditingColor.value = !isEditingColor.value;
  isEditing.value = false;
  if (isEditingColor.value) {
    editingColor.value = props.area.color || '#3b82f6';
  }
};

const saveEdit = () => {
  const trimmedLabel = editedLabel.value.trim();

  if (!trimmedLabel) {
    toastStore.show('Area name cannot be empty');
    cancelEdit();
    return;
  }

  if (!isAreaNameUnique(areasStore.areas, trimmedLabel, props.area.id)) {
    toastStore.show('Area name already exists');
    cancelEdit();
    return;
  }

  if (trimmedLabel !== props.area.label) {
    areasStore.updateArea(props.area.id, trimmedLabel);
    toastStore.show('Area renamed');
  }

  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  editedLabel.value = '';
};

const handleDelete = () => {
  emit('delete', props.area.id);
};
</script>

<style scoped>
.area-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #374151;
  border-radius: 0.5rem;
  transition: all 0.2s;
  min-height: 3.5rem;
  gap: 0.5rem;
}

.area-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  min-width: 0;
}

.area-content:hover {
  opacity: 0.9;
}

.area-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.area-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f3f4f6;
  cursor: text;
  padding: 0.125rem;
  border-radius: 0.25rem;
  transition: background 0.2s;
}

.area-label:hover {
  background: rgba(59, 130, 246, 0.1);
}

.area-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.area-input {
  width: 100%;
}

.color-editor {
  padding: 0.75rem 0;
}

.area-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-color {
  width: 2rem;
  height: 2rem;
  border: 2px solid #4b5563;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-color:hover {
  border-color: #60a5fa;
  transform: scale(1.05);
}

.btn-color:active {
  transform: scale(0.95);
}

.btn-delete-area {
  width: 2rem;
  height: 2rem;
  padding: 0;
  flex-shrink: 0;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}
</style>
