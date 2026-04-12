// FILE: web/src/services/profile.service.ts
import { http } from "../lib/http";

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  department_id?: number;
  approval_limit: number;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ProfileUpdate {
  full_name?: string;
}

/**
 * Kendi profilimi getir
 */
export async function getMyProfile(): Promise<UserProfile> {
  const res = await http.get<UserProfile>("/users/profile");
  return res.data;
}

/**
 * Kendi profilimi güncelle
 */
export async function updateMyProfile(
  payload: ProfileUpdate
): Promise<UserProfile> {
  const res = await http.put<UserProfile>("/users/profile", payload);
  return res.data;
}

/**
 * Şifre değiştir
 */
export async function changePassword(
  old_password: string,
  new_password: string
): Promise<{ message: string }> {
  const res = await http.post<{ message: string }>(
    "/users/profile/change-password",
    { old_password, new_password }
  );
  return res.data;
}

/**
 * Admin: Kullanıcı profilini getir
 */
export async function getUserProfile(userId: number): Promise<UserProfile> {
  const res = await http.get<UserProfile>(`/users/${userId}/profile`);
  return res.data;
}

/**
 * Admin: Kullanıcı profilini güncelle
 */
export async function updateUserProfile(
  userId: number,
  payload: ProfileUpdate
): Promise<UserProfile> {
  const res = await http.put<UserProfile>(`/users/${userId}/profile`, payload);
  return res.data;
}
