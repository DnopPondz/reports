<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-4 max-h-[70%] w-[80%] overflow-auto">
      <div v-if="!loadingSelectChart">
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-2 mb-4">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <h2 class="text-lg font-semibold">{{ date }}</h2>
          <button @click="close" class="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <!-- Modal Body -->
        <div class="mb-4" v-if="result">
          <div class="flex justify-end">
            <h2 class="capitalize font-bold">
              total hours :
              <span class="text-green-400">{{ result.total_hours }}</span> -
              <span class="text-red-500">{{ result.total_hours_time }}</span>
            </h2>
          </div>
          <div v-for="(departments, index) in result?.groupDepartments" :key="index">
            <h2 class="capitalize font-bold">{{ index }}</h2>
            <div
              class="flex justify-between"
              v-for="(emp, indexEmp) in departments"
              :key="indexEmp"
            >
              <p>
                {{ empFullname(emp) }}
              </p>
              <p>
                <span class="text-green-400">{{
                  fixedDecimal(emp?.emp_total_hours)
                }}</span>
                -
                <span class="text-red-500">{{ emp?.emp_total_hours_time }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center" v-else>
        <LoadingS2 />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref, onMounted } from "vue";
import LoadingS2 from "./LoadingS2.vue";
import { empFullname, fixedDecimal } from "@/utils/general";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  date: {
    type: String,
  },
  modalReport: {
    type: Object,
    default: () => ({}),
  },
  loadingSelectChart: {
    type: Boolean,
    default: true,
  },
});

const result = ref([]);

// Emits
const emit = defineEmits(["update:modelValue", "getProjectSelectBarChart"]);

// Methods
const close = () => {
  emit("update:modelValue", false);
  result.value = [];
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === true) {
      emit("getProjectSelectBarChart");
    }
  }
);

watch(
  () => props.modalReport,
  (newValue) => {
    result.value = newValue;
  }
);

onMounted(() => {
  emit("getProjectSelectBarChart");
});
</script>
