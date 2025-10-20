import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import routes from "@/routes/index";
import { checkAccess } from "./utils/general";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || " Movaci BHR Report";
  const authStore = useAuthStore();

  const matchAccess = checkAccess();
  const { requiresAuth, requiresRole } = to.meta;

  if (to.name === "login" && authStore.isAuthenticated) {
    next({ name: "DashboardIndex" });
  } else if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" });
  } else if (requiresRole && authStore.userRole !== requiresRole) {
    next({ name: "DashboardIndex" });
  } else if (to.name === "LogIndex" && !matchAccess) {
    next({ name: "DashboardIndex" });
  } else {
    next();
  }
});

export default router;
