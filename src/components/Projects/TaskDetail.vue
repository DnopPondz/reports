<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-8">
      <button
        @click="goBack"
        class=" px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <i class="w-4 h-4"></i>
        Back
      </button>

      <h2 class="text-3xl font-bold text-gray-800">
        🧾 Task: <span class="text-blue-600">{{ taskName }}</span>
      </h2>
    </div>

    <!-- Search Filters -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8"
    >
      <p class="text-gray-600 font-medium">
        Filter tasks by name or date
      </p>
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <input
          v-model="searchName"
          type="text"
          placeholder="Employee name..."
          class="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />
        <input
          v-model="searchDate"
          type="date"
          :min="minDate"
          :max="maxDate"
          class="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />
      </div>
    </div>

    <!-- Task List -->
    <div v-if="filteredTasks.length > 0" class="space-y-8">
      <ul class="space-y-6">
        <li v-for="(item, index) in filteredTasks" :key="index" class="space-y-6">
       

          <div
            v-for="(time, i) in item?.time_sheets"
            :key="i"
            class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
              <div>
                <span class="block text-sm text-gray-500 font-medium mb-1">Employee</span>
                <p class="font-semibold text-gray-800">
                   {{ empFullname(time.employee) }}
                </p>
              </div>

              <div>
                <span class="block text-sm text-gray-500 font-medium mb-1">Start</span>
                <p class="text-gray-800">{{ formatDateTimeZone(time.start, time.timezone) }}</p>
              </div>

              <div>
                <span class="block text-sm text-gray-500 font-medium mb-1">End</span>
                <p class="text-gray-800">{{ formatDateTimeZone(time.end, time.timezone) }}</p>
              </div>

              <div>
                <span class="block text-sm text-gray-500 font-medium mb-1">Hours</span>
                <p class="text-gray-800">
                  {{ time.hours }}h
                  <span class="text-red-500 font-semibold">
                    ({{ time.hours_time }} hrs)
                  </span>
                </p>
              </div>

              <div class="md:col-span-2">
                <span class="block text-sm text-gray-500 font-medium mb-1">Notes</span>
                <p class="text-gray-600 italic">{{ time.note || 'No notes available' }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <p class="text-gray-500 text-lg font-medium">No tasks found</p>
      <p class="text-gray-400 text-sm mt-1">Try adjusting your filters above</p>
    </div>
  </div>
</template>


<script setup>
import { toRefs, defineOptions, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "@/stores/taskStore";
import { empFullname, formatDateTimeZone, formatYMD } from "@/utils/general";
import { useGeneralStore } from "@/stores/generalStore";

defineOptions({
  name: "TaskDetail",
});

const route = useRoute();
// eslint-disable-next-line no-unused-vars
const { code, taskName } = toRefs(route.params);
const taskStore = useTaskStore();
const router = useRouter();

const generalStore = useGeneralStore();

const task = computed(() => {
  const selectedTask = taskStore.getSelectedTask;

  if (selectedTask === null || selectedTask === undefined) {
    const storedTask = localStorage.getItem("tasks");
    return storedTask ? JSON.parse(storedTask) : null;
  }

  return selectedTask;
});

const searchName = ref("");
const searchDate = ref("");

const pickDate = computed(() => {
  const selectDated = generalStore.getPickDate();

  if (selectDated === null || selectDated === undefined) {
    const storedDatePick = localStorage.getItem("datePick");
    return storedDatePick ? JSON.parse(storedDatePick) : null;
  }

  return selectDated;
});

const minDate = computed(() => {
  const date = new Date(pickDate.value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
});

const maxDate = computed(() => {
  const today = new Date();
  const pickDateObj = new Date(pickDate.value);

  const pickYear = pickDateObj.getFullYear();
  const pickMonth = pickDateObj.getMonth();
  if (pickYear === today.getFullYear() && pickMonth === today.getMonth()) {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  } else {
    const lastDayOfMonth = new Date(pickYear, pickMonth + 1, 0);
    return `${lastDayOfMonth.getFullYear()}-${String(
      lastDayOfMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(lastDayOfMonth.getDate()).padStart(2, "0")}`;
  }
});

const goBack = () => {
  router.push({ name: "ProjectDetail" });
};

const filteredTasks = computed(() => {
  if (!task.value || !task.value.project_infos_task) return [];

  return task.value.project_infos_task.filter((item) =>
    item.time_sheets.some((time) => {
      // Filter by name (first or last)
      const matchesName =
        // `${time.employee.first_name} ${time.employee.last_name}`
        `${time.employee?.preferred_name}`
          .toLowerCase()
          .includes(searchName.value.toLowerCase());

      // Filter by start date
      const matchesDate = searchDate.value
        ? formatYMD(time.start, time.timezone).startsWith(searchDate.value)
        : true;

      return matchesName && matchesDate;
    })
  );
});
</script>

<style scoped>
.lucide {
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
}
</style>