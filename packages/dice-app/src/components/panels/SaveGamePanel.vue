<template>
  <div class="save-game-panel">
    <div class="save-form">
      <div class="save-name-group">
        <label for="save-name" class="form-label">{{ $t('forms.save-as') }}</label>
        <div class="name-input-group">
          <BaseInput
            id="save-name"
            v-model="saveName"
            type="text"
            :placeholder="$t('forms.enter-game-name')"
            @keyup.enter="handleSave"
            class="save-input"
          />
          <button class="save-btn" @click="handleSave" :disabled="!saveName.trim()">
            {{ $t('buttons.save') }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="save-description" class="form-label">{{ $t('forms.description') }}</label>
        <textarea
          id="save-description"
          v-model="saveDescription"
          class="save-description"
          :placeholder="$t('forms.add-description')"
          rows="2"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDiceStore } from '@/stores/dice';
import { storeToRefs } from 'pinia';
import BaseInput from '@/components/base/BaseInput.vue';

const diceStore = useDiceStore();

const { dice } = storeToRefs(diceStore);

const saveName = ref<string>('');
const saveDescription = ref<string>('');

const emit = defineEmits<{
  save: [name: string, description: string];
}>();

const handleSave = () => {
  if (saveName.value.trim() && dice.value.length > 0) {
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
  gap: 0.5rem;
}

.save-name-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.save-input {
  flex: 1;
}

.save-btn {
  padding: 0.375rem 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
  opacity: 0.5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #d1d5db;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.save-description {
  background: #374151;
  border: 1px solid #4b5563;
  color: #f3f4f6;
  border-radius: 0.375rem;
  padding: 0.375rem;
  font-size: 0.75rem;
  font-family: inherit;
  transition: all 0.2s;
  resize: vertical;
  min-height: 2rem;
}

.save-description::placeholder {
  color: #9ca3af;
}

.save-description:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
</style>
