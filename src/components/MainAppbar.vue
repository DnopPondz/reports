<template>
  <div class="flex justify-end items-center px-6 h-[80px] bg-blue-100 relative z-50">
    <!-- <LogoTitleComponent class="py-4 flex gap-2 justify-center items-center" /> -->
    <div class="flex flex-row flex-wrap justify-center items-center">
      <!-- <li v-for="(item, index) in menuList" :key="index">
        <RouterLink :to="item.routeName">{{ item.name }} </RouterLink>
      </li> -->
      <div class="py-2 px-8 rounded-l-full bg-white">
        <p class="font-medium">{{ emp?.email }}</p>
      </div>
      <div class="py-2 px-8 rounded-r-full bg-movaci-main hover:bg-mvc-main-hover">
        <button class="capitalize text-white bg-blue" @click="handleLogout">
          logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { mainMenu } from "@/navList";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
// import LogoTitleComponent from "./Materials/LogoTitleComponent.vue";
const router = useRouter();

// eslint-disable-next-line no-unused-vars
const menuList = ref(mainMenu);
const authStore = useAuthStore();

let parsedEmployee = {};
try {
  parsedEmployee = authStore.employee ? authStore.employee : {};
} catch (error) {
  console.error("Error parsing employee data");
}

const emp = ref(parsedEmployee);

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
