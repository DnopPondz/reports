<template>
  <div class="padding-screen-max">
    <div class="my-[5%] flex justify-between">
      <button
        class="px-4 py-2 bg-blue-500 font-bold rounded-xl hover:bg-blue-300 text-white hover:text-black"
        @click="handleBack"
        type="button"
      >
        Back
      </button>
      <input
        type="month"
        v-model="datePick"
        :max="maxMonth"
        @change="handleInputChange"
      />
    </div>

    <div v-if="!loading">
      <!-- <h2>detail</h2> -->
      <div class="flex justify-between">
        <!-- <p>code : {{ code }}</p> -->
        <p class="font-bold text-2xl">
          <span>
            {{ empFullname(empWithTimeSheets) }}
          </span>
        </p>
      </div>
      <div>total hours : {{ empWithTimeSheets?.group_total_hours || 0 }}</div>
      <div v-if="!alert.message">
        <div v-for="(timesheet, date) in empWithTimeSheets.groupedTimeSheets" :key="date">
          <div class="my-4">
            <h2 class="text-3xl font-bold">{{ date }}</h2>
            <ul class="border border-gray-400 p-2 rounded-xl my-2 shadow-lg">
              <li
                class="flex flex-col gap-2 py-2 px-4 my-4 w-full capitalize bg-blue-50 rounded-lg shadow-lg"
                v-for="(item, index) in timesheet"
                :key="index"
              >
                <div class="flex items-center justify-between">
                  <p>
                    <span class="text-xl">Project: </span>
                    {{ item.project_infos[0]?.project.name }}
                  </p>
                  <p>
                    <span class="text-xl">task: </span>
                    {{ item.project_infos[1]?.task.name }}
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p>
                    <span class="text-xl">start: </span>
                    <span class="normal-case">
                      {{
                        item?.start ? formatDateTimeZone(item.start, item.timezone) : null
                      }}</span
                    >
                  </p>
                  <p>
                    <span class="text-xl">end: </span>
                    {{ item?.end ? formatDateTimeZone(item?.end, item.timezone) : null }}
                  </p>
                </div>
                <div>
                  <p>
                    <span class="text-xl">hours:</span>
                    {{ item.hours > 0 ? item.hours_time : null }}
                  </p>
                  <p>
                    <span class="text-xl">note:</span>
                    <!-- <span class="normal-case">{{ item.note }}</span> -->
                    <span class="normal-case" v-html="item.note"></span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else>
        <p>{{ alert.message }}</p>
      </div>
    </div>
    <LoadingS1 v-else />
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
