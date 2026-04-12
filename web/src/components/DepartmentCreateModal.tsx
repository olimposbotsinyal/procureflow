import { useState } from "react";
import { createDepartment } from "../services/admin.service";
import { modalStyles } from "../styles/modalStyles";

interface DepartmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DepartmentCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: DepartmentCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name.trim()) throw new Error("Departman adı gerekli");

      await createDepartment({
        name,
        description: description || undefined,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Departman oluşturulamadı");
      console.error("Departman oluşturma hatası:", err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
    setError("");
  }

  if (!isOpen) return null;

  return (
    <div style={modalStyles.backdrop}>
      <div style={modalStyles.container}>
        {/* Header */}
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>📋 Yeni Departman Oluştur</h2>
          <button onClick={onClose} style={modalStyles.closeButton}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={modalStyles.content}>
          {/* Error */}
          {error && <div style={modalStyles.errorMessage}>{error}</div>}

          {/* Departman Adı */}
          <div style={modalStyles.fullWidth}>
            <label style={modalStyles.label}>Departman Adı *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="örn: Satın Alma"
              style={modalStyles.input}
            />
          </div>

          {/* Açıklama */}
          <div style={modalStyles.fullWidth}>
            <label style={modalStyles.label}>Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Departman hakkında bilgi..."
              rows={3}
              style={modalStyles.textarea}
            />
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
              {loading ? "⏳ Kaydediliyor..." : "✅ Departman Oluştur"}
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
