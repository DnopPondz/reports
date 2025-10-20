<template>
  <div class="padding-screen-max">
    <div v-if="!fetureStatus">
      <div class="flex items-center justify-between capitalize">
        <h2 class="py-2 px-4 border-2 rounded-full capitalize transition-all duration-700 ease-out bg-movaci-main text-white">TS departments</h2>
        <input
            v-model="searchDepartment"
            type="text"
            placeholder="🔍 Search Dapartments..."
            class="w-60 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
      </div>
      <div class="mt-8">
        <div v-if="!loadingDepartments">
          <ul class="grid gap-4">
            <li
              v-for="(depart, index) in filterDepartments"
              :key="index"
              class="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex items-center justify-between group"
            >
              <div class="flex items-center gap-3">
                <RouterLink
                  :to="{
                    name: 'DepartmentDetail',
                    params: { name: depart.department },
                  }"
                  class="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition"
                >
                  {{ depart.department }}
                </RouterLink>
              </div>

              <!-- Icon -->
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

          <!-- Empty state -->
          <div
            v-if="filterDepartments.length === 0"
            class="text-center py-20 text-gray-400"
          >
            ❌ Department Not  found.
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
    console.log("error");
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
