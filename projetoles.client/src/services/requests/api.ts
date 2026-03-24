import axios from "axios";
import { authService } from "../auth/authService";
import { getApiErrorMessage } from "../errors/apiError";
import { notifyApiError } from "../errors/errorNotifier";

const api = axios.create({
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
    const requestConfig = error.config as
      | {
          url?: string;
          skipGlobalErrorHandler?: boolean;
          errorFallbackMessage?: string;
        }
      | undefined;

    const requestUrl = requestConfig?.url || "";
    const isLoginRequest = requestUrl.includes("/api/auth/login");
    const shouldSkipGlobalError = requestConfig?.skipGlobalErrorHandler === true;
    const status = error.response?.status;

    if (status === 401 && !isLoginRequest) {
      authService.logout();
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (!shouldSkipGlobalError) {
      const message = getApiErrorMessage(error, requestConfig?.errorFallbackMessage);
      notifyApiError(message);
    }

    return Promise.reject(error);
  },
);

export default api;
