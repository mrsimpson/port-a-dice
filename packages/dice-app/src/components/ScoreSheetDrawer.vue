<template>
  <DrawerWrapper
    :title="$t('scoreSheet.title')"
    :is-open="uiStore.showScoreSheet"
    @close="uiStore.closeScoreSheet"
  >
    <ScoreSheetPanel />
  </DrawerWrapper>
</template>

<script setup lang="ts">
import DrawerWrapper from './DrawerWrapper.vue';
import ScoreSheetPanel from './ScoreSheetPanel.vue';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
</script>
