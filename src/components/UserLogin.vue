<template>
  <div id="login" class="min-h-screen flex justify-center items-center bg-mvc-lg-1">
    <div
      class="flex flex-col justify-center items-center gap-8 min-h-[320px] min-w-[320px] md:h-[420px] md:w-[520px] p-4 md:p-10 rounded-3xl shadow-xl bg-white border"
    >
      <CompanyLogo class="py-6 w-[180px]" />
      <div class="w-full flex flex-col gap-6">
        <p class="text-center text-movaci-main text-base">
          Access the dashboard instantly — no account required.
        </p>
        <button
          type="button"
          class="bg-movaci-main w-full py-3 px-6 rounded-3xl text-white text-lg font-semibold hover:bg-mvc-main-hover ease-out duration-100"
          @click="handleSubmit"
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import CompanyLogo from "./Icons/CompanyLogo.vue";

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push({ name: "DashboardIndex" });
  }
});

const handleSubmit = () => {
  authStore.setToken("demo-token");
  authStore.login();
  authStore.setEmploee({
    last_name: "Demo User",
    job_title: "Guest",
    work_email: "demo@movaci.com",
  });

  router.push({ name: "DashboardIndex" });
};
</script>
