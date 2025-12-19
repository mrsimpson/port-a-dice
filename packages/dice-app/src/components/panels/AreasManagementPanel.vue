<template>
  <div class="areas-management-panel">
    <BaseEmptyState
      v-if="areasStore.sortedAreas.length === 0"
      message="No parking areas yet. Add one using the form below."
    />

    <div v-else class="areas-list">
      <ParkingAreaItem
        v-for="area in areasStore.sortedAreas"
        :key="area.id"
        :area="area"
        @delete="handleDeleteArea"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAreasStore } from '@/stores/areas';
import { useDiceStore } from '@/stores/dice';
import { useToastStore } from '@/stores/toast';
import ParkingAreaItem from '@/components/ParkingAreaItem.vue';
import BaseEmptyState from '@/components/base/BaseEmptyState.vue';

const areasStore = useAreasStore();
const diceStore = useDiceStore();
const toastStore = useToastStore();

const emit = defineEmits<{
  delete: [areaId: string];
}>();

const handleDeleteArea = (areaId: string) => {
  diceStore.dice.forEach((dice) => {
    if (dice.areaId === areaId) dice.areaId = null;
  });
  areasStore.removeArea(areaId);
  toastStore.show('Area deleted');
  emit('delete', areaId);
};
</script>

<style scoped>
.areas-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
