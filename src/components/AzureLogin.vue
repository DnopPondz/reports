<template>
  <div id="azure-login" class="min-h-screen flex justify-center items-center">
    <div
      class="flex flex-col justify-center items-center gap-10 min-h-[300px] min-w-[300px] md:h-[400px] md:w-[500px] p-2 md:p-10 rounded-3xl shadow-xl bg-white border"
    >
      <div class="flex w-full flex-col gap-6 justify-center items-center">
        <CompanyLogo class="py-6 w-[180px]" />

        <div class="w-full">
          <button
            v-if="!loadingToken"
            class="bg-movaci-main w-full py-2 px-6 rounded-3xl text-white hover:bg-mvc-main-hover ease-out duration-100"
            @click="login"
            :disabled="loadingLogin"
          >
            <span v-if="loadingLogin">Logging in...</span>
            <span v-else>Login</span>
          </button>
          <div class="flex items-center justify-center" v-else>
            <h2>Verifying User...</h2>
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
import { redirectToAzure } from "@/services/AzureAuthService";

import { useAuthStore } from "@/stores/authStore";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import CompanyLogo from "./Icons/CompanyLogo.vue";

const router = useRouter();
// eslint-disable-next-line no-unused-vars
const route = useRoute();
const authStore = useAuthStore();

const loadingLogin = ref(false);
const loadingToken = ref(false);

const login = () => {
  loadingLogin.value = true;
  redirectToAzure();
};

const processCallback = async () => {
  loadingToken.value = true;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  // Call the API to authenticate with Azure
  await authStore.authenticateWithAzureV2(code);

  // Check if the token is set before redirecting
  if (authStore.token) {
    router.push({ name: "DashboardIndex" });
  } else {
    console.error("Authentication failed. No token found.");
    router.push({ name: "azureLogin" });
  }
  setTimeout(() => {
    loadingToken.value = false;
  }, 1000);
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const hasCode = urlParams.has("code");
  // const hasToken = urlParams.has("token");
  if (window.location.pathname === "/auth/callback" || hasCode) {
    processCallback();
  }
});
</script>
