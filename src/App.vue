<template>
  <div id="app-vue">
    <div class="flex flex-col">
      <div v-if="!isInactive">
        <!-- <MainAppbar class="relative -z-50" v-if="authStore.isAuthenticated" /> -->
        <!-- <AdminAppbar
          v-else-if="
            authStore.isAuthenticated && authStore.userRole === 'admin'
          "
        /> -->
        <div class="flex flex-1" :class="{ 'bg-mvc-lg-1': route.name === 'azureLogin' }">
          <!-- Left Menu -->
          <!-- v-if="authStore.isAuthenticated" -->
          <div
            v-if="authStore.isAuthenticated"
            class="relative transition-transform ease-out transform duration-300 h-screen"
            :class="drawerOpen ? 'translate-x-0' : '-translate-x-full'"
          >
            <DrawerBar
              v-model="drawerOpen"
              class="bg-[#fafcff]"
              :class="drawerOpen ? '' : 'hidden'"
            />
            <div class="absolute top-[6rem] right-[-1.5rem] z-[99] inset-y-0 h-[50px]">
              <button
                @click="toggleDrawer"
                class="py-4 px-1 w-[50px] h-[50px] text-white bg-movaci-main hover:bg-mvc-lg-1 border-2 border-mvc-main-hover hover:border-movaci-main rounded-full shadow-md"
              ></button>
            </div>
          </div>
          <div class="w-full">
            <MainAppbar class="relative -z-50" v-if="authStore.isAuthenticated" />
            <!-- <div class="padding-screen-max"> -->
            <router-view class="py-6"></router-view>
            <!-- </div> -->
          </div>
        </div>
      </div>
      <div
        v-else
        class="min-h-screen flex justify-center items-center"
        :class="{ 'bg-mvc-lg-1': route.name === 'azureLogin' }"
      >
        <div
          class="flex flex-col justify-center items-center gap-10 min-h-[300px] min-w-[300px] md:h-[400px] md:w-[500px] p-2 md:p-10 rounded-3xl shadow-xl bg-white border"
        >
          <ImageIcon :logo="imageFile" class="py-4 w-[100px] h-[100px]" />
          <!-- <p class="py-2">ZZZzzz... (Sleep screen when inActive 10 minutes)</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";
// eslint-disable-next-line no-unused-vars
import MainAppbar from "./components/MainAppbar.vue";
// import AdminAppbar from "./components/AdminAppbar.vue";
import DrawerBar from "./components/DrawerBar.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ImageIcon from "./components/Icons/ImageIcon.vue";
// import CompanyLogo from "./components/Icons/CompanyLogo.vue";
import imageFile from "@/assets/time_clock.svg";

const route = useRoute();

const authStore = useAuthStore();

const drawerOpen = ref(true);

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

const isInactive = ref(false);
let inactivityTimeout;
let logoutTimeout;

const resetInactivityTimeout = async () => {
  const routerLogin = route?.name === "azureLogin" || route?.name === undefined;

  if (!routerLogin) {
    isInactive.value = false;
    starSleepTimer();
    startLogoutTimer();
  }
};

const starSleepTimer = () => {
  clearTimeout(inactivityTimeout);

  inactivityTimeout = setTimeout(() => {
    isInactive.value = true;
  }, 60000000);
}; // Set a new timeout for 10 minutes (600000 ms)

const startLogoutTimer = () => {
  clearTimeout(logoutTimeout);

  // Set a logout timeout for 15 minutes (900000 ms)
  logoutTimeout = setTimeout(async () => {
    await authStore.logout();
    window.location.reload();
  }, 900000); // 15 minutes
};

// eslint-disable-next-line no-unused-vars
const setupActivityListeners = () => {
  window.addEventListener("mousemove", resetInactivityTimeout);
  window.addEventListener("keydown", resetInactivityTimeout);
  window.addEventListener("click", resetInactivityTimeout);
};

// eslint-disable-next-line no-unused-vars
const cleanupActivityListeners = () => {
  window.removeEventListener("mousemove", resetInactivityTimeout);
  window.removeEventListener("keydown", resetInactivityTimeout);
  window.removeEventListener("click", resetInactivityTimeout);
};

//uncomment on production.
onMounted(() => {
  resetInactivityTimeout();
  setupActivityListeners();
});

onBeforeUnmount(() => {
  cleanupActivityListeners();
});
</script>
