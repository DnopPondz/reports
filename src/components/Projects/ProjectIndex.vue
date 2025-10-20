<template>
  <div class="padding-screen-max">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1
        class="py-2 px-4 border-2 rounded-full capitalize transition-all duration-700 ease-out bg-movaci-main text-white"
      >
        All Projects
      </h1>

      <input
        v-model="searchName"
        type="text"
        placeholder="🔍 Search Projects..."
        class="w-60 px-5 py-2 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
      />
    </div>

    <LoadingS1 v-if="loading" />

    <!-- Project List -->
    <div v-else>
      <ul v-if="paginatedProjects.length > 0" class="space-y-4">
        <li
          v-for="(project, index) in paginatedProjects"
          :key="index"
          class="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group flex justify-between items-center"
        >
          <router-link
            :to="{
              name: 'ProjectDetail',
              params: { name: project.name, projectCode: project.code },
            }"
            class="flex-1"
          >
            <h2
              class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors"
            >
              {{ index + 1 + (currentPage - 1) * perPage }}.
               - {{ project.name }}
            </h2>
          </router-link>

          <divZZ
            class="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur-[1px] -z-10"
          ></divZZ>
        </li>
      </ul>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-[50vh] text-gray-400 text-lg"
      >
        <p>🔎 No projects found</p>
      </div>

      <!-- Pagination Controls -->
      <div
        class="flex items-center justify-center gap-4 mt-10"
        v-if="totalPages > 1"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-5 py-2 rounded-full border font-semibold transition-all duration-300"
          :class="
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-400'
          "
        >
          ← Previous
        </button>

        <span class="font-semibold text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-5 py-2 rounded-full border font-semibold transition-all duration-300"
          :class="
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-400'
          "
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineOptions } from "vue";
import { API_BASE_URL } from "@/apiConfig";
import { fetchApi, setOption } from "@/utils/fechtApi";
import LoadingS1 from "../Materials/LoadingS1.vue";

defineOptions({ name: "Projects" });

// 📊 State
const projects = ref([]);
const loading = ref(true);
const searchName = ref("");
const currentPage = ref(1);
const perPage = 13;

// 📡 Fetch data from backend
const fetchProjects = async () => {
  loading.value = true;
  try {
    const response = await fetchApi(
      `${API_BASE_URL}/bhr/projects`,
      setOption()
    );
    projects.value = response || [];
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
});

// 🔍 Filtered projects
const filteredProjects = computed(() => {
  if (searchName.value) {
    return projects.value.filter((project) =>
      project?.name?.toLowerCase().includes(searchName.value.toLowerCase())
    );
  }
  return projects.value;
});

// 📄 Pagination
const totalPages = computed(() =>
  Math.ceil(filteredProjects.value.length / perPage)
);

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return filteredProjects.value.slice(start, end);
});

// ⏩ Controls
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>
