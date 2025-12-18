<template>
  <div class="area-item">
    <div class="area-content" @click="!isEditing && handleAssignClick()">
      <div v-if="!isEditing" class="area-info">
        <div class="area-label" @click.stop="startEditing">{{ area.label }}</div>
        <div class="area-count">{{ diceCount }} dice</div>
      </div>
      <input
        v-else
        ref="editInput"
        v-model="editedLabel"
        type="text"
        class="area-input"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @click.stop
      />
    </div>
    <button class="btn-delete" @click.stop="handleDelete">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
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
  assign: [areaId: string];
  delete: [areaId: string];
}>();

const diceStore = useDiceStore();
const areasStore = useAreasStore();
const toastStore = useToastStore();

const isEditing = ref(false);
const editedLabel = ref('');
const editInput = ref<HTMLInputElement | null>(null);

const diceCount = computed(() => diceStore.diceInArea(props.area.id).length);

const handleAssignClick = () => {
  emit('assign', props.area.id);
};

const startEditing = async () => {
  isEditing.value = true;
  editedLabel.value = props.area.label;
  await nextTick();
  editInput.value?.focus();
  editInput.value?.select();
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
  align-items: center;
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
  padding: 0.375rem 0.5rem;
  background: #1f2937;
  border: 2px solid #3b82f6;
  border-radius: 0.375rem;
  color: #f3f4f6;
  font-size: 0.875rem;
  font-weight: 600;
  outline: none;
}

.btn-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
}

.btn-delete:active {
  transform: scale(0.95);
}
</style>
