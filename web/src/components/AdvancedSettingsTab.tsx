// FILE: web/src/components/AdvancedSettingsTab.tsx
import React, { useState, useEffect } from "react";
import {
  getEmailSettings,
  updateEmailSettings,
  testEmailSettings,
  getLoggingSettings,
  updateLoggingSettings,
  getBackupSettings,
  updateBackupSettings,
  triggerBackupManually,
  getNotificationSettings,
  updateNotificationSettings,
  getAPIKeys,
  createAPIKey,
  revokeAPIKey,
  type EmailSettingsData,
  type LoggingSettingsData,
  type BackupSettingsData,
  type NotificationSettingsData,
  type APIKeyData,
} from "../services/advanced-settings.service";
import { getAccessToken } from "../lib/token";

type TabType = "email" | "logging" | "backup" | "notifications" | "api-keys";

export const AdvancedSettingsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Email Settings
  const [emailSettings, setEmailSettings] = useState<EmailSettingsData | null>(null);
  const [emailForm, setEmailForm] = useState<EmailSettingsData>({});

  // Logging Settings
  const [loggingSettings, setLoggingSettings] = useState<LoggingSettingsData | null>(null);
  const [loggingForm, setLoggingForm] = useState<LoggingSettingsData>({});

  // Backup Settings
  const [backupSettings, setBackupSettings] = useState<BackupSettingsData | null>(null);
  const [backupForm, setBackupForm] = useState<BackupSettingsData>({});

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData | null>(null);
  const [notificationForm, setNotificationForm] = useState<NotificationSettingsData>({});

  // API Keys
  const [apiKeys, setApiKeys] = useState<APIKeyData[]>([]);
  const [newKeyName, setNewKeyName] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = getAccessToken();
      console.log("[AdvancedSettingsTab] 🔍 Token kontrol:", token ? `✅ ${token.substring(0, 30)}...` : "❌ Token yok!");
      
      setLoading(true);
      console.log("[AdvancedSettingsTab] 🔄 Ayarlar yükleniyor...");
      
      const [email, logging, backup, notifications, keys] = await Promise.all([
        getEmailSettings(),
        getLoggingSettings(),
        getBackupSettings(),
        getNotificationSettings(),
        getAPIKeys(),
      ]);

      setEmailSettings(email);
      setEmailForm(email);

      setLoggingSettings(logging);
      setLoggingForm(logging);

      setBackupSettings(backup);
      setBackupForm(backup);

      setNotificationSettings(notifications);
      setNotificationForm(notifications);

      setApiKeys(keys);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Ayarlar yükleme hatası",
      });
    } finally {
      setLoading(false);
    }
  };

  // Email Settings Handlers
  const handleEmailSave = async () => {
    try {
      setLoading(true);
      const updated = await updateEmailSettings(emailForm);
      setEmailSettings(updated);
      setMessage({
        type: "success",
        text: "Email ayarları kaydedildi",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Kaydetme hatası",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailTest = async () => {
    if (!emailForm.from_email) {
      setMessage({
        type: "error",
        text: "Test emaili gönderebilmek için from_email adresi gerekli",
      });
      return;
    }

    try {
      setLoading(true);
      await testEmailSettings(emailForm.from_email);
      setMessage({
        type: "success",
        text: "Test e-maili gönderildi",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Test e-maili gönderilemedi",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logging Settings Handlers
  const handleLoggingSave = async () => {
    try {
      setLoading(true);
      const updated = await updateLoggingSettings(loggingForm);
      setLoggingSettings(updated);
      setMessage({
        type: "success",
        text: "Logging ayarları kaydedildi",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Kaydetme hatası",
      });
    } finally {
      setLoading(false);
    }
  };

  // Backup Settings Handlers
  const handleBackupSave = async () => {
    try {
      setLoading(true);
      const updated = await updateBackupSettings(backupForm);
      setBackupSettings(updated);
      setMessage({
        type: "success",
        text: "Yedekleme ayarları kaydedildi",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Kaydetme hatası",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackupTrigger = async () => {
    try {
      setLoading(true);
      await triggerBackupManually();
      setMessage({
        type: "success",
        text: "Yedekleme başlatıldı",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Yedekleme başlatılamadı",
      });
    } finally {
      setLoading(false);
    }
  };

  // Notification Settings Handlers
  const handleNotificationSave = async () => {
    try {
      setLoading(true);
      const updated = await updateNotificationSettings(notificationForm);
      setNotificationSettings(updated);
      setMessage({
        type: "success",
        text: "Bildirim ayarları kaydedildi",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Kaydetme hatası",
      });
    } finally {
      setLoading(false);
    }
  };

  // API Key Handlers
  const handleCreateAPIKey = async () => {
    if (!newKeyName.trim()) {
      setMessage({
        type: "error",
        text: "API anahtarı adı gerekli",
      });
      return;
    }

    try {
      setLoading(true);
      const newKey = await createAPIKey(newKeyName);
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName("");
      setMessage({
        type: "success",
        text: "API anahtarı oluşturuldu",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "API anahtarı oluşturulamadı",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAPIKey = async (keyId: number) => {
    if (!confirm("API anahtarını iptal etmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      setLoading(true);
      await revokeAPIKey(keyId);
      setApiKeys(apiKeys.filter((k) => k.id !== keyId));
      setMessage({
        type: "success",
        text: "API anahtarı iptal edildi",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "İptal işlemi başarısız",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabStyle = (tab: TabType): React.CSSProperties => ({
    padding: "8px 16px",
    border: "none",
    background: activeTab === tab ? "#3b82f6" : "transparent",
    color: activeTab === tab ? "white" : "#666",
    cursor: "pointer",
    fontWeight: activeTab === tab ? "bold" : "normal",
    borderRadius: 4,
  });

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Messages */}
      {message && (
        <div
          style={{
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor:
              message.type === "success" ? "#d1fae5" : "#fee2e2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${
              message.type === "success" ? "#6ee7b7" : "#fca5a5"
            }`,
          }}
        >
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {/* Tab Buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        <button style={tabStyle("email")} onClick={() => setActiveTab("email")}>
          📧 Email
        </button>
        <button
          style={tabStyle("logging")}
          onClick={() => setActiveTab("logging")}
        >
          📊 Logging
        </button>
        <button
          style={tabStyle("backup")}
          onClick={() => setActiveTab("backup")}
        >
          💾 Yedekleme
        </button>
        <button
          style={tabStyle("notifications")}
          onClick={() => setActiveTab("notifications")}
        >
          🔔 Bildirimler
        </button>
        <button
          style={tabStyle("api-keys")}
          onClick={() => setActiveTab("api-keys")}
        >
          🔑 API Anahtarları
        </button>
      </div>

      {/* Email Settings Tab */}
      {activeTab === "email" && emailSettings && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>📧 Email / SMTP Ayarları</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                SMTP Host
              </label>
              <input
                type="text"
                value={emailForm.smtp_host || ""}
                onChange={(e) => setEmailForm({ ...emailForm, smtp_host: e.target.value })}
                placeholder="smtp.gmail.com"
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                SMTP Port
              </label>
              <input
                type="number"
                value={emailForm.smtp_port || 587}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, smtp_port: parseInt(e.target.value) })
                }
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                SMTP Username
              </label>
              <input
                type="text"
                value={emailForm.smtp_username || ""}
                onChange={(e) => setEmailForm({ ...emailForm, smtp_username: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                SMTP Password
              </label>
              <input
                type="password"
                value={emailForm.smtp_password || ""}
                onChange={(e) => setEmailForm({ ...emailForm, smtp_password: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                From Email
              </label>
              <input
                type="email"
                value={emailForm.from_email || ""}
                onChange={(e) => setEmailForm({ ...emailForm, from_email: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                From Name
              </label>
              <input
                type="text"
                value={emailForm.from_name || ""}
                onChange={(e) => setEmailForm({ ...emailForm, from_name: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <label>
              <input
                type="checkbox"
                checked={emailForm.use_tls || false}
                onChange={(e) => setEmailForm({ ...emailForm, use_tls: e.target.checked })}
              />
              TLS Kullan
            </label>
            <label>
              <input
                type="checkbox"
                checked={emailForm.use_ssl || false}
                onChange={(e) => setEmailForm({ ...emailForm, use_ssl: e.target.checked })}
              />
              SSL Kullan
            </label>
            <label>
              <input
                type="checkbox"
                checked={emailForm.enable_email_notifications || false}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, enable_email_notifications: e.target.checked })
                }
              />
              Email Bildirimlerini Etkinleştir
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={handleEmailSave}
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              onClick={handleEmailTest}
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Test Gönderiliyor..." : "Test Gönder"}
            </button>
          </div>
        </div>
      )}

      {/* Logging Settings Tab */}
      {activeTab === "logging" && loggingSettings && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>📊 Logging Ayarları</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                Log Seviyesi
              </label>
              <select
                value={loggingForm.log_level || "INFO"}
                onChange={(e) => setLoggingForm({ ...loggingForm, log_level: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              >
                <option>DEBUG</option>
                <option>INFO</option>
                <option>WARNING</option>
                <option>ERROR</option>
                <option>CRITICAL</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                Log Saklama Günü
              </label>
              <input
                type="number"
                value={loggingForm.log_retention_days || 30}
                onChange={(e) =>
                  setLoggingForm({ ...loggingForm, log_retention_days: parseInt(e.target.value) })
                }
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <label>
              <input
                type="checkbox"
                checked={loggingForm.enable_file_logging || false}
                onChange={(e) =>
                  setLoggingForm({ ...loggingForm, enable_file_logging: e.target.checked })
                }
              />
              Dosya Logging'i Etkinleştir
            </label>
            <label>
              <input
                type="checkbox"
                checked={loggingForm.enable_database_logging || false}
                onChange={(e) =>
                  setLoggingForm({ ...loggingForm, enable_database_logging: e.target.checked })
                }
              />
              Veritabanı Logging'i Etkinleştir
            </label>
            <label>
              <input
                type="checkbox"
                checked={loggingForm.log_api_requests || false}
                onChange={(e) =>
                  setLoggingForm({ ...loggingForm, log_api_requests: e.target.checked })
                }
              />
              API İstekleri Logla
            </label>
            <label>
              <input
                type="checkbox"
                checked={loggingForm.log_user_actions || false}
                onChange={(e) =>
                  setLoggingForm({ ...loggingForm, log_user_actions: e.target.checked })
                }
              />
              Kullanıcı İşlemlerini Logla
            </label>
          </div>

          <button
            onClick={handleLoggingSave}
            disabled={loading}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      )}

      {/* Backup Settings Tab */}
      {activeTab === "backup" && backupSettings && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>💾 Yedekleme Ayarları</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                Yedekleme Sıklığı
              </label>
              <select
                value={backupForm.backup_frequency || "daily"}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, backup_frequency: e.target.value })
                }
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              >
                <option value="hourly">Saatlik</option>
                <option value="every_2_hours">2 Saatte Bir</option>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                Yedekleme Saati
              </label>
              <input
                type="time"
                value={backupForm.backup_time || "02:00"}
                onChange={(e) => setBackupForm({ ...backupForm, backup_time: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                Yedekleme Konumu
              </label>
              <input
                type="text"
                value={backupForm.backup_location || ""}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, backup_location: e.target.value })
                }
                placeholder="/backups"
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                Son N Yedeklemeyi Sakla
              </label>
              <input
                type="number"
                value={backupForm.keep_last_n_backups || 5}
                onChange={(e) =>
                  setBackupForm({
                    ...backupForm,
                    keep_last_n_backups: parseInt(e.target.value),
                  })
                }
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <label>
              <input
                type="checkbox"
                checked={backupForm.enable_automatic_backup || false}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, enable_automatic_backup: e.target.checked })
                }
              />
              Otomatik Yedeklemeyi Etkinleştir
            </label>
            <label>
              <input
                type="checkbox"
                checked={backupForm.compress_backups || false}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, compress_backups: e.target.checked })
                }
              />
              Yedeklemeleri Sıkıştır
            </label>
            <label>
              <input
                type="checkbox"
                checked={backupForm.encrypt_backups || false}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, encrypt_backups: e.target.checked })
                }
              />
              Yedeklemeleri Şifrele
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={handleBackupSave}
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              onClick={handleBackupTrigger}
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Başlatılıyor..." : "Şimdi Yedekle"}
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings Tab */}
      {activeTab === "notifications" && notificationSettings && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>🔔 Bildirim Ayarları</h3>

          <div style={{ marginTop: 16 }}>
            <h4>Teklif Bildirimleri</h4>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={notificationForm.notify_on_quote_created || false}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    notify_on_quote_created: e.target.checked,
                  })
                }
              />
              Teklif Oluşturulduğunda Bildir
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={notificationForm.notify_on_quote_response || false}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    notify_on_quote_response: e.target.checked,
                  })
                }
              />
              Teklif Yanıtı Alındığında Bildir
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={notificationForm.notify_on_quote_approved || false}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    notify_on_quote_approved: e.target.checked,
                  })
                }
              />
              Teklif Onaylandığında Bildir
            </label>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4>Sistem Bildirimleri</h4>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={notificationForm.notify_on_system_errors || false}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    notify_on_system_errors: e.target.checked,
                  })
                }
              />
              Sistem Hataları Hakkında Bildir
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={notificationForm.enable_daily_digest || false}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    enable_daily_digest: e.target.checked,
                  })
                }
              />
              Günlük Özet Etkinleştir
            </label>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                Özet Saati
              </label>
              <input
                type="time"
                value={notificationForm.digest_time || "09:00"}
                onChange={(e) =>
                  setNotificationForm({ ...notificationForm, digest_time: e.target.value })
                }
                style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>
          </div>

          <button
            onClick={handleNotificationSave}
            disabled={loading}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api-keys" && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>🔑 API Anahtarları</h3>

          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="API anahtarı adını girin"
                style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
              <button
                onClick={handleCreateAPIKey}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Oluşturuluyor..." : "Yeni Anahtar"}
              </button>
            </div>

            {apiKeys.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ddd" }}>
                    <th style={{ textAlign: "left", padding: 8 }}>Ad</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Anahtar</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Durum</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Son Kullanıldı</th>
                    <th style={{ textAlign: "center", padding: 8 }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: 8 }}>{key.name}</td>
                      <td style={{ padding: 8, fontFamily: "monospace", fontSize: 12 }}>
                        {key.key.substring(0, 10)}...
                      </td>
                      <td style={{ padding: 8 }}>
                        {key.is_active ? "✅ Aktif" : "❌ Pasif"}
                      </td>
                      <td style={{ padding: 8, fontSize: 12 }}>
                        {key.last_used_at
                          ? new Date(key.last_used_at).toLocaleDateString("tr-TR")
                          : "—"}
                      </td>
                      <td style={{ padding: 8, textAlign: "center" }}>
                        <button
                          onClick={() => handleRevokeAPIKey(key.id)}
                          disabled={loading}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 12,
                            opacity: loading ? 0.6 : 1,
                          }}
                        >
                          İptal Et
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#666" }}>Henüz API anahtarı oluşturulmadı</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
