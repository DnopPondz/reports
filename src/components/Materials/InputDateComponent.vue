<template>
  <div>
    <label class="block text-gray-700 font-medium">{{ labelTitle }}:</label>
    <div v-if="checkType()">
      <input
        :type="type"
        v-model="localStart"
        :max="maxDate"
        class="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div v-if="type === 'year'">
      <select
        v-model="localStart"
        :max="maxDate"
        class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  labelTitle: {
    type: String,
    default: "",
  },
  years: {
    type: Array,
  },
  maxDate: {
    type: String,
  },
  type: {
    type: String,
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const localStart = ref(props.modelValue);

const emit = defineEmits(["update:modelValue"]);

function checkType() {
  return props.type === "date" || props.type === "month" ? true : false;
}

watch(localStart, (newValue) => {
  return emit("update:modelValue", newValue);
});
</script>
