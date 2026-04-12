import { useState, useEffect } from "react";
import { createPersonnel, getDepartments, type Department } from "../services/admin.service";
import { modalStyles } from "../styles/modalStyles";

interface PersonnelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PersonnelCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: PersonnelCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<
    "satinalmaci" | "satinalma_uzmani" | "satinalma_yoneticisi" | "satinalma_direktoru" | "super_admin"
  >("satinalmaci");
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [approvalLimit, setApprovalLimit] = useState(0);

  useEffect(() => {
    if (isOpen && departments.length === 0) {
      loadDepartments();
    }
  }, [isOpen, departments.length]);

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Departmen yüklenemedi:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email.trim()) throw new Error("E-posta gerekli");
      if (!fullName.trim()) throw new Error("Ad soyad gerekli");
      if (!password.trim()) throw new Error("Şifre gerekli");
      if (password.length < 6) throw new Error("Şifre en az 6 karakter olmalı");

      await createPersonnel({
        email,
        full_name: fullName,
        password,
        role,
        department_id: departmentId,
        approval_limit: approvalLimit,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Personel oluşturulamadı");
      console.error("Personel oluşturma hatası:", err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEmail("");
    setFullName("");
    setPassword("");
    setRole("satinalmaci");
    setDepartmentId(undefined);
    setApprovalLimit(0);
    setError("");
  }

  if (!isOpen) return null;

  return (
    <div style={modalStyles.backdrop}>
      <div style={modalStyles.container}>
        {/* Header */}
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>👤 Yeni Personel Oluştur</h2>
          <button onClick={onClose} style={modalStyles.closeButton}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={modalStyles.content}>
          {/* Error */}
          {error && <div style={modalStyles.errorMessage}>{error}</div>}

          {/* Email & Full Name */}
          <div style={modalStyles.grid}>
            <div>
              <label style={modalStyles.label}>E-posta *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                style={modalStyles.input}
              />
            </div>
            <div>
              <label style={modalStyles.label}>Ad Soyad *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ahmet Yılmaz"
                style={modalStyles.input}
              />
            </div>
          </div>

          {/* Password & Role */}
          <div style={modalStyles.grid}>
            <div>
              <label style={modalStyles.label}>Şifre *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                style={modalStyles.input}
              />
            </div>
            <div>
              <label style={modalStyles.label}>Rol *</label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as
                      | "satinalmaci"
                      | "satinalma_uzmani"
                      | "satinalma_yoneticisi"
                      | "satinalma_direktoru"
                      | "super_admin"
                  )
                }
                style={modalStyles.input}
              >
                <option value="satinalmaci">📝 Satın Almacı</option>
                <option value="satinalma_uzmani">🎓 Uzman</option>
                <option value="satinalma_yoneticisi">👨‍💼 Müdür</option>
                <option value="satinalma_direktoru">🤵 Direktör</option>
                <option value="super_admin">👑 Super Admin</option>
              </select>
            </div>
          </div>

          {/* Department & Approval Limit */}
          <div style={modalStyles.grid}>
            <div>
              <label style={modalStyles.label}>Departman</label>
              <select
                value={departmentId || ""}
                onChange={(e) =>
                  setDepartmentId(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                style={modalStyles.input}
              >
                <option value="">Seçiniz...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={modalStyles.label}>Onay Limiti (₺)</label>
              <input
                type="number"
                value={approvalLimit}
                onChange={(e) => setApprovalLimit(parseFloat(e.target.value))}
                placeholder="0.00"
                step="0.01"
                min="0"
                style={modalStyles.input}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={modalStyles.footer}>
            <button
              type="submit"
              disabled={loading}
              style={
                loading
                  ? modalStyles.primaryButtonDisabled
                  : modalStyles.primaryButton
              }
            >
              {loading ? "⏳ Kaydediliyor..." : "✅ Personel Oluştur"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={modalStyles.secondaryButton}
            >
              ❌ İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
