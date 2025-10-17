<template>
  <div class="">
    <h1 class="font-bold text-3xl padding-screen-max">Dashboard</h1>
    <div class="flex justify-between pb-8 padding-screen-max">
      <div>
        <h3 class="capitalize">
          Time Sheet Report today (TSR)
          <!-- <small class="text-red-500">get time sheets from BHR api</small> -->
        </h3>
      </div>
      <button
        v-if="false"
        class="bg-blue-300 hover:bg-blue-500 text-white rounded-full py-2 px-4"
        :class="{ 'opacity-50 cursor-not-allowed': loadingSyncTimeSheet }"
        @click="handleSyncTimeSheetToday"
        :disabled="loadingSyncTimeSheet"
      >
        sync
      </button>
    </div>
    <div
      class="flex flex-col items-center w-full pt-4 pb-10 bg-mvc-lg-1 padding-screen-max"
    >
      <div
        class="flex justify-between space-x-4 gap-2 lg:gap-10 w-full"
        v-if="!loadingTimeSheet"
      >
        <div class="w-full">
          <div
            class="capitalize flex items-center text-center pt-3 pb-6 border-b-2 border-movaci-main"
          >
            <ImageIcon
              :logo="clockIN"
              class="rounded-l-xl p-2 w-[50px] h-[50px] bg-movaci-main"
            />
            <p
              class="rounded-r-xl p-2 w-[50px] h-[50px] bg-white grid items-center font-bold text-3xl text-movaci-main"
            >
              {{ dashboard.empTimeSheet?.empWithTimeSheet?.count }}
            </p>
          </div>
          <EmployeeListStyle1Component :EmpListDisplay="EmpWithTimeSheets" />
        </div>
        <div class="w-full">
          <div
            class="capitalize flex items-center text-center pt-3 pb-6 border-b-2 border-movaci-main"
          >
            <ImageIcon
              :logo="clockOUT"
              class="rounded-l-xl p-2 w-[50px] h-[50px] bg-movaci-main"
            />
            <p
              class="rounded-r-xl p-2 w-[50px] h-[50px] bg-white grid items-center font-bold text-3xl text-movaci-main"
            >
              {{ dashboard.empTimeSheet?.empWithOutTimeSheet?.count }}
            </p>
          </div>
          <EmployeeListStyle1Component :EmpListDisplay="EmpWithOutTimeSheets" />
        </div>
      </div>
      <LoadingS1 v-else />
    </div>
    <div
      class="flex flex-col items-center w-full mt-16 py-4 bg-mvc-lg-1 padding-screen-max"
    >
      <div class="flex justify-between space-x-4 w-full">
        <div v-if="!loadingTimeSheet" class="w-full">
          <div
            class="capitalize flex items-center text-center pt-3 pb-6 border-b-2 border-movaci-main"
          >
            <ImageIcon
              :logo="timeoff"
              class="rounded-l-xl p-2 w-[50px] h-[50px] bg-movaci-main"
            />
            <p
              class="rounded-r-xl p-2 w-[50px] h-[50px] bg-white grid items-center font-bold text-3xl text-movaci-main"
            >
              {{ dashboard.empTimeSheet?.empTimeOffs?.count || 0 }}
            </p>
          </div>
          <EmployeeListStyle1Component :EmpListDisplay="EmpWithTimeOffs" />
        </div>
        <div v-else class="max-h-[150px] w-full flex justify-center items-center">
          <LoadingS2 />
        </div>
      </div>
    </div>
    <div v-if="false" class="flex gap-2 padding-screen-max">
      <div>
        <div class="w-full">
          <h4 class="font-bold text-3xl">Departments</h4>
          <ul v-if="!loadingTimeSheet">
            <li
              class="ml-4 border-b-2 border-b-blue-200"
              v-for="(name, index) in Departments"
              :key="index"
            >
              <RouterLink :to="{ name: 'DepartmentDetail', params: { name: name } }">
                {{ name }}</RouterLink
              >
            </li>
          </ul>
          <LoadingS2 v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ImageIcon from "../Icons/ImageIcon.vue";
import EmployeeListStyle1Component from "../Materials/employeeListStyle1Component.vue";
import LoadingS1 from "../Materials/LoadingS1.vue";
import LoadingS2 from "../Materials/LoadingS2.vue";

import clockIN from "@/assets/in.svg";
import clockOUT from "@/assets/out.svg";
import timeoff from "@/assets/off.svg";
import { ref, computed, defineEmits, defineProps } from "vue";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  loadingSyncTimeSheet: {
    type: Boolean,
    default: true,
  },
  loadingTimeSheet: {
    type: Boolean,
    default: true,
  },
  dashboardValue: {
    type: Array,
    required: true,
  },
});

const dashboard = ref(props.dashboardValue);

const emit = defineEmits(["update:loadingSyncTimeSheet", "syncTimeSheetToday"]);

const handleSyncTimeSheetToday = () => {
  emit("syncTimeSheetToday");
};

const EmpWithOutTimeSheets = computed(
  () => dashboard.value.empTimeSheet?.empWithOutTimeSheet?.data || []
);

const EmpWithTimeSheets = computed(
  () => dashboard.value.empTimeSheet?.empWithTimeSheet.data || []
);

const EmpWithTimeOffs = computed(
  () => dashboard.value.empTimeSheet?.empTimeOffs.data || []
);

const Departments = computed(() => dashboard.value.empTimeSheet?.tk_departments || []);
</script>
