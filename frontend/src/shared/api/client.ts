import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
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
      const isAuthRequest = err.config?.url?.includes('/auth/login') || 
                           err.config?.url?.includes('/auth/register');
      const isOnLoginPage = window.location.pathname === '/login';
      
      if (!isAuthRequest && !isOnLoginPage) {
        localStorage.removeItem("biar-auth");
        window.location.href = "/login";
      }
    }
    
    if (err.code === 'ECONNABORTED') {
      err.message = 'Request timeout. Please try again.';
    } else if (!err.response && err.request) {
      err.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(err);
  }
);

export default client;
