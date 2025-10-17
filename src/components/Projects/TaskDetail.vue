<template>
  <div class="padding-screen-max">
    <button
      class="px-4 py-2 bg-blue-500 font-bold rounded-xl hover:bg-blue-300 text-white hover:text-black"
      @click="goBack"
    >
      Back
    </button>
    <div class="flex justify-between items-center">
      <h2 class="my-6 font-bold text-3xl">Task: {{ taskName }}</h2>
      <div>
        <input type="text" v-model="searchName" placeholder="Search by name" />
        <input
          type="date"
          v-model="searchDate"
          :min="minDate"
          :max="maxDate"
          placeholder="Search by start date"
        />
      </div>
    </div>

    <div v-if="filteredTasks.length > 0">
      <ul>
        <li v-for="(item, index) in filteredTasks" :key="index">
          <div
            class="p-4 my-6 rounded-xl bg-white hover:cursor-pointer hover:shadow-2xl"
            v-for="(time, i) in item?.time_sheets"
            :key="i"
          >
            <!-- {{ time }} -->
            <div class="flex gap-6">
              <!-- <p>
                <span class="font-bold capitalize">Employee ID:</span>
                {{ time?.employee.code }}
              </p> -->
              <p>
                <span class="font-bold capitalize"> by</span>

                {{ empFullname(time?.employee) }}
              </p>
            </div>
            <div class="flex gap-6">
              <p>
                <span class="font-bold capitalize">Start:</span>
                {{ formatDateTimeZone(time.start, time.timezone) }}
              </p>
              <p>
                <span class="font-bold capitalize">End:</span>
                {{ formatDateTimeZone(time.end, time.timezone) }}
              </p>
            </div>
            <p>
              <span class="font-bold capitalize">Hours:</span> {{ time.hours }}
              <span class="font-bold capitalize text-red-500"
                >Convert to time: {{ time.hours_time }} Hours</span
              >
            </p>
            <p><span class="font-bold capitalize">notes: </span> {{ time.note }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No task</p>
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
