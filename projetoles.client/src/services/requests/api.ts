import axios from "axios";
import { authService } from "../auth/authService";

const api = axios.create({
  baseURL: "http://localhost:5035",

  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redireciona para login quando o token expirar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.includes("/api/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      authService.logout();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
