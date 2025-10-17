<template>
  <div id="login" class="min-h-screen flex justify-center items-center bg-mvc-lg-1">
    <div
      class="flex flex-col justify-center items-center gap-8 min-h-[320px] min-w-[320px] md:h-[420px] md:w-[520px] p-4 md:p-10 rounded-3xl shadow-xl bg-white border"
    >
      <CompanyLogo class="py-6 w-[180px]" />
      <form class="w-full flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-sm text-movaci-main" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="username"
            required
            class="w-full border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-movaci-main"
            placeholder="you@example.com"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-sm text-movaci-main" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-movaci-main"
            placeholder="Enter your password"
          />
        </div>
        <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>
        <button
          type="submit"
          class="bg-movaci-main w-full py-2 px-6 rounded-3xl text-white hover:bg-mvc-main-hover ease-out duration-100 disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import CompanyLogo from "./Icons/CompanyLogo.vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push({ name: "DashboardIndex" });
  }
});

const handleSubmit = async () => {
  if (loading.value) {
    return;
  }

  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await authStore.loginWithCredentials({
      email: email.value,
      password: password.value,
    });

    if (response?.success) {
      router.push({ name: "DashboardIndex" });
    } else {
      errorMessage.value =
        response?.message || "Unable to login. Please check your credentials.";
    }
  } catch (error) {
    errorMessage.value = "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
