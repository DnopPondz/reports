<template>
  <div
    v-if="visible"
    class="absolute z-[1000] top-4 left-1/2 transform -translate-x-1/2"
    :class="[
      'flex p-4 mb-4 text-sm rounded-lg',
      type === 'success' ? 'bg-green-100 text-green-700' : '',
      type === 'error' ? 'bg-red-100 text-red-700' : '',
      type === 'warning' ? 'bg-yellow-100 text-yellow-700' : '',
      type === 'info' ? 'bg-blue-100 text-blue-700' : '',
    ]"
    role="alert"
  >
    <svg
      aria-hidden="true"
      class="flex-shrink-0 inline w-5 h-5 mr-3"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8 4a1 1 0 100-2 1 1 0 000 2zm.93-8.36a1 1 0 00-1.86 0l-1 4A1 1 0 008 11h4a1 1 0 00.97-.76l1-4a1 1 0 00-.04-.6z"
        clip-rule="evenodd"
      ></path>
    </svg>
    <div>
      <span class="font-medium">{{ title }}</span> {{ message }}
    </div>
    <button
      @click="dismiss"
      class="ml-auto -mx-1.5 -my-1.5 bg-transparent text-current rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 inline-flex items-center justify-center h-8 w-8"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  type: {
    type: String,
    default: "info",
  },
  title: {
    type: String,
    default: "Notice",
  },
  message: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const visible = ref(true);

const dismiss = () => {
  visible.value = false;
};
</script>
