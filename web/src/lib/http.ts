import axios from "axios";
import { getAccessToken, clearAccessToken } from "./token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";

    if (status === 401) {
      clearAccessToken();
      localStorage.removeItem("pf_user");

      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/me") ||
        url.includes("/auth/refresh") ||
        url.includes("/auth/logout");

      const isOnLoginPage = window.location.pathname === "/login";

      // Auth endpoint çağrıları için tekrar redirect yapma (loop önleme)
      if (!isAuthEndpoint && !isOnLoginPage) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);
