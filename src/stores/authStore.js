import { defineStore } from "pinia";
import { API_BASE_URL } from "@/apiConfig";
import { fetchApi, setOption } from "@/utils/fechtApi";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    userRole: null, // 'admin', 'user', etc.
    token: null,
    employee: {},
  }),
  actions: {
    async authenticateWithAzure(code) {
      const existingToken = localStorage.getItem("token");
      if (existingToken) {
        return;
      }

      const url = `${API_BASE_URL}/auth/azure/callback?code=${encodeURIComponent(
        code
      )}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("response was not ok");
        }

        const data = await response.json();
        const token = data.token;
        // Check if token exists in the response
        if (token) {
          this.setToken(token);
          this.login("user");
        } else {
          console.error("Authentication failed. Token not found in response.");
        }
      } catch (error) {
        // console.error("Error during authentication:", error);
        console.error("Error during authentication");
      }
    },
    async authenticateWithAzureV2(code) {
      const existingToken = localStorage.getItem("token");
      if (existingToken) {
        return;
      }

      const url = `${API_BASE_URL}/auth/azure/callback?code=${encodeURIComponent(
        code
      )}`;

      try {
        const response = await fetchApi(
          url,
          setOption(undefined, undefined, false)
        );

        const data = response;
        const token = data.token;
        const employee = data.employee;
        if (token) {
          this.setToken(token);
          this.login("user");
          this.setEmploee(employee);
        } else {
          console.error("Authentication failed. Token not found in response.");
        }
      } catch (error) {
        console.error("Error during authentication");
      }
    },
    async getUser() {
      const accessToken = this.token;

      const url = `${API_BASE_URL}/auth/azure/userinfo`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // console.log("getUseravtive", await response.json());

        if (!response.ok) {
          this.logout();
          return;
        }

        const data = await response.json();
        const token = data.token;
        // Check if token exists in the response
        if (token) {
          this.setToken(token);
          this.login("user");
        } else {
          console.error("Authentication failed. Token not found in response.");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    },
    login(role) {
      this.isAuthenticated = true;
      this.userRole = role;
      localStorage.setItem(
        "auth",
        JSON.stringify({ isAuthenticated: true, userRole: role })
      );
    },
    logout() {
      this.azureLogout();
      this.isAuthenticated = false;
      this.userRole = null;
      this.token = null;

      localStorage.clear();
    },
    async azureLogout() {
      const url = `${API_BASE_URL}/auth/azure/logout`;

      try {
        const response = await fetchApi(url, setOption("POST", null, true));

        const data = response;
        // window.alert(data?.message);
        console.log("alert", data?.message);
      } catch (error) {
        console.error("Error revoke token authentication");
      }
    },
    setEmploee(emp) {
      this.employee = {
        // first_name: emp.first_name,
        last_name: emp.last_name,
        job_title: emp.job_title,
        email: emp.work_email,
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
        this.employee = employee ? JSON.parse(employee) : [];
      }
    },
  },
});
