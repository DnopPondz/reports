<template>
  <div class="padding-screen-max bg-slate-50 min-h-full py-6">
    <div
      class="flex flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] backdrop-blur"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1
          class="py-3 px-6 rounded-full bg-gradient-to-r from-movaci-main to-blue-600 text-white text-lg font-semibold tracking-wide shadow-lg shadow-blue-500/30"
        >
          All Projects
        </h1>
        <div class="relative w-full md:w-72">
          <input
            v-model="searchName"
            type="text"
            placeholder="🔍 Search Projects..."
            class="w-full rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-medium text-slate-600 shadow-inner shadow-slate-200 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
      <LoadingS1 v-if="loading" />
      <div v-else class="mt-2 h-[70vh] overflow-y-auto">
        <div
          class="hidden rounded-2xl bg-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid md:grid-cols-[90px_1fr]"
        >
          <span>No.</span>
          <span>Project Name</span>
        </div>
        <ul v-if="filteredProjects.length > 0" class="mt-4 space-y-4">
          <li
            v-for="(project, index) in filteredProjects"
            :key="index"
            class="group relative cursor-pointer rounded-3xl border border-slate-200 bg-white/90 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:border-transparent hover:shadow-[0_40px_80px_-45px_rgba(37,99,235,0.75)]"
          >
            <router-link
              :to="{
                name: 'ProjectDetail',
                params: { name: project.name, projectCode: project.code },
              }"
              class="flex items-center gap-4 rounded-3xl px-5 py-4 text-slate-600 transition-colors duration-300 group-hover:text-white md:grid md:grid-cols-[90px_1fr]"
            >
              <span
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-base font-semibold text-slate-500 transition-all duration-300 group-hover:bg-white/20 group-hover:text-white group-hover:shadow-inner"
              >
                {{ (index + 1).toString().padStart(2, "0") }}
              </span>
              <h2
                class="text-base font-semibold tracking-wide transition-colors duration-300 group-hover:text-white"
              >
                {{ project.name }}
              </h2>
              <div
                class="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-0 transition-all duration-300 group-hover:opacity-100"
                style="background: radial-gradient(circle at top, rgba(59,130,246,0.35), rgba(59,130,246,0));"
              ></div>
              <div
                class="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 opacity-0 blur-0 transition-all duration-300 group-hover:opacity-100 group-hover:blur"
              ></div>
            </router-link>
          </li>
        </ul>
        <div
          v-else
          class="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white/80 py-10 text-center text-sm font-semibold text-slate-400"
        >
          Not Found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineOptions, onMounted, computed } from "vue";
import { API_BASE_URL } from "@/apiConfig";
import { fetchApi, setOption } from "@/utils/fechtApi";
import LoadingS1 from "../Materials/LoadingS1.vue";

// Define the component name
defineOptions({
  name: "Projects",
});

const projects = ref([]);
const loading = ref(true);
const searchName = ref(null);

const fetchProjects = async () => {
  loading.value = true;

  try {
    const response = await fetchApi(`${API_BASE_URL}/bhr/projects`, setOption());

    const data = response;
    projects.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

const filteredProjects = computed(() => {
  if (searchName.value && projects.value.length > 0) {
    return projects.value.filter((project) =>
      project?.name.toLowerCase().includes(searchName?.value.toLowerCase())
    );
  } else {
    return projects.value;
  }
});
onMounted(() => {
  fetchProjects();
});
</script>
