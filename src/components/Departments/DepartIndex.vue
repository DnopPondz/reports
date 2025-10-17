<template>
  <div class="padding-screen-max">
    <div v-if="!fetureStatus">
      <div class="flex items-center justify-between capitalize">
        <h2 class="font-bold text-3xl">TS departments</h2>
        <input placeholder="Department name" type="text" v-model="searchDepartment" />
      </div>
      <div class="my-2">
        <div v-if="!loadingDepartments">
          <ul>
            <li v-for="(depart, index) in filterDepartments" :key="index">
              <RouterLink
                :to="{
                  name: 'DepartmentDetail',
                  params: { name: depart.department },
                }"
                >{{ depart.department }}</RouterLink
              >
            </li>
          </ul>
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
