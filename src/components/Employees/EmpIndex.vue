<template>
  <div class="padding-screen-max">
    <div>
      <div class="flex justify-between items-center  capitalize">
        <h2 class="py-2 px-4 border-2 rounded-full capitalize transition-all duration-700 ease-out bg-movaci-main text-white">employee</h2>
        <input
            v-model="searchEmployee"
            type="text"
            placeholder="🔍 Search Employees..."
            class="w-60 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
      </div>
      <LoadingS1 v-if="loading" />
      <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="(emp, index) in filteredEmployees"
        :key="index"
        class="border border-blue-300 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer bg-white"
      >
        <!-- Top Info -->
        <div class="flex justify-between flex-wrap gap-2 mb-2">
          <p>
            <span class="font-semibold">Email:</span>
            <span class="text-gray-700 normal-case">{{ emp.work_email }}</span>
          </p>
          <p>
            <span class="font-semibold">Job:</span> {{ emp.job_title }}
          </p>
        </div>

        <!-- Bottom Info -->
        <div class="flex justify-between flex-wrap gap-2 mb-3">
          <p>
            <span class="font-semibold">Name:</span>
            <span class="normal-case">{{ empFullname(emp) }}</span>
          </p>
          <p>
            <span class="font-semibold">Department:</span>
            {{ shortDepartmentName(emp.department) }}
          </p>
        </div>
          <div class="flex justify-between gap-6" v-if="!inActiveFeature">
            <RouterLink
              :to="{
                name: 'EmployeeTimeSheetDetail',
                params: { code: emp.code },
              }"
            >
              <button class="py-1 px-2 rounded-md bg-blue-300">TimeSheet</button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { API_BASE_URL } from "@/apiConfig";
import LoadingS1 from "../Materials/LoadingS1.vue";
import { fetchApi, setOption } from "@/utils/fechtApi";
import { empFullname, shortDepartmentName } from "@/utils/general";

const loading = ref(true);
const employees = ref(null);
const searchEmployee = ref(null);

const inActiveFeature = ref(false);

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const response = await fetchApi(`${API_BASE_URL}/bhr/employees`, setOption());

    const data = response;
    employees.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

const filteredEmployees = computed(() => {
  if (searchEmployee.value) {
    const searchTerm = searchEmployee.value.toLowerCase();
    return employees.value.filter((employee) => {
      return (
        employee.code?.toLowerCase().includes(searchTerm) ||
        // employee.first_name?.toLowerCase().includes(searchTerm) ||
        employee.last_name?.toLowerCase().includes(searchTerm) ||
        employee.preferred_name?.toLowerCase().includes(searchTerm) ||
        employee.job_title?.toLowerCase().includes(searchTerm) ||
        employee.department?.toLowerCase().includes(searchTerm) ||
        employee.work_email?.toLowerCase().includes(searchTerm)
      );
    });
  } else {
    return employees.value;
  }
});

onMounted(() => {
  fetchEmployees();
});
</script>

<style scoped>
/* Subtle transition animation */
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>