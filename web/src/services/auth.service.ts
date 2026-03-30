import axios from "axios";
import { http } from "../lib/http";
import type { AuthUser } from "../context/auth-types";

type LoginApiResponse = {
  access_token: string;
  token_type: "bearer" | string;
  user?: AuthUser;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser | null;
};

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await http.post<LoginApiResponse>("/auth/login", { email, password });
    const data = res.data;

    if (!data?.access_token) {
      throw new Error("Login yanıtında access_token yok.");
    }

    return {
      accessToken: data.access_token,
      user: data.user ?? null,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("E-posta veya şifre hatalı.");
    }
    throw new Error("Giriş sırasında bir sorun oluştu.");
  }
}

export async function meRequest(): Promise<AuthUser> {
  const res = await http.get<AuthUser>("/auth/me");
  return res.data;
}

export async function logoutRequest(): Promise<void> {
  try {
    await http.post("/auth/logout");
  } catch {
    // backend logout başarısız olsa da local temizliği AuthProvider yapacak
  }
}
