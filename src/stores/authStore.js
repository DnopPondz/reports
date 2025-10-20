import { defineStore } from "pinia";
import { API_BASE_URL } from "@/apiConfig";
import { fetchApi } from "@/utils/fechtApi";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    userRole: null, // 'admin', 'user', etc.
    token: null,
    employee: {},
  }),
  actions: {
    async loginWithCredentials(credentials) {
      const url = `${API_BASE_URL}/auth/login`;

      try {
        const response = await fetchApi(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const token = response?.token;
        const employee = response?.employee;
        const role = response?.role || "user";

        if (token) {
          this.setToken(token);
          this.login(role);
          this.setEmploee(employee);
          return { success: true };
        }

        console.error("Authentication failed. Token not found in response.");
        return { success: false, message: "Authentication failed" };
      } catch (error) {
        console.error("Error during authentication");
        throw error;
      }
    },
    login(role = "user") {
      this.isAuthenticated = true;
      this.userRole = role;
      localStorage.setItem(
        "auth",
        JSON.stringify({ isAuthenticated: true, userRole: role })
      );
    },
    logout() {
      this.isAuthenticated = false;
      this.userRole = null;
      this.token = null;
      this.employee = {};

      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("employee");
    },
    setEmploee(emp) {
      if (!emp) {
        this.employee = {};
        localStorage.removeItem("employee");
        return;
      }

      this.employee = {
        last_name: emp.last_name,
        job_title: emp.job_title,
        email: emp.work_email || emp.email,
      };
      localStorage.setItem("employee", JSON.stringify(this.employee));
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    initialize() {
      const authData = localStorage.getItem("auth");
      const token = localStorage.getItem("token");
      const employee = localStorage.getItem("employee");
      if (token) {
        this.token = token;
      }

      if (authData) {
        const { isAuthenticated, userRole } = JSON.parse(authData);
        this.isAuthenticated = isAuthenticated;
        this.userRole = userRole;
      }

      if (employee && employee !== null) {
        this.employee = employee ? JSON.parse(employee) : {};
      } else {
        this.employee = {};
      }
    },
  },
});
