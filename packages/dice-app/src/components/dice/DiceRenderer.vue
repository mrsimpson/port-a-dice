<template>
  <component :is="diceComponent" :dice="dice" @click="handleClick" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Dice } from '@/types';
import SingleDiceD4 from './SingleDiceD4.vue';
import SingleDiceD6 from './SingleDiceD6.vue';
import SingleDiceD8 from './SingleDiceD8.vue';
import SingleDiceD10 from './SingleDiceD10.vue';
import SingleDiceD12 from './SingleDiceD12.vue';
import SingleDiceD20 from './SingleDiceD20-new.vue';

const props = defineProps<{
  dice: Dice;
}>();

const emit = defineEmits<{
  click: [id: string];
}>();

const diceComponent = computed(() => {
  switch (props.dice.type) {
    case 'd4':
      return SingleDiceD4;
    case 'd6':
      return SingleDiceD6;
    case 'd8':
      return SingleDiceD8;
    case 'd10':
      return SingleDiceD10;
    case 'd12':
      return SingleDiceD12;
    case 'd20':
      return SingleDiceD20;
    default:
      return SingleDiceD6;
  }
});

const handleClick = (id: string) => {
  emit('click', id);
};
</script>
