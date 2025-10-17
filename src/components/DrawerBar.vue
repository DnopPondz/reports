<template>
  <!-- Drawer Menu -->
  <div class="relative z-[100] h-full w-64 shadow-lg bg-movaci-main">
    <LogoTitleComponent class="py-4 flex gap-2 justify-center items-center" />
    <div class="pt-[6rem]">
      <ul class="flex flex-col w-full gap-2">
        <li
          class="pl-6 cursor-pointer w-full"
          v-for="(item, index) in newMenuList"
          :key="index"
        >
          <RouterLink :to="item.routeName">
            <div
              class="relative font-bold px-4 py-2 rounded-l-full cursor-pointer w-full flex items-center justify-between"
              :class="
                isActive(item)
                  ? ' bg-white text-movaci-main '
                  : 'hover:bg-mvc-lg-1 text-white  hover:text-movaci-main'
              "
            >
              <div class="flex items-center gap-6">
                <component
                  :is="iconList[index]"
                  :color="isActive(item) ? '#316FB7' : 'white'"
                  class="h-[30px] w-[30px]"
                />

                {{ item.name }}
              </div>

              <!-- if want to use this select menu please just remove false boolean -->
              <button
                v-if="(item?.subMenu?.length > 0) & false"
                @click="btnSubMenuShow = !btnSubMenuShow"
                class="flex items-center justify-center"
              >
                <span v-if="btnSubMenuShow">
                  <!-- Up Arrow SVG -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </span>
                <span v-else>
                  <!-- Down Arrow SVG -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </RouterLink>
          <!-- if want to use this select menu please just remove false boolean -->
          <ul
            class="my-4"
            :class="{ hidden: !btnSubMenuShow }"
            v-if="item?.subMenu?.length > 0 && false"
          >
            <li
              class="px-4 py-2 rounded-l-xl cursor-pointer w-full"
              v-for="(list, indexList) in item.subMenu"
              :key="indexList"
            >
              <RouterLink
                :to="{
                  name: 'ProjectDetail',
                  params: { name: list.name, projectCode: list.code },
                }"
                :class="
                  isActiveSubmenu(list)
                    ? 'bg-blue-300 text-white'
                    : 'hover:bg-blue-300 hover:text-white'
                "
                class="ml-4 px-4 py-2 rounded-xl cursor-pointer"
                >{{ list.title }}</RouterLink
              >
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch, computed } from "vue";
import { mainMenu } from "@/navList";
import { useRoute } from "vue-router";
import { checkAccess } from "@/utils/general";

import LogoTitleComponent from "./Materials/LogoTitleComponent.vue";

import DashboardIcon from "./Icons/DashboardIcon.vue";
import ReportIcon from "./Icons/ReportIcon.vue";
import ProjectIcon from "./Icons/ProjectIcon.vue";
import EmployeeIcon from "./Icons/EmployeeIcon.vue";
import DepartmentIcon from "./Icons/DepartmentIcon.vue";

const iconList = ref([
  DashboardIcon,
  ReportIcon,
  ProjectIcon,
  EmployeeIcon,
  DepartmentIcon,
]);

const menuList = ref(mainMenu);

const btnSubMenuShow = ref(false);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();

const drawerOpen = ref(props.modelValue);

// eslint-disable-next-line no-unused-vars
const closeDrawer = () => {
  drawerOpen.value = false;
  emit("update:modelValue", false);
};

const newMenuList = computed(() => {
  const status = checkAccess();
  if (!status) {
    return menuList.value.filter((item) => {
      const listCheck = ["LogIndex"];
      return !listCheck.includes(item.routeName.name);
    });
  }

  return menuList.value;
});

watch(
  () => props.modelValue,
  (newValue) => {
    drawerOpen.value = newValue;
  }
);

const isActive = (routeItem) => {
  return (
    route.name === routeItem.routeName.name && route.hash === routeItem.routeName.hash
  );
};

const isActiveSubmenu = (list) => {
  const { name, projectCode } = route.params;
  return name === list.name && Number(projectCode) === Number(list.code);
};
</script>
