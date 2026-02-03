<template>
  <div class="max-w-6xl mx-auto px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 class="text-3xl font-bold">Department</h2>

      <div class="relative">
        <input
          type="month"
          v-model="month"
          :max="maxDate"
          class="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>

    <!-- Content -->
    <div v-if="!loading" class="space-y-6">
      <!-- Department Summary -->
      <div class="p-4 border-2 border-blue-200 rounded-xl bg-blue-50 flex justify-between items-center">
        <h2 class="font-bold text-2xl capitalize">{{ route?.params?.name }}</h2>
        <p class="font-semibold text-xl text-blue-700">
          Total: {{ departmentReports.hours_time }} hours
        </p>
      </div>

      <!-- Projects Grid -->
      <div>
        <h2 class="font-semibold text-lg mb-3">Projects in Department</h2>

        <!-- ✅ ใช้ Grid สร้าง 2 คอลัมน์ -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="(project, i) in departmentReports?.projectTaskHours"
            :key="i"
            class="p-4 border border-blue-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <!-- Project Header -->
            <div class="flex justify-between items-center mb-2">
              <p class="font-semibold text-xl capitalize">{{ project.project_name || 'Unknown' }}</p>
              <p class="text-blue-600 font-medium">
                Total: {{ project.total_project_hours_time }} hours
              </p>
            </div>

            <!-- Tasks -->
            <h3 class="text-gray-700 font-medium mb-1">Tasks</h3>
            <div
              v-for="(task, j) in project.tasks"
              :key="j"
              class="flex justify-between pl-4 py-1 border-b last:border-none"
            >
              <p>- {{ task.task_name || 'Unknown' }}</p>
              <p class="font-medium">{{ task.total_hours_time }} hours</p>
            </div>
          </div>
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
