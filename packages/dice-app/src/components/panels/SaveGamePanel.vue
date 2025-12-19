<template>
  <div class="save-game-panel">
    <div class="save-form">
      <div class="form-group">
        <label for="save-name" class="form-label">Game Name</label>
        <BaseInput
          id="save-name"
          v-model="saveName"
          type="text"
          placeholder="Enter a name for this game..."
          @keyup.enter="handleSave"
        />
      </div>

      <div class="form-group">
        <label for="save-description" class="form-label">Description (Optional)</label>
        <textarea
          id="save-description"
          v-model="saveDescription"
          class="save-description"
          placeholder="Add a description for this game..."
          rows="4"
        ></textarea>
      </div>

      <div class="form-info">
        <p>
          <strong>{{ diceCount }}</strong> dice
        </p>
        <p>
          <strong>{{ areaCount }}</strong> areas
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDiceStore } from '@/stores/dice';
import { useAreasStore } from '@/stores/areas';
import { storeToRefs } from 'pinia';
import BaseInput from '@/components/base/BaseInput.vue';

const diceStore = useDiceStore();
const areasStore = useAreasStore();

const { dice } = storeToRefs(diceStore);
const areas = computed(() => areasStore.areas);

const saveName = ref<string>('');
const saveDescription = ref<string>('');

const diceCount = computed(() => dice.value.length);
const areaCount = computed(() => areas.value.length);

const emit = defineEmits<{
  save: [name: string, description: string];
}>();

const handleSave = () => {
  if (saveName.value.trim() && diceCount.value > 0) {
    emit('save', saveName.value, saveDescription.value);
    saveName.value = '';
    saveDescription.value = '';
  }
};

const resetForm = () => {
  saveName.value = '';
  saveDescription.value = '';
};

defineExpose({
  handleSave,
  resetForm,
  saveName,
  saveDescription,
});
</script>

<style scoped>
.save-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #d1d5db;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.save-description {
  background: #374151;
  border: 1px solid #4b5563;
  color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s;
  resize: vertical;
}

.save-description::placeholder {
  color: #9ca3af;
}

.save-description:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-info {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #1f2937;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #d1d5db;
}

.form-info p {
  margin: 0;
}
</style>
