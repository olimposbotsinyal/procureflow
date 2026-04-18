// FILE: web/src/services/advanced-settings.service.ts
import { http } from "../lib/http";

export interface EmailSettingsData {
  id?: number;
  owner_user_id?: number | null;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  from_email?: string;
  from_name?: string;
  use_tls?: boolean;
  use_ssl?: boolean;
  enable_email_notifications?: boolean;
  mail_domain?: string;
  app_url?: string;
  use_custom_app_url?: boolean;
  reply_to_email?: string;
  bounce_email?: string;
  mailbox_support_email?: string;
  enable_list_unsubscribe?: boolean;
  enable_strict_from_alignment?: boolean;
  signature_name?: string;
  signature_title?: string;
  signature_note?: string;
  signature_image_url?: string;
}

export interface EmailProfileSummary {
  owner_user_id: number | null;
  label: string;
  kind: "default" | "personal";
  from_email?: string;
}

export interface LoggingSettingsData {
  log_level?: string;
  enable_file_logging?: boolean;
  enable_database_logging?: boolean;
  enable_syslog?: boolean;
  log_retention_days?: number;
  log_api_requests?: boolean;
  log_database_queries?: boolean;
  log_user_actions?: boolean;
}

export interface BackupSettingsData {
  enable_automatic_backup?: boolean;
  backup_frequency?: string;
  backup_time?: string;
  backup_location?: string;
  keep_last_n_backups?: number;
  compress_backups?: boolean;
  encrypt_backups?: boolean;
  encryption_key?: string;
}

export interface NotificationSettingsData {
  notify_on_quote_created?: boolean;
  notify_on_quote_response?: boolean;
  notify_on_quote_approved?: boolean;
  notify_on_quote_rejected?: boolean;
  notify_on_contract_created?: boolean;
  notify_on_contract_signed?: boolean;
  notify_on_system_errors?: boolean;
  notify_on_maintenance?: boolean;
  enable_daily_digest?: boolean;
  digest_time?: string;
}

export interface APIKeyData {
  id: number;
  name: string;
  key: string;
  is_active: boolean;
  created_at: string;
  last_used_at?: string;
}

/**
 * Email Settings
 */
export async function getEmailSettings(ownerUserId?: number | null): Promise<EmailSettingsData> {
  const res = await http.get<EmailSettingsData>("/api/v1/advanced-settings/email", {
    params: ownerUserId === undefined ? undefined : { owner_user_id: ownerUserId },
  });
  return res.data;
}

export async function getEmailProfiles(): Promise<EmailProfileSummary[]> {
  const res = await http.get<EmailProfileSummary[]>("/api/v1/advanced-settings/email/profiles");
  return res.data;
}

export async function updateEmailSettings(
  payload: EmailSettingsData,
  ownerUserId?: number | null,
): Promise<EmailSettingsData> {
  const res = await http.put<EmailSettingsData>(
    "/api/v1/advanced-settings/email",
    payload,
    {
      params: ownerUserId === undefined ? undefined : { owner_user_id: ownerUserId },
    }
  );
  return res.data;
}

export async function testEmailSettings(toEmail: string, ownerUserId?: number | null): Promise<{ message: string }> {
  const res = await http.post<{ message: string }>(
    "/api/v1/advanced-settings/email/test",
    { to_email: toEmail },
    {
      params: ownerUserId === undefined ? undefined : { owner_user_id: ownerUserId },
    }
  );
  return res.data;
}

export async function uploadEmailSignatureImage(file: File, ownerUserId?: number | null): Promise<{ success: boolean; signature_image_url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await http.post<{ success: boolean; signature_image_url: string }>(
    "/api/v1/advanced-settings/email/signature-image",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      params: ownerUserId === undefined ? undefined : { owner_user_id: ownerUserId },
    },
  );
  return res.data;
}

/**
 * Logging Settings
 */
export async function getLoggingSettings(): Promise<LoggingSettingsData> {
  const res = await http.get<LoggingSettingsData>("/api/v1/advanced-settings/logging");
  return res.data;
}

export async function updateLoggingSettings(
  payload: LoggingSettingsData
): Promise<LoggingSettingsData> {
  const res = await http.put<LoggingSettingsData>(
    "/api/v1/advanced-settings/logging",
    payload
  );
  return res.data;
}

/**
 * Backup Settings
 */
export async function getBackupSettings(): Promise<BackupSettingsData> {
  const res = await http.get<BackupSettingsData>("/api/v1/advanced-settings/backup");
  return res.data;
}

export async function updateBackupSettings(
  payload: BackupSettingsData
): Promise<BackupSettingsData> {
  const res = await http.put<BackupSettingsData>(
    "/api/v1/advanced-settings/backup",
    payload
  );
  return res.data;
}

export async function triggerBackupManually(): Promise<{ message: string }> {
  const res = await http.post<{ message: string }>(
    "/api/v1/advanced-settings/backup/trigger"
  );
  return res.data;
}

/**
 * Notification Settings
 */
export async function getNotificationSettings(): Promise<
  NotificationSettingsData
> {
  const res = await http.get<NotificationSettingsData>(
    "/api/v1/advanced-settings/notifications"
  );
  return res.data;
}

export async function updateNotificationSettings(
  payload: NotificationSettingsData
): Promise<NotificationSettingsData> {
  const res = await http.put<NotificationSettingsData>(
    "/api/v1/advanced-settings/notifications",
    payload
  );
  return res.data;
}

/**
 * API Keys
 */
export async function getAPIKeys(): Promise<APIKeyData[]> {
  const res = await http.get<APIKeyData[]>("/api/v1/advanced-settings/api-keys");
  return res.data;
}

export async function createAPIKey(name: string): Promise<APIKeyData> {
  const res = await http.post<APIKeyData>("/api/v1/advanced-settings/api-keys", {
    name,
  });
  return res.data;
}

export async function revokeAPIKey(keyId: number): Promise<{ message: string }> {
  const res = await http.delete<{ message: string }>(
    `/api/v1/advanced-settings/api-keys/${keyId}`
  );
  return res.data;
}
