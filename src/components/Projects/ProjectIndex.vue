<template>
  <div class="padding-screen-max">
    <div class="flex justify-between items-center">
      <h1 class="py-2 px-4 border-2 rounded-full capitalize transition-all duration-700 ease-out bg-movaci-main text-white">All Projects</h1>
      <input
            v-model="searchName"
            type="text"
            placeholder="🔍 Search Projects..."
            class="w-60 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
    </div>
    <LoadingS1 v-if="loading" />
    <div v-else class="h-[75vh] overflow-auto">
      <ul v-if="filteredProjects.length > 0">
        <li
          v-for="(project, index) in filteredProjects"
          :key="index"
          class="font-bold p-2 rounded-xl text-blue-500 hover:bg-blue-300 hover:text-white"
        >
          <router-link
            :to="{
              name: 'ProjectDetail',
              params: { name: project.name, projectCode: project.code },
            }"
          >
            <h2 class="">{{ index + 1 }}.{{ project.name }}</h2>
          </router-link>
        </li>
      </ul>
      <div v-else>Not Found</div>
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
