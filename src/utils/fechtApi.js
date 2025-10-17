import { API_BASE_URL } from "@/apiConfig";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";

export const fetchApi = async (url, options) => {
  const authStore = useAuthStore();

  const fetchOptions = options;

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      await errorAuth(response, authStore, router);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during API call");
    // throw error;
  }
};

export const setOption = (type = "GET", body = null, reqeustToken = true) => {
  const token = localStorage.getItem("token");

  const headerToken = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const option = {
    method: type,
    headers: reqeustToken ? headerToken : headers,
  };

  if (reqeustToken && body) {
    option.body = JSON.stringify(body);
  }

  return option;
};

export const errorAuth = async (response, authStore, router) => {
  const res = await response.json();
  if (response.status === 401 || response.status === 403) {
    backLogin(router, authStore);
    throw new Error("Unauthorized access");
  }

  if (response.status === 500) {
    if (res.error === "Token validation failed") {
      backLogin(router, authStore);
      throw new Error(res.error);
    }
  }

  if (response.status === 422) {
    if (res?.errors) {
      window.alert(res?.errors?.type);
    } else {
      window.alert(res.error);
    }
  }

  throw new Error(`Error: ${response.status} ${response.statusText}`);
};

export const backLogin = (router, authStore) => {
  authStore.logout();
  router.push("/login");
};

//log activities
export const createLogActivities = (events) => {
  const url = `${API_BASE_URL}/log`;

  const formData = new FormData();
  formData.type = events.type;
  formData.log = events.log;
  try {
    const response = fetchApi(url, setOption("POST", formData));
    console.log("for check", response.json());
  } catch (error) {
    console.error(error);
  }
};
