// FILE: web/src/services/settings.service.ts
import { http } from "../lib/http";

export interface SystemSettings {
  id: number;
  app_name: string;
  maintenance_mode: boolean;
  vat_rates: number[];
  updated_by_id?: number;
  updated_at?: string;
  created_at?: string;
}

export interface SettingsUpdatePayload {
  app_name?: string;
  maintenance_mode?: boolean;
  vat_rates?: number[];
}

/**
 * Sistem ayarlarını getir
 */
export async function getSettings(): Promise<SystemSettings> {
  const res = await http.get<SystemSettings>("/settings");
  return res.data;
}

/**
 * Sistem ayarlarını güncelle
 */
export async function updateSettings(
  payload: SettingsUpdatePayload
): Promise<SystemSettings> {
  const res = await http.put<SystemSettings>("/settings", payload);
  return res.data;
}

/**
 * Ayarları yenile
 */
export async function refreshSettings(): Promise<SystemSettings> {
  return getSettings();
}
