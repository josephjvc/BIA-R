import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const stored = localStorage.getItem("biar-auth");
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("biar-auth");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default client;
