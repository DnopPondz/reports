const API_BASE = process.env.VUE_APP_API_BASE;
const API_VERSION = process.env.VUE_APP_VERSION;
const API_URL = `${API_BASE}/${API_VERSION}`;

export const redirectToAzure = () => {
  window.location.href = `${API_URL}/auth/azure`;
};

