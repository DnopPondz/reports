<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <!-- Back Button -->
      <button
        @click="handleBack"
        type="button"
        class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2"
      >
        ← Back
      </button>

      <!-- Month Picker -->
      <div class="relative flex items-center gap-3">
        <label for="monthPicker" class="sr-only">Select Month</label>

        <input
          id="monthPicker"
          type="month"
          v-model="datePick"
          :max="maxMonth"
          @change="handleInputChange"
          class="w-[230px] rounded-lg border border-gray-300 bg-white px-4 py-2.5 shadow-sm text-gray-800 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 
                 hover:border-blue-400 hover:shadow-md"
        />


        
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading" class="space-y-6">
      <!-- Employee Info Card -->
      <div class="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {{ empFullname(empWithTimeSheets) }}
        </h2>
        <p class="text-gray-600 text-lg">
          <span class="font-semibold text-gray-800">Total Hours:</span>
          {{ empWithTimeSheets?.group_total_hours || 0 }}
        </p>
      </div>

      <!-- Timesheet List -->
      <div v-if="!alert.message" class="space-y-8">
        <div
          v-for="(timesheet, date) in empWithTimeSheets.groupedTimeSheets"
          :key="date"
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            {{ date }}
          </h3>

          <ul class="space-y-4">
            <li
              v-for="(item, index) in timesheet"
              :key="index"
              class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <!-- Project & Task -->
              <div class="flex flex-col md:flex-row md:justify-between gap-2 mb-3">
                <p class="text-gray-800">
                  <span class="font-semibold text-blue-700">Project:</span>
                  {{ item.project_infos[0]?.project.name }}
                </p>
                <p class="text-gray-800">
                  <span class="font-semibold text-blue-700">Task:</span>
                  {{ item.project_infos[1]?.task.name }}
                </p>
              </div>

              <!-- Start & End -->
              <div class="flex flex-col md:flex-row md:justify-between gap-2 mb-2">
                <p>
                  <span class="font-semibold text-blue-700">Start:</span>
                  <span class="text-gray-700 normal-case">
                    {{ item?.start ? formatDateTimeZone(item.start, item.timezone) : '-' }}
                  </span>
                </p>
                <p>
                  <span class="font-semibold text-blue-700">End:</span>
                  <span class="text-gray-700 normal-case">
                    {{ item?.end ? formatDateTimeZone(item.end, item.timezone) : '-' }}
                  </span>
                </p>
              </div>

              <!-- Hours & Note -->
              <div class="border-t border-gray-300 mt-3 pt-3 text-gray-700 space-y-1">
                <p>
                  <span class="font-semibold text-blue-700">Hours:</span>
                  {{ item.hours > 0 ? item.hours_time : '—' }}
                </p>
                <p>
                  <span class="font-semibold text-blue-700">Note:</span>
                  <span class="normal-case" v-html="item.note"></span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Alert Message -->
      <div v-else class="text-center py-8">
        <p class="text-gray-600 text-lg">{{ alert.message }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingS1 v-else />

    <!-- Alert Component -->
    <AlertComponent
      v-if="alertVisible"
      :type="alert.type"
      :title="alert.title"
      :message="alert.message"
      :visible="alertVisible"
    />
  </div>
</template>


<script setup>
import { onMounted, ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

import { fetchApi, setOption } from "@/utils/fechtApi";
import { API_BASE_URL } from "@/apiConfig";

import { useGeneralStore } from "@/stores/generalStore";
import { backTo, empFullname, formatDateTimeZone } from "@/utils/general";
import AlertComponent from "../Materials/AlertComponent.vue";
import LoadingS1 from "../Materials/LoadingS1.vue";

const alert = ref({
  type: "",
  title: "",
  message: "",
});
const alertVisible = ref(false);

const route = useRoute();
const router = useRouter();
const { code } = toRefs(route.params);

const loading = ref(true);
const empWithTimeSheets = ref([]);
const generalStore = useGeneralStore();
const maxMonth = ref(null);

const fetchEmployeeWithTimesheet = async () => {
  loading.value = true;
  resetAlert();
  const url = `${API_BASE_URL}/bhr/employees/timesheets/${code.value}?type=month&month=${datePick.value}-01`;
  try {
    const response = await fetchApi(url, setOption());
    const result = response;
    empWithTimeSheets.value = result.data;

    let checkLength = result.data?.time_sheets?.length;
    if (checkLength === 0) {
      alert.value = {
        message: result.message,
        type: "warning",
        title: "Not Found",
      };
      alertVisible.value = true;

      setTimeout(() => {
        alertVisible.value = false;
      }, 3000);
    }
  } catch (error) {
    console.error("err", error);
  } finally {
    loading.value = false;
  }
};

const resetAlert = () => {
  alertVisible.value = false;
  alert.value = {
    type: "",
    title: "",
    message: "",
  };
};

const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const datePick = ref(getCurrentMonth());

const handleBack = () => {
  backTo(router, { name: "Employees" });
};

const handleInputChange = () => {
  fetchEmployeeWithTimesheet();
};

onMounted(() => {
  const currentMonth = getCurrentMonth();
  datePick.value = generalStore.getPickDate() || currentMonth;
  maxMonth.value = currentMonth;
  fetchEmployeeWithTimesheet();
});
</script>

<style scoped>
/* Optional subtle enhancements */
input[type="month"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.5);
  transition: filter 0.2s ease;
}

input[type="month"]:hover::-webkit-calendar-picker-indicator {
  filter: invert(0);
}
</style>