<template>
  <div class="h-screen">
    <h2 class="font-bold text-3xl py-4">log user</h2>
    <div v-if="!loadingLog">
      <ul class="h-[70vh] overflow-auto">
        <li class="border p-2 rounded-xl my-2" v-for="(item, index) in logs" :key="index">
          <div class="flex justify-between">
            <h4 class="font-bold text-xl">
              DateTime at :{{
                formatDateTimeZone(item.created_at, "Asia/Bangkok") ?? null
              }}
            </h4>
            <p>By{{ empFullname(item) }}</p>
          </div>
          <h2>ip:{{ item.ip_address }}</h2>
          <p>type:{{ item.type }}</p>
          <p>log:{{ item.log }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <LoadingS1 />
    </div>
  </div>
</template>
<script setup>
import { API_BASE_URL } from "@/apiConfig";
import { fetchApi, setOption } from "@/utils/fechtApi";
import { empFullname, formatDateTimeZone } from "@/utils/general";
import { ref, onMounted } from "vue";
import LoadingS1 from "../Materials/LoadingS1.vue";
const logs = ref([]);
const loadingLog = ref(true);
const fetchLogs = async () => {
  loadingLog.value = true;
  try {
    const url = `${API_BASE_URL}/log?orderBy=desc`;
    const response = await fetchApi(url, setOption());
    // console.log("response", response);

    if (response) {
      const data = response.data;
      logs.value = data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loadingLog.value = false;
  }
};

onMounted(() => {
  fetchLogs();
});
</script>
