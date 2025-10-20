<template>
  <div>
    <div v-if="inActiveFeature">
      <div class="flex justify-between items-center gap-2 mr-10">
        <DashBoardMenu
          v-model:currentTab="currentTab"
          :dataMenu="dashboardMenu"
          :show-list-menu="false"
        />
         <div class="flex justify-end items-center pr-6 mt-2 ">
    <p class="py-2 px-4 border-2 rounded-full capitalize transition-all duration-700 ease-out bg-movaci-main text-white">
      {{ dateTime }}
    </p>
  </div>
        <button
          v-if="false"
          class="bg-blue-300 hover:bg-blue-500 text-white rounded-full py-2 px-4"
          :class="{ 'opacity-50 cursor-not-allowed': loadingSyncTimeSheet }"
          @click="callSync"
          :disabled="loadingSyncTimeSheet"
        >
          sync
        </button>
        
      </div>

      <div v-if="!loadingSyncTimeSheet">
        <DashboardTimeSheet
          class="mt-6"
          v-if="currentTab === dashboardMenu[0].type"
          :loadingSyncTimeSheet="loadingSyncTimeSheet"
          :loadingTimeSheet="loadingTimeSheet"
          :dashboardValue="dashboard"
          @update:loadingSyncTimeSheet="(val) => (loadingSyncTimeSheet = val)"
          @syncTimeSheetToday="callSync"
        />
        <div
          id="chart-reports"
          class="my-4 rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg"
          v-if="currentTab === dashboardMenu[1].type"
        >
          <div
            class="flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between"
          >
            <h2 class="text-2xl font-semibold text-gray-800">
              Choose the report type to get started
            </h2>
            <DashBoardMenu
              id="chart-menu"
              class="mt-1 md:mt-0"
              v-model:currentTab="currentChartTab"
              :dataMenu="chartsMenu"
            />
          </div>
          <div
            class="mt-6 space-y-8 rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-6"
            v-if="currentChartTab !== 'customizev2'"
          >
            <div
              class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              id="select-date"
            >
              <div class="space-y-4">
                <p class="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Date range
                </p>
                <div v-if="currentChartTab === 'date'" class="max-w-xs">
                  <InputDateComponent
                    labelTitle="Select Date"
                    v-model="start"
                    :maxDate="maxDate"
                    type="date"
                  />
                </div>
                <div v-if="currentChartTab === 'month'" class="max-w-xs">
                  <InputDateComponent
                    labelTitle="Select Month"
                    v-model="startMonth"
                    :maxDate="maxDate"
                    type="month"
                  />
                </div>
                <div v-if="currentChartTab === 'year'" class="max-w-xs">
                  <InputDateComponent
                    labelTitle="Select Year"
                    v-model="startYear"
                    :maxDate="maxDate"
                    :years="years"
                    type="year"
                  />
                </div>
              </div>
              <div class="space-y-4" id="select-project">
                <p class="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Find a project
                </p>
                <div class="relative z-50">
                  <input
                    class="w-full rounded-xl border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm shadow-sm transition focus:border-movaci-main focus:outline-none focus:ring-2 focus:ring-movaci-main/40"
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search projects..."
                  />

                  <ul
                    v-if="compuFilterProjects.length"
                    class="absolute z-50 mt-2 max-h-52 w-full list-none overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                  >
                    <li
                      v-for="project in compuFilterProjects"
                      :key="project.id"
                      @click="selectProject(project)"
                      class="cursor-pointer rounded-lg px-3 py-2 text-sm transition hover:bg-movaci-main/10"
                    >
                      {{ project.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="space-y-3" v-if="currentChartTab !== 'customizev2'">
              <h4 class="text-lg font-semibold text-gray-800">Selected projects</h4>
              <p
                v-if="!projectPickers.length"
                class="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-500"
              >
                Use the search above to add projects to your report.
              </p>
              <ul v-else class="space-y-2">
                <li
                  class="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm shadow-sm"
                  v-for="(item, index) in projectPickers"
                  :key="index"
                >
                  <span class="font-medium text-gray-700">{{ item.name }}</span>
                  <button
                    class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-200"
                    @click="removeProject(item.id)"
                  >
                    Remove
                  </button>
                </li>
              </ul>
            </div>
            <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p class="text-sm text-gray-500">
                Configure your filters and select search to update the charts.
              </p>
              <button
                class="w-full rounded-full bg-movaci-main px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-movaci-main/90 sm:w-auto"
                @click="searchProjectSelect()"
              >
                Search
              </button>
            </div>

            <template v-if="currentChartTab !== 'customizev2'">
              <div v-if="projectSelected?.length > 0" class="rounded-2xl bg-white p-4 shadow-inner">
                <ChartBar
                  :start="start"
                  :end="end"
                  :currentTab="currentChartTab"
                  :dataMenu="chartsMenu"
                  :projectSelected="projectSelected"
                />
              </div>
            </template>
          </div>
          <div class="flex flex-col" v-else>
            <template v-for="(item, index) in customList" :key="index">
              <div
                class="my-4 space-y-6 rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-6 shadow-md"
              >
                <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div class="grid flex-1 gap-6 md:grid-cols-2">
                    <div class="space-y-3">
                      <label class="text-sm font-medium uppercase tracking-wide text-gray-500"
                        >Select type</label
                      >
                      <select
                        v-model="item.currentType"
                        @input="clearCustomSelect(item.id)"
                        class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium capitalize shadow-sm transition focus:border-movaci-main focus:outline-none focus:ring-2 focus:ring-movaci-main/40"
                      >
                        <option
                          v-for="(type, index) in types"
                          :key="index"
                          :value="type.name"
                        >
                          {{ type.name }}
                        </option>
                      </select>
                    </div>
                    <div class="space-y-3" id="select-date">
                      <p class="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Date range
                      </p>
                      <div class="flex flex-col gap-4">
                        <div
                          class="flex flex-col gap-4 md:flex-row"
                          v-if="item.currentType === 'date'"
                        >
                          <InputDateComponent
                            labelTitle="Select start"
                            v-model="item.datePicker.start"
                            :maxDate="maxDate"
                            type="date"
                          />

                          <InputDateComponent
                            labelTitle="Select end"
                            v-model="item.datePicker.end"
                            :maxDate="maxDate"
                            type="date"
                          />
                        </div>
                        <div
                          class="flex flex-col gap-4 md:flex-row"
                          v-if="item.currentType === 'month'"
                        >
                          <InputDateComponent
                            labelTitle="Select Start Month"
                            v-model="item.datePicker.start"
                            :maxDate="maxDate"
                            type="month"
                          />
                          <InputDateComponent
                            labelTitle="Select End Month"
                            v-model="item.datePicker.end"
                            :maxDate="maxDate"
                            type="month"
                          />
                        </div>
                        <div
                          class="flex flex-col gap-4 md:flex-row"
                          v-if="item.currentType === 'year'"
                        >
                          <InputDateComponent
                            labelTitle="Select Year"
                            v-model="item.datePicker.start"
                            :maxDate="maxDate"
                            :years="years"
                            type="year"
                          />
                          <InputDateComponent
                            labelTitle="Select Year"
                            v-model="item.datePicker.end"
                            :maxDate="maxDate"
                            :years="years"
                            type="year"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    class="self-start rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-200"
                    @click="removeCustomList(item.id)"
                  >
                    Remove form
                  </button>
                </div>

                <div class="space-y-4" id="select-project">
                  <p class="text-sm font-medium uppercase tracking-wide text-gray-500">
                    Find a project
                  </p>
                  <div class="relative z-40 max-w-xl">
                    <input
                      class="w-full rounded-xl border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm shadow-sm transition focus:border-movaci-main focus:outline-none focus:ring-2 focus:ring-movaci-main/40"
                      type="text"
                      v-model="searchQuery"
                      placeholder="Search projects..."
                    />

                    <ul
                      v-if="compuFilterProjects.length"
                      class="absolute z-50 mt-2 max-h-52 w-full list-none overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                    >
                      <li
                        v-for="project in compuFilterProjects"
                        :key="project.id"
                        @click="selectProject(project, 'custom', item.id)"
                        class="cursor-pointer rounded-lg px-3 py-2 text-sm transition hover:bg-movaci-main/10"
                      >
                        {{ project.name }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="space-y-3" id="projects-list ">
                  <h4 class="text-lg font-semibold text-gray-800">Selected projects</h4>
                  <p
                    v-if="!item.projectList.length"
                    class="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-500"
                  >
                    Use the search above to add projects to this form.
                  </p>
                  <ul v-else class="space-y-2">
                    <li
                      class="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm shadow-sm"
                      v-for="(project, index) in item.projectList"
                      :key="index"
                    >
                      <span class="font-medium text-gray-700">{{ project.name }}</span>
                      <button
                        class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-200"
                        @click="removeProject(project.id, item.id)"
                      >
                        Remove
                      </button>
                    </li>
                  </ul>
                </div>
                <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p class="text-sm text-gray-500">
                    Configure your filters and select search to update the charts.
                  </p>
                  <button
                    class="w-full rounded-full bg-movaci-main px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-movaci-main/90 sm:w-auto"
                    @click="searchProjectSelect(item.id)"
                  >
                    Search
                  </button>
                </div>
                <div
                  v-if="item.projectSelected?.length > 0"
                  class="rounded-2xl bg-white p-4 shadow-inner"
                >
                  <ChartBar
                    :key="index"
                    :keyIndex="index + 1"
                    :start="item.datePicker?.start"
                    :end="item.datePicker?.end"
                    :currentTab="currentChartTab"
                    :dataMenu="chartsMenu"
                    :projectSelected="item.projectSelected"
                    :currentType="item.currentType"
                  />
                </div>
              </div>
            </template>
            <div class="mt-6">
              <button
                class="w-full rounded-full border-2 border-dashed border-movaci-main px-6 py-3 text-sm font-semibold uppercase tracking-wide text-movaci-main transition hover:bg-movaci-main/10 sm:w-auto"
                @click="addForm"
              >
                Create new form
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex justify-center items-center h-screen">
        <p class="text-[50px] capitalize">the system on syncing data</p>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-center items-center h-[400px]">
        <p class="capitalize font-bold text-5xl">Coming soon</p>
      </div>
    </div>
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
import { ref, onMounted, computed, watch, onBeforeUnmount  } from "vue";
import { API_BASE_URL } from "@/apiConfig";
import { fetchApi, setOption } from "@/utils/fechtApi";
import DashBoardMenu from "./Dashboard/DashBoardMenu.vue";
import DashboardTimeSheet from "./Dashboard/TimeSheets.vue";
import ChartBar from "./Dashboard/ChartBar.vue";
import AlertComponent from "./Materials/AlertComponent.vue";
import { dashboardMenu, chartsMenu, mainMenu } from "@/navList";
import InputDateComponent from "./Materials/InputDateComponent.vue";
import { useRoute, useRouter } from "vue-router";


const route = useRoute();
const router = useRouter();

const loadingTimeSheet = ref(true);
const loadingSyncTimeSheet = ref(false);
const loadingSyncTimeOff = ref(true);
const dashboard = ref({
  empTimeSheet: [],
});

const today = new Date().toISOString().split("T")[0];
const currentMonth = new Date().toISOString().slice(0, 7);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const start = ref(today);
const end = ref(today);
const startMonth = ref("");
const startYear = ref("");
const pickDates = ref([]);

const projects = ref([]);
const searchQuery = ref("");
const filteredProjects = ref([]);
const projectPickers = ref([]);
const projectSelected = ref([]);

// eslint-disable-next-line no-unused-vars
const types = ref([
  {
    name: "date",
  },
  {
    name: "month",
  },
  {
    name: "year",
  },
]);

const customList = ref([
  {
    id: 1,
    projectList: [],
    projectSelected: [],
    datePicker: {
      start: "",
      end: "",
    },
    currentType: "date",
  },
]);

const addForm = () => {
  const id = customList.value.length + 1;
  customList.value.push({
    id: id,
    projectList: [],
    projectSelected: [],
    datePicker: {
      start: "",
      end: "",
    },
    currentType: "date",
  });
};

function clearCustomSelect(id) {
  let select = findCustomList(id);
  // console.log("select", select.currentType);

  setTimeout(() => {
    let index = Number(id) - 1;
    customList.value[index] = {
      id,
      datePicker: {
        start: "",
        end: "",
      },
      projectList: select.projectList,
      projectSelected: [],
      currentType: select.currentType,
    };
  }, 100);
}

const removeCustomList = (id) => {
  customList.value = customList.value.filter((cus) => cus.id !== id);
};

const maxDate = computed(() => {
  switch (currentChartTab.value) {
    case "date":
      return today;
    case "month":
      return currentMonth;
    case "year":
      return currentYear;
    default:
      return today;
  }
});

const compuFilterProjects = computed(() => {
  const query = searchQuery.value?.toLowerCase();
  if (query?.length > 0) {
    return projects.value.filter((project) => project.name.toLowerCase().includes(query));
  } else {
    return projects.value;
  }
});

const inActiveFeature = ref(true);

const alert = ref({
  type: "",
  title: "",
  message: "",
});

const checkRoute = () => {
  if (route.hash.replace("#", "") === dashboardMenu[1].type) {
    return dashboardMenu[1].type;
  }

  return dashboardMenu[0].type;
};

const alertVisible = ref(false);
const currentTab = ref(checkRoute());
const currentChartTab = ref(chartsMenu[0].type);

const callSync = async () => {
  await syncTimeSheetToday();
  await syncTimeOff();
  await getTimeSheetToday();
};

const syncTimeOff = async () => {
  loadingSyncTimeOff.value = true;
  try {
    const url = `${API_BASE_URL}/bhr/timeoffs/sync`;
    // eslint-disable-next-line no-unused-vars
    const response = await fetchApi(url, setOption());
    // if (response.status) {
    //   alert.value = {
    //     type: "success",
    //     title: "sync",
    //     message: response.message,
    //   };
    //   alertVisible.value = true;

    //   setTimeout(() => {
    //     alertVisible.value = false;
    //   }, 5000);

    //   return;
    // }
    // alert.value = {
    //   type: "",
    //   title: "",
    //   message: "",
    // };
  } catch (error) {
    console.log("err", error);
  } finally {
    loadingSyncTimeOff.value = false;
  }
};

const syncTimeSheetToday = async () => {
  loadingSyncTimeSheet.value = true;
  try {
    const url = `${API_BASE_URL}/bhr/time-sheets/sync`;
    const response = await fetchApi(url, setOption());
    // console.log("response", response.message);
    if (response.status) {
      alert.value = {
        type: "success",
        title: "sync",
        message: response.message,
      };
      alertVisible.value = true;

      setTimeout(() => {
        alertVisible.value = false;
      }, 5000);
      return;
    }

    alert.value = {
      type: "",
      title: "",
      message: "",
    };
  } catch (error) {
    console.log("err", error);
  } finally {
    loadingSyncTimeSheet.value = false;
  }
};

const getTimeSheetToday = async () => {
  loadingTimeSheet.value = true;
  try {
    // const url = `${API_BASE_URL}/dashboard/time-sheet-today`;
    const url = `${API_BASE_URL}/dashboard/time-sheet-real-time`; // v2 real time original get
    const response = await fetchApi(url, setOption());
    const data = response;
    dashboard.value.empTimeSheet = data;
  } catch (error) {
    console.log("err", error);
  } finally {
    loadingTimeSheet.value = false;
  }
};

const fetchProjects = async () => {
  try {
    const url = `${API_BASE_URL}/bhr/projects`;

    const response = await fetchApi(url, setOption());

    const data = response;
    projects.value = data;
  } catch (error) {
    console.err(error);
  }
};

function selectProject(project, type = null, id = null) {
  searchQuery.value = "";
  if (type === null) {
    let check = projectPickers.value.find((p) => p.code === project.code);
    if (!check) {
      projectPickers.value.push(project);
    } else {
      window.alert("This project is already.");
    }
  } else {
    const selected = findCustomList(id);
    if (selected === null) {
      return "not found id";
    }

    let check = selected.projectList.find((p) => p.code === project.code);
    if (!check) {
      selected.projectList.push(project);
    } else {
      window.alert("This project is already.");
    }
  }

  filteredProjects.value = [];
}

function searchProjectSelect(id = null) {
  if (currentChartTab.value !== "customizev2") {
    if (projectPickers.value.length <= 5) {
      projectSelected.value = projectPickers.value.map((project) => project.code);
    } else {
      window.alert("Limit of 5 projects exceeded.");
      return;
    }
  } else {
    //customize v2
    const selected = findCustomList(id);
    if (selected === null) {
      return "not found id";
    }

    if (!selected.datePicker.start || !selected.datePicker.end) {
      window.alert("request datepicked");
      return;
    }
    if (selected.datePicker.start > selected.datePicker.end) {
      window.alert("The start date cannot be later than the end date.");
      return;
    }

    // console.log("selected", selected);
    if (selected?.projectList.length <= 0) {
      window.alert("Plaese select project.");
      return;
    } else if (selected?.projectList.length <= 5) {
      const projectCodes = selected.projectList.map((p) => p.code);
      selected.projectSelected = projectCodes;
    } else {
      window.alert("Limit of 5 projects exceeded.");
      return;
    }
  }
}

function findCustomList(id) {
  return customList.value.find((item) => item.id === id);
}

function removeProject(id, cusId) {
  if (currentChartTab.value === "customizev2") {
    let select = findCustomList(cusId);

    const removeProject = select.projectList.filter((item) => item.id !== id);
    customList.value[Number(cusId) - 1].projectList = removeProject;
  } else {
    projectPickers.value = projectPickers.value.filter((project) => project.id !== id);
  }
}

onMounted(() => {
  if (inActiveFeature.value) {
    getTimeSheetToday();
    fetchProjects();
    checkRoute();
    document.title = route?.hash ? dashboardMenu[1].name : dashboardMenu[0].name;
  }
});

watch(
  () => currentChartTab.value,
  (newValue) => {
    currentChartTab.value = newValue;
    start.value = null;
    end.value = null;
    startMonth.value = null;
    startYear.value = null;
    switch (newValue) {
      case "date":
        start.value = today;
        end.value = today;
        return;
      case "month":
        startMonth.value = currentMonth;
        return;
      case "year":
        startYear.value = currentYear;
        return;
    }
    projectSelected.value = [];
    pickDates.value = [];
  }
);

watch(
  () => start.value,
  (newValue) => {
    if (currentChartTab.value === "date") {
      end.value = newValue;
    }
  }
);

watch(
  () => startMonth.value,
  (newValue) => {
    if (currentChartTab.value === "month") {
      start.value = `${newValue}-01`;

      const [year, month] = newValue.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      end.value = `${newValue}-${String(lastDay).padStart(2, "0")}`;
    }
  }
);

watch(
  () => startYear.value,
  (newValue) => {
    if (currentChartTab.value === "year") {
      start.value = `${newValue}-01-01`;
      end.value = `${newValue}-12-31`;
    }
  }
);

watch(
  () => currentTab.value,
  (newValue) => {
    switch (newValue) {
      case "dashboard":
        return router.push(mainMenu[0].routeName);
      case "chart-reports":
        return router.push(mainMenu[1].routeName);
    }
  }
);

watch(
  () => route.hash,
  (newValue) => {
    if (newValue.replace("#", "") === dashboardMenu[1].type) {
      currentTab.value = dashboardMenu[1].type;
      document.title = dashboardMenu[1].name;
    } else {
      currentTab.value = dashboardMenu[0].type;
      document.title = dashboardMenu[0].name;
    }
    return;
  }
);



const formatDateTime = () => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short", 
    year: "numeric",
  }).format(new Date());
};

const dateTime = ref(formatDateTime());
let interval;

onMounted(() => {
  interval = setInterval(() => {
    dateTime.value = formatDateTime();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>
