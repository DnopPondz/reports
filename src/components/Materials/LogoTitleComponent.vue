<template>
  <div class="flex flex-col justify-center items-center py-8 gap-2">
    <ImageIcon :logo="logo" class="max-w-[150px]" />
    <!-- <h2 class="font-bold text-base text-white">
      Timesheet Reporting System
    </h2> -->
  </div>
</template>
<script setup>
import ImageIcon from "../Icons/ImageIcon.vue";
import logo from "@/assets/logo-bar.png";
</script>
