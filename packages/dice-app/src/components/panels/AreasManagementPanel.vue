<template>
  <div class="areas-management-panel">
    <BaseEmptyState v-if="areasStore.sortedAreas.length === 0" :message="$t('messages.no-areas')" />

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
import { useI18n } from 'vue-i18n';
import { useAreasStore } from '@/stores/areas';
import { useDiceStore } from '@/stores/dice';
import { useToastStore } from '@/stores/toast';
import ParkingAreaItem from '@/components/ParkingAreaItem.vue';
import BaseEmptyState from '@/components/base/BaseEmptyState.vue';

const { t } = useI18n();

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
  toastStore.show(t('messages.area-deleted'));
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
