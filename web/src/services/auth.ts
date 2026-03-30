// FILE: web\src\services\auth.service.ts
import api from "./api";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; 
  // beklenen: { access_token, refresh_token, token_type }
}

export async function me() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function refresh(refreshToken: string) {
  const res = await api.post("/auth/refresh", {
    refresh_token: refreshToken,
  });
  return res.data;
  // beklenen: { access_token, token_type } (veya backend'ine göre refresh_token da dönebilir)
}
