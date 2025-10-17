<template>
  <div class="max-h-[150px] w-full overflow-auto mt-6">
    <ul>
      <li
        class="font-normal text-sm py-1"
        v-for="(item, index) in EmpListDisplay"
        :key="index"
      >
        <RouterLink
          :to="{
            name: 'EmployeeTimeSheetDetail',
            params: { code: item.code },
          }"
        >
          {{ empFullname(item) }} | {{ shortDepartmentName(item.department) }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { empFullname, shortDepartmentName } from "@/utils/general";
import { defineProps } from "vue";
defineProps({
  EmpListDisplay: {
    type: Array,
    require: true,
  },
});
</script>
