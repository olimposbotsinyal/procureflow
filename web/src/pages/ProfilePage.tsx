// FILE: web/src/pages/ProfilePage.tsx
import React, { useCallback, useEffect, useState } from "react";
import { getUserDisplayRoleLabel } from "../auth/permissions";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { profile, refreshProfile, updateProfile, changePassword } = useProfile();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile edit
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "" });

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      await refreshProfile();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Profil yükleme hatası",
      });
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setEditForm({ full_name: profile.full_name });
    }
  }, [profile, editMode]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editForm.full_name.trim()) {
      setMessage({ type: "error", text: "Ad ve soyad boş olamaz" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      await updateProfile({ full_name: editForm.full_name });
      setMessage({ type: "success", text: "Profil başarıyla güncellendi" });
      setEditMode(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Güncelleme hatası",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.old_password) {
      setMessage({ type: "error", text: "Mevcut şifre gerekli" });
      return;
    }

    if (!passwordForm.new_password) {
      setMessage({ type: "error", text: "Yeni şifre gerekli" });
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setMessage({ type: "error", text: "Yeni şifre en az 8 karakter olmalı" });
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage({ type: "error", text: "Şifreler eşleşmiyor" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      await changePassword(passwordForm.old_password, passwordForm.new_password);
      setMessage({ type: "success", text: "Şifre başarıyla değiştirildi" });
      setShowPasswordForm(false);
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Şifre değişme hatası",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile && loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ display: "inline-block" }}>⏳ Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ marginBottom: 8 }}>👤 Profilim</h1>
        <p style={{ color: "#666", margin: 0 }}>Kişisel bilgilerinizi yönetin</p>
      </div>

      {/* Messages */}
      {message && (
        <div
          style={{
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor:
              message.type === "success"
                ? "#d1fae5"
                : "#fee2e2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${
              message.type === "success" ? "#6ee7b7" : "#fca5a5"
            }`,
          }}
        >
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {profile && (
        <>
          {/* Profile Section */}
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 24,
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Temel Bilgiler</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Düzenle
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                    Ad ve Soyad
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#f3f4f6",
                      color: "#1f2937",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    İptal
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "16px 24px", lineHeight: 1.8 }}>
                <strong>Ad & Soyad:</strong>
                <span>{profile.full_name}</span>

                <strong>Email:</strong>
                <span>{profile.email}</span>

                <strong>Rol:</strong>
                <span>{getUserDisplayRoleLabel(profile)}</span>

                <strong>Durum:</strong>
                <span style={{ color: profile.is_active ? "#10b981" : "#ef4444" }}>
                  {profile.is_active ? "✅ Aktif" : "❌ Pasif"}
                </span>

                <strong>Onay Limiti:</strong>
                <span>{profile.approval_limit.toLocaleString("tr-TR")} ₺</span>
              </div>
            )}
          </div>

          {/* Password Change Section */}
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>🔐 Şifre</h2>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Şifre Değiştir
                </button>
              )}
            </div>

            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    value={passwordForm.old_password}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, old_password: e.target.value })
                    }
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, new_password: e.target.value })
                    }
                    disabled={loading}
                    placeholder="En az 8 karakter"
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "600" }}>
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirm_password: e.target.value })
                    }
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? "Değiştiriliyor..." : "Şifre Değiştir"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({
                        old_password: "",
                        new_password: "",
                        confirm_password: "",
                      });
                    }}
                    disabled={loading}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#f3f4f6",
                      color: "#1f2937",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    İptal
                  </button>
                </div>

                <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                  💡 Yeni şifre en az 8 karakter olmalı ve eski şifreden farklı olmalı.
                </p>
              </form>
            ) : (
              <p style={{ color: "#666", margin: 0 }}>
                Hesap güvenliğinizi sağlamak için düzenli olarak şifrenizi değiştirin.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
