<template>
  <div class="flex flex-col gap-2 padding-screen-max">
    <div class="p-2 flex items-center justify-between">
      <p class="capitalize">start: {{ start }} end: {{ end }}</p>
      <button
        class="capitalize rounded-md bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
        @click="exportPDF()"
      >
        exports
      </button>
    </div>

    <div v-if="!loadingChart">
      <Bar
        :id="`chart-id-${keyIndex}`"
        class="w-full h-[600px] overflow-x-auto"
        :options="chartOptions"
        :data="chartData"
      />
      <ModalReport
        v-model="showModal"
        :title="modalReport.title"
        :date="modalReport.date"
        :modalReport="modalReport.data"
        @getProjectSelectBarChart="fetchProjectSelectBarChart"
        :loadingSelectChart="loadingSelectChart"
      />
    </div>
    <LoadingS1 v-else />
  </div>
</template>
<script setup>
import { ref, computed, defineProps, watch, watchEffect } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
// eslint-disable-next-line no-unused-vars
import { createLogActivities, fetchApi, setOption } from "@/utils/fechtApi";
import { API_BASE_URL } from "@/apiConfig";
import { chartsMenu } from "@/navList";
import LoadingS1 from "../Materials/LoadingS1.vue";
import html2pdf from "html2pdf.js";
import { formatYMD } from "@/utils/general";
import ModalReport from "../Materials/ModalReport.vue";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  currentTab: {
    type: String,
    default: "",
  },
  start: {
    type: String,
    default: "",
  },
  end: {
    type: String,
    default: "",
  },
  projectSelected: {
    type: Array,
  },
  currentType: {
    type: String,
    default: null,
  },
  keyIndex: {
    type: Number,
    default: 1,
  },
});

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const loadingChart = ref(false);
const projectsReporting = ref([]);
const showModal = ref(false);
const modalReport = ref({
  title: "",
  date: null,
  data: [],
});
const dateBarChartPicked = ref(null);
const projectCodeBarChartPicked = ref(null);
const projectNameBarChartPicked = ref(null);

const loadingSelectChart = ref(false);

const barColors = ref(["#42A4F541", "#51F54238", "#8142F541", "#F5A1423B", "#F025402D"]);
const barColorsBorder = ref([
  "#42A5F5",
  "#51F542FF",
  "#8142F5FF",
  "#F5A142FF",
  "#F02540FF",
]);

const listDate = computed(() => {
  const dateRange = getDateRange(props.start, props.end);

  const dates = [];
  if (props.currentTab === "customizev2" && props.currentType !== "date") {
    if (props.currentType === "year") {
      for (let i = 0; i < dateRange.length; i++) {
        dates.push(dateRange[i]);
      }
    } else if (props.currentType === "month") {
      const startDate = new Date(props.start);
      const endDate = new Date(props.end);
      while (startDate <= endDate) {
        dates.push(
          startDate.toLocaleString("en-US", { month: "short", year: "numeric" })
        );
        startDate.setMonth(startDate.getMonth() + 1);
      }
    }
  } else {
    for (let i = 0; i < dateRange.length; i++) {
      const date = new Date(dateRange[i]);
      dates.push(
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }
  }
  // return dates.reverse();
  // console.log("listDate", dates);

  return dates;
});

const chartData = computed(() => ({
  labels: listDate.value,
  datasets: projectsReporting.value,
}));

const chartOptions = ref({
  responsive: false,
  maintainAspectRatio: false,
  onClick(event, elements) {
    if (elements.length > 0) {
      const labelIndex = elements[0].datasetIndex;
      const valueIndex = elements[0]?.index;
      // const hours = elements[0]?.element?.$context?.raw;
      // const start = props.start;
      // const end = props.end;
      const datePickedRaw = listDate.value[valueIndex];
      const datePicked = getDateRange(datePickedRaw, datePickedRaw);
      // console.log("datePicked", datePicked);

      dateBarChartPicked.value = formatYMD(datePicked);

      projectCodeBarChartPicked.value = projectsReporting.value[labelIndex].code;
      projectNameBarChartPicked.value = projectsReporting.value[labelIndex].label;

      // console.log("index", valueIndex);
      // console.log("projectsReporting", project_code);
      // console.log("datePicked", dateFormat);
      // console.log("hours select", hours);

      // fetchProjectSelectBarChart(dateFormat, project_code);
      showModal.value = true;
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const decimalHours = context.raw;
          return `${context.dataset.label}: ${decimalHours} hrs`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

const fetchProjectSelectBarChart = async () => {
  loadingSelectChart.value = true;
  const type = checkType();
  try {
    const url = `${API_BASE_URL}/dashboard/projects-departments?type=${type}&currentType=${props.currentType}&date=${dateBarChartPicked.value}&code=${projectCodeBarChartPicked.value}`;
    const response = await fetchApi(url, setOption());
    const data = response?.data;

    modalReport.value = {
      title: projectNameBarChartPicked.value,
      date: dateBarChartPicked.value,
      data: data,
    };
  } catch (error) {
    console.error("error");
  } finally {
    loadingSelectChart.value = false;
  }
};

function getDateRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const currentType = props.currentType;

  const dateRange = [];
  if (startDate > endDate) {
    return [];
  }

  const type = checkType();
  if (type === "year") {
    const startYear = new Date(startDate.getFullYear(), 1, 1);
    const endYear = new Date(endDate.getFullYear(), 12, 1);

    for (let d = new Date(startYear); d <= endYear; d.setMonth(d.getMonth() + 1)) {
      dateRange.push(new Date(d).toISOString().slice(0, 7));
    }
  } else if (type === "customizev2" && currentType !== "date") {
    if (currentType === "year") {
      for (let year = start; year <= end; year++) {
        dateRange.push(year);
      }
    } else if (currentType === "month") {
      const startMonth = new Date(props.start).getMonth() + 1;
      const endMonth = new Date(props.end).getMonth() + 1;

      for (let month = startMonth; month <= endMonth; month++) {
        dateRange.push(month);
      }
    }
  } else {
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateRange.push(new Date(d));
    }
  }

  return dateRange;
}

function checkType() {
  const type = chartsMenu.find((item) => {
    return item.type === props.currentTab;
  })?.type;

  return type;
}

const currentQuery = computed(() => {
  const type = checkType();

  switch (type) {
    case "date":
      return `start=${props.start}&end=${props.start}`;
    case "month":
      return `type=${type}&month=${props.start}`;
    case "year":
      return `type=${type}&year=${props.start}`;
    case "customize":
      return `type=${type}&start=${props.start}&end=${props.end}`;
    case "customizev2":
      return `type=${type}&currentType=${props.currentType}&start=${props.start}&end=${props.end}`;
    default:
      return null;
  }
});

// eslint-disable-next-line no-unused-vars
const getProjectsReporting = async () => {
  loadingChart.value = true;
  projectsReporting.value = [];
  const select = props.projectSelected;

  try {
    if (Array.isArray(select) && select.length > 0) {
      const formData = new FormData();
      select.forEach((id) => {
        formData.append("projects[]", id);
      });

      const queryParams = new URLSearchParams(formData).toString();

      const url = new URL(
        `${API_BASE_URL}/dashboard/projects-reporting?${currentQuery.value}&${queryParams}`
      );
      const response = await fetchApi(url, setOption());

      if (response?.data.length > 0) {
        const data = response.data;

        data.map(async (item, index) => {
          let stackDates = [];
          let stackDateValue = [];
          if (item.list) {
            Object.entries(item.list).forEach(([key, value]) => {
              // console.log("element key:", key, "element value:", value);
              stackDates.push(key);
              stackDateValue.push(replaceColonWithPeriod(value));
            });
          }

          projectsReporting.value.push({
            label: item.project_name,
            code: item.project_code,
            backgroundColor: barColors.value[index % barColors.value.length],
            borderColor: barColorsBorder.value[index % barColors.value.length],
            borderWidth: 1,
            data: stackDateValue,
            fill: true,
          });
        });
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    loadingChart.value = false;
  }
};

function replaceColonWithPeriod(time) {
  const fixedDecimal = Number(time).toFixed(2);
  // console.log("test", fixedDecimal);
  const timeStr = fixedDecimal.toString();

  return timeStr.includes(":") ? timeStr.replace(":", ".") : timeStr;
}

async function exportPDF() {
  const element = document.getElementById(`chart-id-${props.keyIndex}`);

  const options = {
    margin: 1,
    filename: `chart-report-${props.start}-${props.end}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  try {
    await html2pdf().from(element).set(options).save();
    //record log activities
    createLogActivities({
      type: "exports",
      log: `export pdf file in chart-reports: Tab :${props.currentTab}, Type :${props.currentType}`,
    });
    console.log("PDF generated successfully");
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
}

watch(
  () => props.start,
  (newValue) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.start = newValue;
  }
);

watch(
  () => props.end,
  (newValue) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.end = newValue;
  }
);

// watch(
//   () => props.projectSelected,
//   (newValue) => {
//     if (newValue) {
//       getProjectsReporting();
//     }
//   }
// );

watchEffect(() => {
  // This will automatically re-run when props.currentTab changes
  // console.log("props.currentTab", props.currentTab);

  if (props.currentTab) {
    getProjectsReporting();
  }
});
</script>
