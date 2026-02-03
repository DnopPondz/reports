<template>
  <div class="padding-screen-max">
    <div v-if="!fetureStatus">
      <div class="flex items-center justify-between capitalize">
        <h2
          class="py-2 px-4 border-2 rounded-full capitalize transition-all duration-700 ease-out bg-movaci-main text-white"
        >
          TS departments
        </h2>

        <input
          v-model="searchDepartment"
          type="text"
          placeholder="🔍 Search Departments..."
          class="w-60 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      <div class="mt-8">
        <div v-if="!loadingDepartments">
          <ul class="grid gap-4">
            <li
              v-for="(depart, index) in filterDepartments"
              :key="index"
              class="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
            >
            <div
            class="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur-[1px] -z-10"
          ></div>
              <div class="flex items-center gap-3 ">
                <RouterLink
                  :to="{
                    name: 'DepartmentDetail',
                    params: { name: depart.department },
                  }"
                  class="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors"
                >
                  {{ depart.department }}
                </RouterLink>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
          </ul>

          <div v-if="filterDepartments.length === 0" class="text-center py-20 text-gray-400">
            ❌ Department Not found.
          </div>
        </div>

        <LoadingS1 v-else />
      </div>
    </div>

    <div v-else class="flex justify-center items-center h-[400px]">
      <p class="capitalize font-bold text-5xl">Coming soon</p>
    </div>
  </div>
</template>

<script setup>
import { API_BASE_URL } from "@/apiConfig";
import { fetchApi, setOption } from "@/utils/fechtApi";
import { ref, onMounted, computed } from "vue";

import LoadingS1 from "../Materials/LoadingS1.vue";

const fetureStatus = ref(false);
const loadingDepartments = ref(true);
const departments = ref([]);
const searchDepartment = ref(null);

const fetchDepartments = async () => {
  loadingDepartments.value = true;
  try {
    const url = `${API_BASE_URL}/bhr/ts-departments`;
    const response = await fetchApi(url, setOption());
    if (response.data) {
      departments.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
  } finally {
    loadingDepartments.value = false;
  }
};

const filterDepartments = computed(() => {
  const query = searchDepartment.value?.toLowerCase();
  if (query) {
    return departments.value.filter((item) =>
      item.department?.toLowerCase().includes(query)
    );
  } else {
    return departments.value;
  }
});

onMounted(() => {
  if (!fetureStatus.value) {
    fetchDepartments();
  }
});
</script>

<style scoped>
/* Optional subtle hover animation */
.group:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
