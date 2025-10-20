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
          class="shadow-md p-4 border-2 border-gray-200 rounded-lg my-4"
          v-if="currentTab === dashboardMenu[1].type"
        >
          <h2 class="mt-4">Please Select Type Reports :</h2>
          <DashBoardMenu
            id="chart-menu"
            class="mt-2"
            v-model:currentTab="currentChartTab"
            :dataMenu="chartsMenu"
          />
          <div
            class="p-2 shadow-md border-2 border-blue-200 rounded-lg my-4"
            v-if="currentChartTab !== 'customizev2'"
          >
            <div id="select-date">
              <div class="max-w-[300px]">
                <div class="px-4 py-2" v-if="currentChartTab === 'date'">
                  <InputDateComponent
                    labelTitle="Select Date"
                    v-model="start"
                    :maxDate="maxDate"
                    type="date"
                  />
                </div>
                <div class="px-4 py-2" v-if="currentChartTab === 'month'">
                  <InputDateComponent
                    labelTitle="Select Month"
                    v-model="startMonth"
                    :maxDate="maxDate"
                    type="month"
                  />
                </div>
                <div
                  v-if="currentChartTab === 'year'"
                  class="flex flex-col space-y-4 w-full mx-auto px-4 py-2"
                >
                  <InputDateComponent
                    labelTitle="Select Year"
                    v-model="startYear"
                    :maxDate="maxDate"
                    :years="years"
                    type="year"
                  />
                </div>
              </div>
            </div>
            <div class="flex justify-between" id="select-project">
              <div class="relative z-50 w-auto px-4 py-2">
                <input
                  class="rounded-lg border active:ring-green-300 p-2"
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search projects..."
                />

                <ul
                  v-if="compuFilterProjects.length"
                  class="p-0 list-none mt-[5px] border border-[#ddd] max-h-[150px] overflow-y-auto"
                >
                  <li
                    v-for="project in compuFilterProjects"
                    :key="project.id"
                    @click="selectProject(project)"
                    class="p-2 cursor-pointer hover:bg-[#f0f0f0]"
                  >
                    {{ project.name }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="currentChartTab !== 'customizev2'" class="p-2">
              <h4 class="capitalize px-4 py-2 font-bold text-2xl">Project list :</h4>
              <p
                class="flex justify-between gap-2 border-b-2 border-blue-200"
                v-for="(item, index) in projectPickers"
                :key="index"
              >
                {{ item.name }}
                <button @click="removeProject(item.id)">x</button>
              </p>
            </div>
            <div>
              <div class="flex justify-end items-center" id="search-chart-report">
                <button
                  class="bg-green-300 p-2 rounded-lg capitalize"
                  @click="searchProjectSelect()"
                >
                  search
                </button>
              </div>
            </div>

            <template v-if="currentChartTab !== 'customizev2'">
              <div v-if="projectSelected?.length > 0">
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
            <!-- <h2>v2</h2> -->

            <template v-for="(item, index) in customList" :key="index">
              <div
                class="flex flex-col shadow-md p-4 border-2 border-blue-200 rounded-lg my-4"
              >
                <!-- {{ item }} -->
                <div class="flex justify-between">
                  <div class="flex gap-2">
                    <div class="p-2">
                      <div class="flex flex-col items-center justify-center">
                        <label class="block text-gray-700 font-medium capitalize"
                          >select type:</label
                        >
                        <select
                          v-model="item.currentType"
                          @input="clearCustomSelect(item.id)"
                          class="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    </div>
                    <div id="select-date" class="py-2">
                      <div
                        class="flex items-center justify-center gap-2"
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
                        class="flex items-center justify-center gap-2"
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
                        class="flex items-center justify-center gap-2"
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
                  <button @click="removeCustomList(item.id)">x</button>
                </div>

                <div class="flex justify-between" id="select-project">
                  <div class="relative z-50">
                    <input
                      class="rounded-lg border active:ring-green-300 p-2"
                      type="text"
                      v-model="searchQuery"
                      placeholder="Search projects..."
                    />

                    <ul
                      v-if="compuFilterProjects.length"
                      class="p-0 list-none mt-[5px] border border-[#ddd] max-h-[150px] overflow-y-auto"
                    >
                      <li
                        v-for="project in compuFilterProjects"
                        :key="project.id"
                        @click="selectProject(project, 'custom', item.id)"
                        class="p-2 cursor-pointer hover:bg-[#f0f0f0]"
                      >
                        {{ project.name }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div id="projects-list " class="px-4 py-2">
                  <h4 class="capitalize px-4 py-2 font-bold text-2xl">Project list :</h4>
                  <p
                    class="flex justify-between gap-2 border-b-2 border-blue-200"
                    v-for="(project, index) in item.projectList"
                    :key="index"
                  >
                    {{ project.name }}
                    <button @click="removeProject(project.id, item.id)">x</button>
                  </p>
                </div>
                <div>
                  <div class="flex items-center justify-end" id="search-chart-report">
                    <button
                      class="bg-green-300 p-2 rounded-lg capitalize"
                      @click="searchProjectSelect(item.id)"
                    >
                      search
                    </button>
                  </div>
                </div>
                <div v-if="item.projectSelected?.length > 0">
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
            <div>
              <button
                class="bg-blue-300 capitalize border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[50px] min-w-[100px]"
                @click="addForm"
              >
                create form
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
