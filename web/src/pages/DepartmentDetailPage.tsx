import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDepartments, updateDepartment } from "../services/admin.service";
import type { Department } from "../services/admin.service";

export default function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchDepartment = useCallback(async () => {
    try {
      setLoading(true);
      const allDepts = await getDepartments();
      const dept = allDepts.find((d: Department) => d.id === parseInt(id!));
      if (dept) {
        setDepartment(dept);
        setForm({
          name: dept.name,
          description: dept.description || "",
        });
      } else {
        setError("Departman bulunamadı");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const handleSave = async () => {
    try {
      await updateDepartment(parseInt(id!), form);
      setError(null);
      setIsEditing(false);
      await fetchDepartment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncelleme hatası");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Yükleniyor...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>❌ {error}</div>;
  if (!department) return <div style={{ padding: 20 }}>Departman bulunamadı</div>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/admin")}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          background: "#f3f4f6",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ← Geri Dön
      </button>

      <h1>🏢 {department.name}</h1>

      {!isEditing ? (
        <div style={{ background: "#f9fafb", padding: 20, borderRadius: 8, border: "1px solid #ddd" }}>
          <div style={{ marginBottom: 16 }}>
            <strong>Departman Adı:</strong> {department.name}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Açıklama:</strong> {department.description || "Açıklama eklenmemiş"}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Durum:</strong> {department.is_active ? "✅ Aktif" : "❌ Pasif"}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "10px 16px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Düzenle
          </button>
        </div>
      ) : (
        <div style={{ background: "#f9fafb", padding: 20, borderRadius: 8, border: "1px solid #ddd" }}>
          <h2>Departman Bilgilerini Düzenle</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label>Departman Adı:</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label>Açıklama:</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", boxSizing: "border-box", minHeight: 100 }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSave}
              style={{
                padding: "10px 16px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Kaydet
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: "10px 16px",
                background: "#f3f4f6",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
