// FILE: web\src\lib\api.ts
import { clearAccessToken, getAccessToken } from "./token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

type ApiOptions = RequestInit & {
  auth?: boolean; // default true
};

function buildUrl(path: string) {
  // path başında "/" yoksa ekle
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // API_BASE_URL sonunda "/" varsa temizle
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${normalizedBase}${normalizedPath}`;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);

  // FormData ise Content-Type'ı browser ayarlasın (boundary için önemli)
  const isFormData = rest.body instanceof FormData;
  if (!isFormData && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(buildUrl(path), {
    ...rest,
    headers: finalHeaders,
  });

  if (res.status === 401) {
    clearAccessToken();
    sessionStorage.removeItem("pf_user");
    localStorage.removeItem("pf_user");
    window.location.href = "/login";
    throw new Error("Oturum süresi doldu.");
  }

  if (!res.ok) {
    let message = `API hata: ${res.status}`;
    try {
      const data = await res.json();
      message = data?.detail || data?.message || message;
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (res.status === 204) return null as T;

  return (await res.json()) as T;
}
