<template>
  <div>
    <!-- Progress bar container -->
    <div
      class="relative w-full bg-gray-200 rounded-full h-4 dark:bg-gray-300 my-2 overflow-hidden flex items-center"
    >
      <!-- Progress bar -->
      <div
        :class="{
          'bg-orange-400  ': props.item.hourPercent >= 80 && props.item.hourPercent < 100,
          'bg-blue-600': props.item.hourPercent == 100,
          'bg-red-600': props.item.hourPercent > 100,
          'bg-green-500': props.item.hourPercent < 80,
        }"
        class="h-4 rounded-full progress-bar text-end"
        :style="{
          width: props.item.hourPercent > 100 ? '100%' : props.item.hourPercent + '%',
          '--progress-width':
            props.item.hourPercent > 100 ? '100%' : `${props.item.hourPercent}%`,
        }"
      >
        <!-- Percentage text inside progress bar -->

        <!-- <div
          id="number-percent-id"
          class="absolute inset-0 top-0 flex items-center justify-center text-center h-fit text-black text-xs font-bold hover:scale-125 duration-75"
        >
          <span v-if="props.item.allocated_hours > 0">
            {{ props.item.hourPercent }}%</span
          >
          <span v-else> Unlimited </span>
        </div> -->

        <div
          id="number-percent-id"
          class="inset-0 top-0 text-end h-fit text-black text-xs font-bold duration-75 px-2"
        >
          <span v-if="props.item.allocated_hours > 0">
            {{ props.item.hourPercent }}%</span
          >
          <span v-else> Unlimited </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// Calculate progress percentage
// const calculateProgress = (task) => {
//   if (!task.allocated_hours || task.allocated_hours === 0) return 0;

//   const progress = (task.total_hours / task.allocated_hours) * 100;

//   return progress || 0;
// };
</script>

<style scoped>
@keyframes progress-bar-animation {
  from {
    width: 0%;
  }
  to {
    width: var(--progress-width);
  }
}

.progress-bar {
  animation: progress-bar-animation 1.5s ease-in-out;
}
</style>
