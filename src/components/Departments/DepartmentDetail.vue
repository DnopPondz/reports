<template>
  <div class="padding-screen-max">
    <div></div>
    <div class="flex justify-between">
      <h2>Department</h2>
      <input type="month" v-model="month" :max="maxDate" />
    </div>
    <div v-if="!loading">
      <div class="flex justify-between p-2 border-2 border-blue-200 rounded-lg mt-4">
        <h2 class="font-bold text-3xl">{{ route?.params?.name }}</h2>
        <p class="capitalize font-semibold text-2xl">
          total: {{ departmentReports.hours_time }} hours
        </p>
      </div>
      <h2 class="capitalize mt-4">projects in department</h2>
      <div
        class="my-2 border-2 border-blue-200 rounded-lg p-2"
        v-for="(project, index) in departmentReports?.projectTaskHours"
        :key="index"
      >
        <div class="flex justify-between">
          <p class="capitalize font-semibold text-2xl">
            {{ project?.project_name || "unknown" }}
          </p>
          <p class="capitalize font-semibold text-2xl">
            total : {{ project.total_project_hours_time }} hours
          </p>
        </div>
        <h2 class="capitalize">Tasks</h2>
        <div
          class="pl-4 flex justify-between"
          v-for="(task, indexTask) in project.tasks"
          :key="indexTask"
        >
          <p class="capitalize">- {{ task?.task_name || "unknown" }}</p>
          <p>{{ task.total_hours_time }} hours</p>
        </div>
      </div>
    </div>
    <LoadingS1 v-else />
  </div>
</template>

<script setup>
import { API_BASE_URL } from "@/apiConfig";
import { fetchApi, setOption } from "@/utils/fechtApi";
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadingS1 from "../Materials/LoadingS1.vue";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const departmentReports = ref([]);

const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const month = ref(getCurrentMonth());

onMounted(() => {
  // console.log("route", route?.params?.name);
  const name = route?.params?.name;
  if (!route?.params?.name) {
    return router.push({ name: "DepartmentIndex" });
  }
  fetchDepatmentHoursReports(name);
});

const maxDate = computed(() => {
  const month = getCurrentMonth();
  return month;
});

const fetchDepatmentHoursReports = async (name) => {
  loading.value = true;
  try {
    const url = `${API_BASE_URL}/reports/department-hours-reports/${name}?type=month&start=${month.value}-01&end=${month.value}-01`;
    const response = await fetchApi(url, setOption());
    const data = response.data;
    // console.log("data", response);

    if (data) {
      departmentReports.value = data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => month.value,
  (newValue) => {
    const name = route?.params?.name;
    if (!route?.params?.name) {
      return router.push({ name: "DepartmentIndex" });
    }

    if (newValue) {
      fetchDepatmentHoursReports(name);
    }
  }
);
</script>
