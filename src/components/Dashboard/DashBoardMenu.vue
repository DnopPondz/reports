<template>
  <div class="padding-screen-max">
    <ul class="flex flex-row gap-1">
      <li
        class="py-2 px-4 border-2 rounded-full capitalize transition-all duration-700 ease-out"
        v-for="(item, index) in dataMenu"
        :key="index"
        :class="{
          'bg-movaci-main text-white': isActive(item.type),
          'bg-white text-black': !isActive(item.type),
          hidden: !showListMenu && !isActive(item.type),
        }"
        @click="updateCurrentTab(item.type)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  dataMenu: {
    type: Array,
    require: true,
  },
  currentTab: {
    type: String,
    default: null,
  },
  showListMenu: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:currentTab"]);

const updateCurrentTab = (type) => {
  emit("update:currentTab", type);
};

const isActive = (type) => {
  return props.currentTab === type;
};
</script>
