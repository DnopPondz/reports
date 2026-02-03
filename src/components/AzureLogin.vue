<template>
  <div id="login" class="min-h-screen flex justify-center items-center">
    <div
      class="flex flex-col justify-center items-center gap-10 min-h-[300px] min-w-[300px] md:h-[400px] md:w-[500px] p-2 md:p-10 rounded-3xl shadow-xl bg-white border"
    >
      <div class="flex w-full flex-col gap-6 justify-center items-center">
        <CompanyLogo class="py-6 w-[180px]" />

        <div class="w-full">
          <button
            v-if="!loading"
            class="bg-movaci-main w-full py-2 px-6 rounded-3xl text-white hover:bg-mvc-main-hover ease-out duration-100"
            @click="login"
            :disabled="loading"
          >
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>

          <div class="flex items-center justify-center" v-else>
            <h2>Logging in...</h2>
          </div>
        </div>

        <p class="py-2 font-medium text-base text-center text-movaci-main">
          Movaci Timesheet Reporting
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import CompanyLogo from "./Icons/CompanyLogo.vue";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);

const login = async () => {
  loading.value = true;

  // TODO: เปลี่ยนเป็น auth จริงภายหลัง
  // ตัวอย่าง: set token/mock user
  authStore.token = "mock-token";
  authStore.isAuthenticated = true;

  router.push({ name: "DashboardIndex" });
};
</script>
