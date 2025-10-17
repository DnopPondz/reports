<template>
  <div class="padding-screen-max">
    <div class="flex justify-between my-6">
      <button
        class="px-4 py-2 bg-blue-500 font-bold rounded-xl hover:bg-blue-300 text-white hover:text-black"
        @click="goBack"
      >
        Back
      </button>
      <div class="flex gap-2">
        <button
          class="px-4 py-2 bg-green-500 font-bold rounded-xl hover:bg-green-300 text-white hover:text-black capitalize"
          @click="exportDetailToExcel"
        >
          Exports entries
        </button>
        <button
          class="px-4 py-2 bg-green-500 font-bold rounded-xl hover:bg-green-300 text-white hover:text-black capitalize"
          @click="exportToPdf"
        >
          Export pdf
        </button>
        <button
          class="px-4 py-2 bg-green-500 font-bold rounded-xl hover:bg-green-300 text-white hover:text-black capitalize"
          @click="exportToExcel"
        >
          Export excel
        </button>
      </div>
    </div>
    <LoadingS1 v-if="loading" />
    <div v-else>
      <div class="" id="contentToExport">
        <div class="flex justify-between">
          <h1 class="font-bold text-blue-500">
            Project: {{ project?.name }}
            <span class="text-black">- Total Time Used: {{ project?.total_hours }}</span
            ><span class="text-red-500">
              - Convert to Time {{ project?.total_hours_time }}</span
            >
          </h1>
          <input
            type="month"
            v-model="datePick"
            :max="maxMonth"
            @change="handleInputChange"
          />
        </div>
        <div class="my-10" v-if="project?.tasks.length > 0">
          <ul>
            <li
              class="capitalize my-4"
              v-for="(task, index) in project.tasks"
              :key="index"
            >
              <router-link
                :to="{
                  name: 'TaskDetail',
                  params: { taskName: task.name, code: task.code },
                }"
                @click="setTaskAndNavigate(task)"
              >
                <h2>
                  <span class="font-bold">Task</span> {{ task.name }}
                  <span class="normal-case">- hours {{ task.total_hours }} of </span>
                  <span v-if="task.allocated_hours > 0">{{ task.allocated_hours }}</span>
                  <span v-else> Unlimited </span>
                  <span class="text-red-500">
                    - Convert to Time {{ task.total_hours_time }}</span
                  >
                </h2>

                <!-- Progress bar container -->
                <ProgressBar :item="task" :id="`progress-bar-${index + 1}`" />
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, defineOptions, onMounted } from "vue";
import { useTaskStore } from "@/stores/taskStore";
import { useGeneralStore } from "@/stores/generalStore";
import { useRoute, useRouter } from "vue-router";
import { API_BASE_URL } from "@/apiConfig";

import ProgressBar from "../Materials/ProgressBar.vue";

import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { createLogActivities, fetchApi, setOption } from "@/utils/fechtApi";
import LoadingS1 from "../Materials/LoadingS1.vue";
import { formatDateTimeZone } from "@/utils/general";

defineOptions({
  name: "ProjectDetail",
});

const generalStore = useGeneralStore();
const taskStore = useTaskStore();
const route = useRoute();
const router = useRouter();

const { projectCode } = toRefs(route.params);

const project = ref(null);
const loading = ref(true);

const maxMonth = ref(null);

const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const datePick = ref(getCurrentMonth);

const handleInputChange = () => {
  fetchProject();
  handleDateChange();
};

const fetchProject = async () => {
  loading.value = true;

  try {
    const response = await fetchApi(
      `${API_BASE_URL}/reports/project/${projectCode.value}?type=month&month=${datePick.value}-01`,
      setOption()
    );

    const data = response;
    project.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

const setTaskAndNavigate = (task) => {
  taskStore.setTask(task);
  localStorage.setItem("tasks", JSON.stringify(task));
  localStorage.setItem("datePick", JSON.stringify(datePick.value));
};

const handleDateChange = () => {
  generalStore.setPickDate(datePick.value);
};

const goBack = () => {
  router.push({ name: "Projects" });
};

const exportToPdf = () => {
  const totalTasks = project.value?.tasks.length || 0;
  const element = document.getElementById("contentToExport");

  //custom progress.
  updateElement(totalTasks, element, "add");

  const options = {
    margin: 1,
    filename: `${project.value.name}-${datePick.value}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  // Use html2pdf to convert the content to a PDF
  html2pdf()
    .from(element)
    .set(options)
    .save()
    .then(() => {
      updateElement(totalTasks, element, "remove");
      //record log activities
      createLogActivities({
        type: "exports",
        log: "export pdf file in projects",
      });
    })
    .catch((error) => {
      console.error("PDF generation failed:", error);
      updateElement(totalTasks, element, "remove");
    });
};

const updateElement = (totalTasks, element, type) => {
  switch (type) {
    case "add":
      Array.from({ length: totalTasks }).forEach((_, index) => {
        const progressBarElement = element.querySelector(`#progress-bar-${index + 1}`);

        const progressNumberIdElement = progressBarElement.querySelector(
          "#number-percent-id"
        );
        progressNumberIdElement.classList.add("top-[-6px]");
      });
      break;

    case "remove":
      Array.from({ length: totalTasks }).forEach((_, index) => {
        const progressBarElement = element.querySelector(`#progress-bar-${index + 1}`);

        const progressNumberIdElement = progressBarElement.querySelector(
          "#number-percent-id"
        );
        progressNumberIdElement.classList.remove("top-[-6px]");
      });
      break;

    default:
      console.error(`Unknown type: ${type}`);
      break;
  }
};

const exportToExcel = () => {
  const data = [
    {
      Timestamp: `Data at: ${datePick.value}`,
      "Project Name": project.value.name || null,
    },
    ...project.value.tasks.map((task) => ({
      "Task Name": task.name,
      "Total Hours": task.allocated_hours > 0 ? task.total_hours_time : "Unlimited",
      "Total Hours Percent Used": `${task.hourPercent}%`,
    })),
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [{ wch: 18 }, { wch: 25 }, { wch: 26 }, { wch: 13 }, { wch: 25 }];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
  XLSX.writeFile(workbook, `ProjectTasks-${datePick.value}.xlsx`);

  //record log activities
  createLogActivities({
    type: "exports",
    log: "export excel file in projects",
  });
};

const exportDetailToExcel = () => {
  const data = [
    {
      Timestamp: `Data at: ${datePick.value}`,
      "Project Name": project.value.name || null,
    },
    ...project.value.tasks.flatMap((task) => {
      const taskRow = {
        "Task Name": task.name,
        "Total Hours": task.allocated_hours > 0 ? task.total_hours_time : "Unlimited",
        "Total Hours Percent Used": `${task.hourPercent}%`,
      };

      const detailsRows = task.project_infos_task.map((item) => ({
        "Employee Name": `${item.time_sheets?.[0]?.employee?.first_name || ""} ${
          item.time_sheets?.[0]?.employee?.last_name.charAt(0) || ""
        }.`,
        "Clock In":
          formatDateTimeZone(
            item.time_sheets?.[0]?.start,
            item.time_sheets?.[0]?.timezone
          ) || "",
        "Clock Out":
          formatDateTimeZone(
            item.time_sheets?.[0]?.end,
            item.time_sheets?.[0]?.timezone
          ) || "",
        noted: item.time_sheets?.[0]?.note || "",
        hours: item.time_sheets?.[0]?.hours || "",
      }));

      return [taskRow, ...detailsRows];
    }),
  ];

  // console.log("data", data);
  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [
    { wch: 18 },
    { wch: 25 },
    { wch: 26 },
    { wch: 13 },
    { wch: 25 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 100 },
    { wch: 10 },
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
  XLSX.writeFile(workbook, `Project-${datePick.value}.xlsx`);

  //record log activities
  createLogActivities({
    type: "exports",
    log: "export excel entries file in projects",
  });
};

// const setDocumentTitle = (title) => {
//   document.title = title;
// };

onMounted(() => {
  const currentMonth = getCurrentMonth();
  datePick.value = generalStore.getPickDate() || currentMonth;
  handleDateChange();
  maxMonth.value = currentMonth;
  fetchProject();
  // console.log("project", project);

  // setDocumentTitle(`${project.value.name}`);
});

// Watch for changes in the project title if it can change
// watch(
//   () => project.value.name,
//   (newTitle) => {
//     setDocumentTitle(`${newTitle}`);
//   }
// );
</script>

<style scoped>
@keyframes progress-bar-animation {
  from {
    width: 0%;
  }
  to {
    width: var(--progress-width);
  }
}

.progress-bar {
  animation: progress-bar-animation 1.5s ease-in-out;
}
</style>
