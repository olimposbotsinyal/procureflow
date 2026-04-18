import React, { useCallback, useEffect, useState } from "react";
import {
  getEmailSettings,
  getEmailProfiles,
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
  uploadEmailSignatureImage,
  type EmailSettingsData,
  type EmailProfileSummary,
  type LoggingSettingsData,
  type BackupSettingsData,
  type NotificationSettingsData,
  type APIKeyData,
} from "../services/advanced-settings.service";
import {
  getSystemEmails,
  createSystemEmail,
  updateSystemEmail,
  deleteSystemEmail,
  type SystemEmail,
  type SystemEmailCreate,
} from "../services/system-email.service";
import { useAuth } from "../hooks/useAuth";
import { canManageSharedEmailProfiles, isPlatformStaffUser } from "../auth/permissions";

type TabType = "email" | "logging" | "backup" | "notifications" | "api-keys";

export const AdvancedSettingsTab: React.FC = () => {
  const { user } = useAuth();
  const canManageProfiles = canManageSharedEmailProfiles(user);
  const readOnly = isPlatformStaffUser(user);
  const [activeTab, setActiveTab] = useState<TabType>("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Email
  const [emailSettings, setEmailSettings] = useState<EmailSettingsData | null>(null);
  const [emailForm, setEmailForm] = useState<EmailSettingsData>({});
  const [emailProfiles, setEmailProfiles] = useState<EmailProfileSummary[]>([]);
  const [selectedEmailProfileOwnerId, setSelectedEmailProfileOwnerId] = useState<number | null | undefined>(undefined);

  // Logging
  const [loggingSettings, setLoggingSettings] = useState<LoggingSettingsData | null>(null);
  const [loggingForm, setLoggingForm] = useState<LoggingSettingsData>({});

  // Backup
  const [backupSettings, setBackupSettings] = useState<BackupSettingsData | null>(null);
  const [backupForm, setBackupForm] = useState<BackupSettingsData>({});

  // Notification
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData | null>(null);
  const [notificationForm, setNotificationForm] = useState<NotificationSettingsData>({});

  // API Keys
  const [apiKeys, setApiKeys] = useState<APIKeyData[]>([]);
  const [newKeyName, setNewKeyName] = useState("");

  // System Emails
  const [systemEmails, setSystemEmails] = useState<SystemEmail[]>([]);
  const [newSystemEmail, setNewSystemEmail] = useState<SystemEmailCreate>({
    email: "",
    password: "",
    description: "",
  });
  const [editingEmailId, setEditingEmailId] = useState<number | null>(null);
  const [editingPassword, setEditingPassword] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingSignatureName, setEditingSignatureName] = useState("");
  const [editingSignatureTitle, setEditingSignatureTitle] = useState("");
  const [editingSignatureNote, setEditingSignatureNote] = useState("");

  const loadSettings = useCallback(async (ownerUserId?: number | null) => {
    try {
      setLoading(true);
      const profileRequest = getEmailProfiles().catch(() => []);
      const [email, logging, backup, notifications, keys, profiles] = await Promise.all([
        getEmailSettings(ownerUserId),
        getLoggingSettings(),
        getBackupSettings(),
        getNotificationSettings(),
        getAPIKeys(),
        profileRequest,
      ]);

      setEmailSettings(email);
      setEmailForm(email ?? {});
      setLoggingSettings(logging);
      setLoggingForm(logging ?? {});
      setBackupSettings(backup);
      setBackupForm(backup ?? {});
      setNotificationSettings(notifications);
      setNotificationForm(notifications ?? {});
      setApiKeys(keys ?? []);
      setEmailProfiles(profiles);
      if (selectedEmailProfileOwnerId === undefined) {
        if (canManageProfiles) {
          setSelectedEmailProfileOwnerId(ownerUserId ?? null);
        } else {
          setSelectedEmailProfileOwnerId(user?.id ?? null);
        }
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Ayarlar yüklenemedi",
      });
    } finally {
      setLoading(false);
    }
  }, [canManageProfiles, selectedEmailProfileOwnerId, user]);

  const loadSystemEmails = useCallback(async (ownerUserId?: number | null) => {
    try {
      const list = await getSystemEmails(ownerUserId);
      setSystemEmails(list ?? []);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Sistem mailleri yüklenemedi",
      });
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (selectedEmailProfileOwnerId === undefined) return;
    void loadSettings(selectedEmailProfileOwnerId);
    void loadSystemEmails(selectedEmailProfileOwnerId);
  }, [loadSettings, loadSystemEmails, selectedEmailProfileOwnerId]);

  // Email handlers
  const handleEmailSave = async () => {
    try {
      setLoading(true);
      const updated = await updateEmailSettings(emailForm, selectedEmailProfileOwnerId);
      setEmailSettings(updated);
      setEmailForm(updated);
      setMessage({ type: "success", text: "Email ayarları kaydedildi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Kaydetme hatası" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailTest = async () => {
    if (!emailForm.from_email && !emailForm.smtp_username) {
      setMessage({ type: "error", text: "Test için gönderen e-posta gerekli" });
      return;
    }

    try {
      setLoading(true);
      await testEmailSettings(emailForm.from_email || emailForm.smtp_username || "", selectedEmailProfileOwnerId);
      setMessage({ type: "success", text: "Test e-postası gönderildi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Test gönderimi başarısız" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureImageUpload = async (file: File | null) => {
    if (!file) return;
    try {
      setLoading(true);
      const result = await uploadEmailSignatureImage(file, selectedEmailProfileOwnerId);
      setEmailForm((prev) => ({ ...prev, signature_image_url: result.signature_image_url }));
      setMessage({ type: "success", text: "İmza görseli yüklendi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "İmza görseli yüklenemedi" });
    } finally {
      setLoading(false);
    }
  };

  // Logging handlers
  const handleLoggingSave = async () => {
    try {
      setLoading(true);
      const updated = await updateLoggingSettings(loggingForm);
      setLoggingSettings(updated);
      setLoggingForm(updated);
      setMessage({ type: "success", text: "Logging ayarları kaydedildi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Kaydetme hatası" });
    } finally {
      setLoading(false);
    }
  };

  // Backup handlers
  const handleBackupSave = async () => {
    try {
      setLoading(true);
      const updated = await updateBackupSettings(backupForm);
      setBackupSettings(updated);
      setBackupForm(updated);
      setMessage({ type: "success", text: "Yedekleme ayarları kaydedildi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Kaydetme hatası" });
    } finally {
      setLoading(false);
    }
  };

  const handleBackupTrigger = async () => {
    try {
      setLoading(true);
      await triggerBackupManually();
      setMessage({ type: "success", text: "Yedekleme başlatıldı" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Yedekleme başlatılamadı" });
    } finally {
      setLoading(false);
    }
  };

  // Notification handlers
  const handleNotificationSave = async () => {
    try {
      setLoading(true);
      const updated = await updateNotificationSettings(notificationForm);
      setNotificationSettings(updated);
      setNotificationForm(updated);
      setMessage({ type: "success", text: "Bildirim ayarları kaydedildi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Kaydetme hatası" });
    } finally {
      setLoading(false);
    }
  };

  // API key handlers
  const handleCreateAPIKey = async () => {
    if (!newKeyName.trim()) {
      setMessage({ type: "error", text: "API anahtarı adı gerekli" });
      return;
    }

    try {
      setLoading(true);
      const newKey = await createAPIKey(newKeyName.trim());
      setApiKeys((prev) => [...prev, newKey]);
      setNewKeyName("");
      setMessage({ type: "success", text: "API anahtarı oluşturuldu" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "API anahtarı oluşturulamadı" });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAPIKey = async (keyId: number) => {
    if (!window.confirm("API anahtarını iptal etmek istediğinize emin misiniz?")) return;

    try {
      setLoading(true);
      await revokeAPIKey(keyId);
      setApiKeys((prev) => prev.filter((k: APIKeyData) => k.id !== keyId));
      setMessage({ type: "success", text: "API anahtarı iptal edildi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "İptal işlemi başarısız" });
    } finally {
      setLoading(false);
    }
  };

  // System email handlers
  const handleSystemEmailCreate = async () => {
    if (!newSystemEmail.email?.trim() || !newSystemEmail.password?.trim()) {
      setMessage({ type: "error", text: "Email ve şifre zorunlu" });
      return;
    }

    try {
      setLoading(true);
      const created = await createSystemEmail({
        ...newSystemEmail,
        owner_user_id: selectedEmailProfileOwnerId ?? null,
      });
      setSystemEmails((prev) => [...prev, created]);
      setNewSystemEmail({ email: "", password: "", description: "" });
      setMessage({ type: "success", text: "Sistem mail hesabı eklendi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Sistem mail hesabı eklenemedi" });
    } finally {
      setLoading(false);
    }
  };

  const handleSystemEmailEdit = (email: SystemEmail) => {
    setEditingEmailId(email.id);
    setEditingPassword("");
    setEditingDescription(email.description ?? "");
    setEditingSignatureName(email.signature_name ?? "");
    setEditingSignatureTitle(email.signature_title ?? "");
    setEditingSignatureNote(email.signature_note ?? "");
  };

  const handleSystemEmailUpdate = async (id: number) => {
    try {
      setLoading(true);
      const payload: Partial<SystemEmailCreate> = {
        description: editingDescription,
        signature_name: editingSignatureName,
        signature_title: editingSignatureTitle,
        signature_note: editingSignatureNote,
      };
      if (editingPassword.trim()) payload.password = editingPassword.trim();

      const updated = await updateSystemEmail(id, payload);
      setSystemEmails((prev) => prev.map((e) => (e.id === id ? updated : e)));
      setEditingEmailId(null);
      setEditingPassword("");
      setEditingDescription("");
      setEditingSignatureName("");
      setEditingSignatureTitle("");
      setEditingSignatureNote("");
      setMessage({ type: "success", text: "Sistem mail hesabı güncellendi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Güncelleme başarısız" });
    } finally {
      setLoading(false);
    }
  };

  const handleSystemEmailDelete = async (id: number) => {
    if (!window.confirm("Bu sistem mail hesabını silmek istediğinize emin misiniz?")) return;

    try {
      setLoading(true);
      await deleteSystemEmail(id);
      setSystemEmails((prev) => prev.filter((e) => e.id !== id));
      setMessage({ type: "success", text: "Sistem mail hesabı silindi" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Silme işlemi başarısız" });
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
      {message && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${message.type === "success" ? "#6ee7b7" : "#fca5a5"}`,
          }}
        >
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {readOnly && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fca5a5",
          }}
        >
          Platform personeli bu ayarlari goruntuleyebilir; kaydetme, test gonderimi, manuel yedekleme, API anahtari ve sistem mail yonetimi bu yuzeyde kapatildi.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
        <button style={tabStyle("email")} onClick={() => setActiveTab("email")}>📧 Email</button>
        <button style={tabStyle("logging")} onClick={() => setActiveTab("logging")}>📊 Logging</button>
        <button style={tabStyle("backup")} onClick={() => setActiveTab("backup")}>💾 Yedekleme</button>
        <button style={tabStyle("notifications")} onClick={() => setActiveTab("notifications")}>🔔 Bildirimler</button>
        <button style={tabStyle("api-keys")} onClick={() => setActiveTab("api-keys")}>🔑 API Anahtarları</button>
      </div>

      {activeTab === "email" && (
        <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb" }}>
          <h3>📧 Email (SMTP) Ayarları</h3>
          <fieldset disabled={readOnly} style={{ margin: 0, padding: 0, border: "none", minWidth: 0 }}>
          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
              {canManageProfiles ? "Profil Seçimi" : "Kullanılan Profil"}
            </div>
            {canManageProfiles ? (
              <select
                value={selectedEmailProfileOwnerId === null ? "default" : String(selectedEmailProfileOwnerId ?? "default")}
                onChange={(e) => setSelectedEmailProfileOwnerId(e.target.value === "default" ? null : Number(e.target.value))}
                style={{ marginTop: 8, width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              >
                {emailProfiles.map((profile) => (
                  <option
                    key={profile.owner_user_id === null ? "default" : String(profile.owner_user_id)}
                    value={profile.owner_user_id === null ? "default" : String(profile.owner_user_id)}
                  >
                    {profile.label}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ marginTop: 8, color: "#0f172a", fontWeight: 700 }}>Kendi SMTP profiliniz</div>
            )}
            <div style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
              {canManageProfiles
                ? "Süper admin varsayılan sistem SMTP profilini ve admin profillerini ayrı ayrı düzenleyebilir."
                : "Admin sadece kendi SMTP profilini ve kendi e-posta hesaplarını görür."}
            </div>
          </div>
          {emailSettings && (
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              Mevcut ayarlar yüklendi.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>SMTP Host</label>
              <input
                type="text"
                placeholder="smtp.gmail.com"
                value={emailForm.smtp_host ?? ""}
                onChange={(e) => setEmailForm({ ...emailForm, smtp_host: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>SMTP Port</label>
              <input
                type="number"
                placeholder="587"
                value={emailForm.smtp_port ?? 587}
                onChange={(e) =>
                  setEmailForm({
                    ...emailForm,
                    smtp_port: Number.isNaN(Number(e.target.value)) ? 587 : Number(e.target.value),
                  })
                }
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>SMTP Username</label>
              <input
                type="text"
                placeholder="noreply@firma.com"
                value={emailForm.smtp_username ?? ""}
                onChange={(e) => setEmailForm({ ...emailForm, smtp_username: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>SMTP Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={emailForm.smtp_password ?? ""}
                onChange={(e) => setEmailForm({ ...emailForm, smtp_password: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>From Email</label>
              <input
                type="email"
                placeholder="noreply@firma.com"
                value={emailForm.from_email ?? ""}
                onChange={(e) => setEmailForm({ ...emailForm, from_email: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>From Name</label>
              <input
                type="text"
                placeholder="ProcureFlow"
                value={emailForm.from_name ?? ""}
                onChange={(e) => setEmailForm({ ...emailForm, from_name: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Geliştirme Uygulama URL</label>
              <input
                type="text"
                placeholder="http://localhost:5175"
                value={emailForm.app_url ?? ""}
                onChange={(e) => setEmailForm({ ...emailForm, app_url: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Canlı Domain</label>
              <input
                type="text"
                placeholder="ornek.com"
                value={emailForm.mail_domain ?? ""}
                onChange={(e) => setEmailForm({ ...emailForm, mail_domain: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Reply-To</label>
              <input
                type="email"
                placeholder="destek@ornek.com"
                value={emailForm.reply_to_email ?? ""}
                onChange={(e) => setEmailForm({ ...emailForm, reply_to_email: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={Boolean((emailForm as Record<string, unknown>).use_tls)}
                onChange={(e) => setEmailForm({ ...emailForm, use_tls: e.target.checked } as EmailSettingsData)}
              />
              TLS kullan
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={Boolean((emailForm as Record<string, unknown>).use_ssl)}
                onChange={(e) => setEmailForm({ ...emailForm, use_ssl: e.target.checked } as EmailSettingsData)}
              />
              SSL kullan
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={Boolean((emailForm as Record<string, unknown>).use_custom_app_url)}
                onChange={(e) => setEmailForm({ ...emailForm, use_custom_app_url: e.target.checked } as EmailSettingsData)}
              />
              Domain modunu aktif et
            </label>
          </div>

          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#fffbeb", color: "#92400e", border: "1px solid #fcd34d" }}>
            Domain modu aktifken sistem e-posta ve uygulama linklerini canlı domain üzerinden üretir. Pasifken geliştirme URL'si kullanılmaya devam eder.
          </div>

          <div style={{ marginTop: 18, padding: 16, border: "1px solid #e5e7eb", borderRadius: 10, background: "#f8fafc" }}>
            <h4 style={{ margin: "0 0 12px" }}>Global Mail İmzası</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>İsim</label>
                <input
                  type="text"
                  value={emailForm.signature_name ?? ""}
                  onChange={(e) => setEmailForm({ ...emailForm, signature_name: e.target.value })}
                  style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Unvan</label>
                <input
                  type="text"
                  value={emailForm.signature_title ?? ""}
                  onChange={(e) => setEmailForm({ ...emailForm, signature_title: e.target.value })}
                  style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Not / İmza Metni</label>
                <textarea
                  rows={3}
                  value={emailForm.signature_note ?? ""}
                  onChange={(e) => setEmailForm({ ...emailForm, signature_note: e.target.value })}
                  style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4, resize: "vertical" }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>İmza Görseli / Logo</label>
                <input type="file" accept="image/*" onChange={(e) => void handleSignatureImageUpload(e.target.files?.[0] || null)} />
                {emailForm.signature_image_url && (
                  <div style={{ marginTop: 10 }}>
                    <img src={emailForm.signature_image_url} alt="mail-imza" style={{ maxWidth: 240, maxHeight: 120, objectFit: "contain", borderRadius: 8, border: "1px solid #dbe3ee", background: "white" }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={handleEmailSave} disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button onClick={handleEmailTest} disabled={loading}>
              {loading ? "Gönderiliyor..." : "Test Gönder"}
            </button>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <h4>Sistem Mail Hesapları</h4>
          <div style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>
            Her hesap kendi imza bilgisiyle saklanır. Gönderim ekranlarında bu hesaplar firmaya özel kullanım için temel oluşturur.
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>Mail</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>Şifre</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>Açıklama</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>İmza</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {systemEmails.map((email: SystemEmail) => (
                <tr key={email.id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>{email.email}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>
                    {editingEmailId === email.id ? (
                      <input
                        type="password"
                        value={editingPassword}
                        onChange={(e) => setEditingPassword(e.target.value)}
                        style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                      />
                    ) : (
                      "********"
                    )}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6", minWidth: 220 }}>
                    {editingEmailId === email.id ? (
                      <div style={{ display: "grid", gap: 6 }}>
                        <input value={editingSignatureName} onChange={(e) => setEditingSignatureName(e.target.value)} placeholder="İmza adı" style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }} />
                        <input value={editingSignatureTitle} onChange={(e) => setEditingSignatureTitle(e.target.value)} placeholder="İmza unvanı" style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }} />
                        <textarea value={editingSignatureNote} onChange={(e) => setEditingSignatureNote(e.target.value)} placeholder="İmza notu" rows={2} style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4, resize: "vertical" }} />
                      </div>
                    ) : (
                      <div style={{ color: "#475569", fontSize: 13 }}>
                        <div>{email.signature_name || "-"}</div>
                        <div>{email.signature_title || ""}</div>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>
                    {editingEmailId === email.id ? (
                      <input
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                      />
                    ) : (
                      email.description ?? "—"
                    )}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>
                    {editingEmailId === email.id ? (
                      <>
                        <button onClick={() => handleSystemEmailUpdate(email.id)} style={{ marginRight: 8 }}>
                          Kaydet
                        </button>
                        <button onClick={() => setEditingEmailId(null)}>Vazgeç</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleSystemEmailEdit(email)} style={{ marginRight: 8 }}>
                          Düzenle
                        </button>
                        <button onClick={() => handleSystemEmailDelete(email.id)}>Sil</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              <tr>
                <td style={{ padding: 8 }}>
                  <input
                    type="email"
                    value={newSystemEmail.email}
                    onChange={(e) => setNewSystemEmail({ ...newSystemEmail, email: e.target.value })}
                    placeholder="Yeni mail"
                    style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <input
                    type="password"
                    value={newSystemEmail.password}
                    onChange={(e) => setNewSystemEmail({ ...newSystemEmail, password: e.target.value })}
                    placeholder="Şifre"
                    style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <input
                    value={newSystemEmail.description ?? ""}
                    onChange={(e) => setNewSystemEmail({ ...newSystemEmail, description: e.target.value })}
                    placeholder="Açıklama"
                    style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <input value={newSystemEmail.signature_name ?? ""} onChange={(e) => setNewSystemEmail({ ...newSystemEmail, signature_name: e.target.value })} placeholder="İmza adı" style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }} />
                    <input value={newSystemEmail.signature_title ?? ""} onChange={(e) => setNewSystemEmail({ ...newSystemEmail, signature_title: e.target.value })} placeholder="İmza unvanı" style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }} />
                  </div>
                </td>
                <td style={{ padding: 8 }}>
                  <button onClick={handleSystemEmailCreate} disabled={loading}>
                    Ekle
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          </fieldset>
        </div>
      )}

      {activeTab === "logging" && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>📊 Logging Ayarları</h3>
          <fieldset disabled={readOnly} style={{ margin: 0, padding: 0, border: "none", minWidth: 0 }}>
          {loggingSettings && (
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
              Logging ayarları yüklendi.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Log Seviyesi</label>
              <select
                value={String((loggingForm as Record<string, unknown>).log_level ?? "INFO")}
                onChange={(e) => setLoggingForm({ ...loggingForm, log_level: e.target.value } as LoggingSettingsData)}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              >
                <option value="DEBUG">DEBUG</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Log Formatı</label>
              <input
                type="text"
                value={String((loggingForm as Record<string, unknown>).log_format ?? "")}
                onChange={(e) => setLoggingForm({ ...loggingForm, log_format: e.target.value } as LoggingSettingsData)}
                placeholder="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Log Dosyası</label>
              <input
                type="text"
                value={String((loggingForm as Record<string, unknown>).log_file ?? "")}
                onChange={(e) => setLoggingForm({ ...loggingForm, log_file: e.target.value } as LoggingSettingsData)}
                placeholder="/var/log/app.log"
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                Maksimum Dosya Boyutu (MB)
              </label>
              <input
                type="number"
                value={Number((loggingForm as Record<string, unknown>).max_file_size_mb ?? 10)}
                onChange={(e) =>
                  setLoggingForm({
                    ...loggingForm,
                    max_file_size_mb: Number.isNaN(Number(e.target.value)) ? 10 : Number(e.target.value),
                  } as LoggingSettingsData)
                }
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Dosya Rotasyon Sayısı</label>
              <input
                type="number"
                value={Number((loggingForm as Record<string, unknown>).backup_count ?? 5)}
                onChange={(e) =>
                  setLoggingForm({
                    ...loggingForm,
                    backup_count: Number.isNaN(Number(e.target.value)) ? 5 : Number(e.target.value),
                  } as LoggingSettingsData)
                }
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <label>
              <input
                type="checkbox"
                checked={Boolean((loggingForm as Record<string, unknown>).enable_console_logging)}
                onChange={(e) =>
                  setLoggingForm({ ...loggingForm, enable_console_logging: e.target.checked } as LoggingSettingsData)
                }
              />
              Console Logging Etkin
            </label>

            <label>
              <input
                type="checkbox"
                checked={Boolean((loggingForm as Record<string, unknown>).enable_file_logging)}
                onChange={(e) =>
                  setLoggingForm({ ...loggingForm, enable_file_logging: e.target.checked } as LoggingSettingsData)
                }
              />
              File Logging Etkin
            </label>

            <label>
              <input
                type="checkbox"
                checked={Boolean((loggingForm as Record<string, unknown>).enable_json_logging)}
                onChange={(e) =>
                  setLoggingForm({ ...loggingForm, enable_json_logging: e.target.checked } as LoggingSettingsData)
                }
              />
              JSON Formatında Logla
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
          </fieldset>
        </div>
      )}

      {activeTab === "backup" && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>💾 Yedekleme Ayarları</h3>
          <fieldset disabled={readOnly} style={{ margin: 0, padding: 0, border: "none", minWidth: 0 }}>
          {backupSettings && (
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
              Yedekleme ayarları yüklendi.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Yedekleme Sıklığı</label>
              <select
                value={String((backupForm as Record<string, unknown>).backup_frequency ?? "daily")}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, backup_frequency: e.target.value } as BackupSettingsData)
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
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Yedekleme Saati</label>
              <input
                type="time"
                value={String((backupForm as Record<string, unknown>).backup_time ?? "02:00")}
                onChange={(e) => setBackupForm({ ...backupForm, backup_time: e.target.value } as BackupSettingsData)}
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Yedekleme Konumu</label>
              <input
                type="text"
                value={String((backupForm as Record<string, unknown>).backup_location ?? "")}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, backup_location: e.target.value } as BackupSettingsData)
                }
                placeholder="/backups"
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Son N Yedeklemeyi Sakla</label>
              <input
                type="number"
                value={Number((backupForm as Record<string, unknown>).keep_last_n_backups ?? 5)}
                onChange={(e) =>
                  setBackupForm({
                    ...backupForm,
                    keep_last_n_backups: Number.isNaN(Number(e.target.value)) ? 5 : Number(e.target.value),
                  } as BackupSettingsData)
                }
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <label>
              <input
                type="checkbox"
                checked={Boolean((backupForm as Record<string, unknown>).enable_automatic_backup)}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, enable_automatic_backup: e.target.checked } as BackupSettingsData)
                }
              />
              Otomatik Yedeklemeyi Etkinleştir
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean((backupForm as Record<string, unknown>).compress_backups)}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, compress_backups: e.target.checked } as BackupSettingsData)
                }
              />
              Yedeklemeleri Sıkıştır
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean((backupForm as Record<string, unknown>).encrypt_backups)}
                onChange={(e) =>
                  setBackupForm({ ...backupForm, encrypt_backups: e.target.checked } as BackupSettingsData)
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
          </fieldset>
        </div>
      )}

      {activeTab === "notifications" && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>🔔 Bildirim Ayarları</h3>
          <fieldset disabled={readOnly} style={{ margin: 0, padding: 0, border: "none", minWidth: 0 }}>
          {notificationSettings && (
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
              Bildirim ayarları yüklendi.
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <h4>Teklif Bildirimleri</h4>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={Boolean((notificationForm as Record<string, unknown>).notify_on_quote_created)}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    notify_on_quote_created: e.target.checked,
                  } as NotificationSettingsData)
                }
              />
              Teklif Oluşturulduğunda Bildir
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={Boolean((notificationForm as Record<string, unknown>).notify_on_quote_response)}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    notify_on_quote_response: e.target.checked,
                  } as NotificationSettingsData)
                }
              />
              Teklif Yanıtı Alındığında Bildir
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={Boolean((notificationForm as Record<string, unknown>).notify_on_quote_approved)}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    notify_on_quote_approved: e.target.checked,
                  } as NotificationSettingsData)
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
                checked={Boolean((notificationForm as Record<string, unknown>).notify_on_system_errors)}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    notify_on_system_errors: e.target.checked,
                  } as NotificationSettingsData)
                }
              />
              Sistem Hataları Hakkında Bildir
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={Boolean((notificationForm as Record<string, unknown>).enable_daily_digest)}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    enable_daily_digest: e.target.checked,
                  } as NotificationSettingsData)
                }
              />
              Günlük Özet Etkinleştir
            </label>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>Özet Saati</label>
              <input
                type="time"
                value={String((notificationForm as Record<string, unknown>).digest_time ?? "09:00")}
                onChange={(e) =>
                  setNotificationForm({ ...notificationForm, digest_time: e.target.value } as NotificationSettingsData)
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
          </fieldset>
        </div>
      )}

      {activeTab === "api-keys" && (
        <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, border: "1px solid #e5e7eb" }}>
          <h3>🔑 API Anahtarları</h3>
          <fieldset disabled={readOnly} style={{ margin: 0, padding: 0, border: "none", minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Anahtar adı" />
            <button onClick={handleCreateAPIKey} disabled={loading}>
              {loading ? "Oluşturuluyor..." : "Yeni Anahtar"}
            </button>
          </div>

          {apiKeys.length === 0 ? (
            <p>Henüz API anahtarı yok</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Ad</th>
                  <th style={{ textAlign: "left" }}>Anahtar</th>
                  <th style={{ textAlign: "left" }}>Durum</th>
                  <th style={{ textAlign: "left" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key: APIKeyData) => (
                  <tr key={key.id}>
                    <td>{key.name}</td>
                    <td>{key.key}</td>
                    <td>{key.is_active ? "Aktif" : "Pasif"}</td>
                    <td>
                      <button onClick={() => handleRevokeAPIKey(key.id)} disabled={loading}>
                        İptal Et
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </fieldset>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettingsTab;
