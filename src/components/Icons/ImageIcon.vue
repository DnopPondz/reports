<template>
  <img :src="logo" alt="" />
</template>
<script setup>
import { defineProps } from "vue";
defineProps({
  logo: String,
});
</script>
