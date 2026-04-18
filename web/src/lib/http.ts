import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { clearToken, getToken, isSupplierLoggedIn } from "./session";
import { getRefreshToken, setAccessToken, setRefreshToken } from "./token";

// API Base URL - env'den al, yoksa relative path kullan
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessTokenOnce(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const refreshUrl = API_BASE_URL ? `${API_BASE_URL}/auth/refresh` : "/api/v1/auth/refresh";
    const res = await axios.post(refreshUrl, {
      refresh_token: refreshToken,
    }, {
      withCredentials: true,
    });

    const nextAccess = res.data?.access_token as string | undefined;
    const nextRefresh = res.data?.refresh_token as string | undefined;
    if (!nextAccess || !nextRefresh) return null;

    setAccessToken(nextAccess);
    setRefreshToken(nextRefresh);
    return nextAccess;
  } catch {
    return null;
  }
}

async function getFreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessTokenOnce().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

http.interceptors.request.use((config) => {
  // Eğer baseURL varsa, URL'ye /api/v1 eklemeye gerek yok
  // Yoksa local path olduğu için /api/v1 ekle
  if (!API_BASE_URL && config.url && !config.url?.startsWith('/api')) {
    config.url = `/api/v1${config.url}`;
  }
  
  // Public endpoints - token gönderme (auth gerekmiyor)
  const isPublicEndpoint = 
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/activate") ||
    config.url?.includes("/supplier/register") ||
    config.url?.includes("/supplier/login");
  
  if (isPublicEndpoint) {
    console.log(`[HTTP] Public endpoint detected - NOT adding token`);
    return config;
  }
  
  // Regular admin token veya supplier token'ı kontrol et
  const token = getToken();
  
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[HTTP] ✅ Token eklendi: ${token.substring(0, 20)}...`);
  } else {
    console.log(`[HTTP] ⚠️ Token bulunamadı!`);
  }
  console.log(`[HTTP] 📤 ${config.method?.toUpperCase()} ${config.url}`, {
    headers: {
      Authorization: config.headers?.Authorization ? "Bearer ***" : "NONE",
      "Content-Type": config.headers?.["Content-Type"],
    },
    data: config.data,
  });
  return config;
});

http.interceptors.response.use(
  (res) => {
    console.log(`[HTTP] ✅ ${res.status} ${res.config.url}`, res.data);
    return res;
  },
  async (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const errorData = error?.response?.data;
    const originalRequest = error?.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    
    console.error(`[HTTP] ❌ ${status} ${url}`, {
      statusCode: status,
      statusText: error?.response?.statusText,
      errorMessage: errorData?.detail || errorData?.message || error?.message,
      fullError: errorData,
    });

    if (status === 401) {
      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/activate") ||
        url.includes("/auth/me") ||
        url.includes("/auth/refresh") ||
        url.includes("/auth/logout") ||
        url.includes("/supplier/register") ||
        url.includes("/supplier/login");

      const canRetryWithRefresh =
        !isSupplierLoggedIn() &&
        !isAuthEndpoint &&
        !!originalRequest &&
        !originalRequest._retry;

      if (canRetryWithRefresh) {
        originalRequest._retry = true;
        const freshAccessToken = await getFreshAccessToken();

        if (freshAccessToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${freshAccessToken}`;
          return http(originalRequest);
        }
      }

      clearToken();
      sessionStorage.removeItem("pf_user");
      localStorage.removeItem("pf_user");

      const isOnSupplierPage = window.location.pathname.includes("/supplier/");
      const isOnLoginPage = window.location.pathname === "/login" || window.location.pathname === "/supplier/login";

      // Auth endpoint çağrıları için tekrar redirect yapma (loop önleme)
      // Supplier sayfalarında supplier login'e yönlendir, admin pages'te admin login'e yönlendir
      if (!isAuthEndpoint && !isOnLoginPage) {
        if (isOnSupplierPage) {
          window.location.assign("/supplier/login");
        } else {
          window.location.assign("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);
