import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateCompany, getCompanies, type Company } from "../services/admin.service";
import { useAuth } from "../hooks/useAuth";

export default function CompanyDetailPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      const companies = await getCompanies();
      const found = companies.find((c) => c.id === parseInt(id || "0"));
      if (found) {
        setCompany(found);
        setEditForm({
          name: found.name,
          description: found.description || "",
          is_active: found.is_active,
        });
      } else {
        setError("Firma bulunamadı");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleSave = async () => {
    if (!editForm.name) {
      setError("Firma adı zorunludur");
      return;
    }
    try {
      const updated = await updateCompany(parseInt(id || "0"), editForm);
      setCompany(updated);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydetme başarısız");
    }
  };

  if (user?.role !== "super_admin") {
    return <div style={{ padding: 20, color: "red" }}>Sadece Super Admin bu sayfaya erişebilir</div>;
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Yükleniyor...</div>;
  }

  if (!company) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Firma Bulunamadı</h2>
        <button
          onClick={() => navigate("/admin")}
          style={{
            padding: "8px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Admin Paneline Dön
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>🏭 Firma Detayı</h1>

      {error && (
        <div style={{ color: "red", padding: 12, background: "#fee2e2", borderRadius: 4, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {isEditing ? (
        <div
          style={{
            background: "white",
            padding: 16,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Firmayı Düzenle</h2>

          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>Firma Adı *</div>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              style={{
                width: "100%",
                padding: 8,
                border: "1px solid #d1d5db",
                borderRadius: 4,
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>Açıklama</div>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              style={{
                width: "100%",
                padding: 8,
                border: "1px solid #d1d5db",
                borderRadius: 4,
                boxSizing: "border-box",
                fontFamily: "inherit",
                minHeight: 80,
              }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={editForm.is_active}
              onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
            />
            <span style={{ fontWeight: "bold" }}>Aktif</span>
          </label>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleSave}
              style={{
                padding: "8px 16px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✓ Kaydet
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditForm({
                  name: company.name,
                  description: company.description || "",
                  is_active: company.is_active,
                });
              }}
              style={{
                padding: "8px 16px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕ İptal
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#f9fafb",
            padding: 16,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: "bold", color: "#666", fontSize: 12, marginBottom: 4 }}>FIRMA ADI</div>
            <div style={{ fontSize: 18, fontWeight: "bold" }}>{company.name}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: "bold", color: "#666", fontSize: 12, marginBottom: 4 }}>AÇIKLAMA</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{company.description || "-"}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: "bold", color: "#666", fontSize: 12, marginBottom: 4 }}>DURUM</div>
            <div>
              {company.is_active ? (
                <span style={{ color: "green", fontWeight: "bold" }}>✓ Aktif</span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>✗ Pasif</span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: "bold", color: "#666", fontSize: 12, marginBottom: 4 }}>OLUŞTURMA TARİHİ</div>
            <div>{new Date(company.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}</div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "8px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✎ Düzenle
            </button>
            <button
              onClick={() => navigate("/admin")}
              style={{
                padding: "8px 16px",
                background: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ← Geri Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
