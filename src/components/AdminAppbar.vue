<template>
  <div class="flex justify-between items-center px-6 h-20 bg-blue-100">
    <h2 class="font-bold">Movaci Report</h2>
    <ul class="flex flex-row gap-6 flex-wrap">
      <li v-for="(item, index) in menuList" :key="index">
        <RouterLink :to="item.routeName">{{ item.name }} </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { adminMenu } from "@/navList";

const menuList = ref(adminMenu);
</script>
