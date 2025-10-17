<template>
  <div class="padding-screen-max">
    <div>
      <div class="flex justify-between items-center p-4 capitalize">
        <h2 class="font-bold text-blue-500">employee</h2>
        <input type="text" v-model="searchEmployee" placeholder="Search Employee..." />
      </div>
      <LoadingS1 v-if="loading" />
      <div v-else>
        <div
          class="border-2 border-blue-300 rounded-xl p-4 m-2 capitalize w-full"
          v-for="(emp, index) in filteredEmployees"
          :key="index"
        >
          <div class="flex justify-between gap-6 hover:cursor-pointer">
            <!-- <p><span class="font-bold">code: </span>{{ emp.code }}</p> -->
            <p class="">
              <span class="font-bold">email: </span>
              <span class="normal-case">{{ emp.work_email }}</span>
            </p>
            <p><span class="font-bold">JOB: </span>{{ emp.job_title }}</p>
          </div>
          <div class="flex justify-between gap-6">
            <p>
              <span class="font-bold">name: </span>
              <span class="normal-case"> {{ empFullname(emp) }} </span>
            </p>

            <p>
              <span class="font-bold">Department: </span
              >{{ shortDepartmentName(emp.department) }}
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
