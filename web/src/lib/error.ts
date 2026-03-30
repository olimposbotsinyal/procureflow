// FILE: web\src\lib\error.ts
import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { detail?: string; message?: string } | undefined;

    if (status === 400) return data?.detail || "Geçersiz istek.";
    if (status === 401) return "Oturum süresi dolmuş. Lütfen tekrar giriş yap.";
    if (status === 403) return "Bu işlem için yetkiniz yok.";
    if (status === 404) return "Kayıt bulunamadı.";
    if (status === 422) return data?.detail || "Gönderilen bilgiler doğrulanamadı.";
    if (status && status >= 500) return "Sunucu hatası oluştu. Lütfen tekrar deneyin.";

    return data?.detail || data?.message || "İstek sırasında bir hata oluştu.";
  }

  if (error instanceof Error) return error.message;
  return "Beklenmeyen bir hata oluştu.";
}
