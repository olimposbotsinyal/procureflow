import { http } from "../lib/http";

export interface SystemEmail {
  id: number;
  email: string;
  password: string;
  description: string;
  owner_user_id?: number | null;
  signature_name?: string | null;
  signature_title?: string | null;
  signature_note?: string | null;
  signature_image_url?: string | null;
  is_active?: boolean;
}

export interface SystemEmailCreate {
  email: string;
  password: string;
  description: string;
  owner_user_id?: number | null;
  signature_name?: string | null;
  signature_title?: string | null;
  signature_note?: string | null;
  signature_image_url?: string | null;
  is_active?: boolean;
}

export interface SystemEmailUpdate {
  password?: string;
  description?: string;
  signature_name?: string | null;
  signature_title?: string | null;
  signature_note?: string | null;
  signature_image_url?: string | null;
  is_active?: boolean;
}

export async function getSystemEmails(ownerUserId?: number | null): Promise<SystemEmail[]> {
  const res = await http.get<SystemEmail[]>("/api/v1/system-emails", {
    params: ownerUserId === undefined ? undefined : { owner_user_id: ownerUserId },
  });
  return res.data;
}

export async function createSystemEmail(payload: SystemEmailCreate): Promise<SystemEmail> {
  const res = await http.post<SystemEmail>("/api/v1/system-emails", payload);
  return res.data;
}

export async function updateSystemEmail(id: number, payload: SystemEmailUpdate): Promise<SystemEmail> {
  const res = await http.put<SystemEmail>(`/api/v1/system-emails/${id}`, payload);
  return res.data;
}

export async function deleteSystemEmail(id: number): Promise<{ message: string }> {
  const res = await http.delete<{ message: string }>(`/api/v1/system-emails/${id}`);
  return res.data;
}
