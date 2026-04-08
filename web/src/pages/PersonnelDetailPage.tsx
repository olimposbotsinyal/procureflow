import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonnel, updatePersonnel } from "../services/admin.service";
import type { Personnel } from "../services/admin.service";

export default function PersonnelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    role: "",
    approval_limit: 0,
    department_id: undefined as number | undefined,
  });

  const fetchPersonnel = useCallback(async () => {
    try {
      setLoading(true);
      const allPersonnel = await getPersonnel();
      const person = allPersonnel.find((p: Personnel) => p.id === parseInt(id!));
      if (person) {
        setPersonnel(person);
        setForm({
          email: person.email,
          full_name: person.full_name,
          role: person.role,
          approval_limit: person.approval_limit,
          department_id: person.department_id,
        });
      } else {
        setError("Personel bulunamadı");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel]);

  const handleSave = async () => {
    try {
      const updateData: Partial<Personnel> = {
        email: form.email,
        full_name: form.full_name,
        role: form.role as Personnel['role'],
        approval_limit: form.approval_limit,
        department_id: form.department_id,
      };
      await updatePersonnel(parseInt(id!), updateData);
      setError(null);
      setIsEditing(false);
      await fetchPersonnel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncelleme hatası");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Yükleniyor...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>❌ {error}</div>;
  if (!personnel) return <div style={{ padding: 20 }}>Personel bulunamadı</div>;

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

      <h1>👤 {personnel.full_name}</h1>

      {!isEditing ? (
        <div style={{ background: "#f9fafb", padding: 20, borderRadius: 8, border: "1px solid #ddd" }}>
          <div style={{ marginBottom: 16 }}>
            <strong>Email:</strong> {personnel.email}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Rol:</strong>{" "}
            {personnel.role === "satinalmaci"
              ? "Satın Almacı"
              : personnel.role === "satinalma_uzmani"
              ? "Satın Alma Uzmanı"
              : personnel.role === "satinalma_yoneticisi"
              ? "Satın Alma Yöneticisi"
              : personnel.role === "satinalma_direktoru"
              ? "Satın Alma Direktörü"
              : "Super Admin"}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Onay Limiti:</strong> {personnel.approval_limit.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Departman ID:</strong> {personnel.department_id || "Atanmadı"}
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
          <h2>Bilgileri Düzenle</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label>Ad Soyad:</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label>Rol:</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", boxSizing: "border-box" }}
              >
                <option value="satinalmaci">Satın Almacı (100K TL)</option>
                <option value="satinalma_uzmani">Satın Alma Uzmanı (200K TL)</option>
                <option value="satinalma_yoneticisi">Satın Alma Yöneticisi (300K TL)</option>
                <option value="satinalma_direktoru">Satın Alma Direktörü (1M TL)</option>
              </select>
            </div>
            <div>
              <label>Onay Limiti:</label>
              <input
                type="number"
                value={form.approval_limit}
                onChange={(e) => setForm({ ...form, approval_limit: parseInt(e.target.value) })}
                style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", boxSizing: "border-box" }}
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
