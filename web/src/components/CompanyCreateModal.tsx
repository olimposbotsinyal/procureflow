import { useState } from "react";
import { createCompany } from "../services/admin.service";
import { modalStyles } from "../styles/modalStyles";

interface CompanyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompanyCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: CompanyCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name.trim()) throw new Error("Firma adı gerekli");

      await createCompany({
        name,
        description: description || undefined,
        is_active: isActive,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Firma oluşturulamadı");
      console.error("Firma oluşturma hatası:", err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
    setIsActive(true);
    setError("");
  }

  if (!isOpen) return null;

  return (
    <div style={modalStyles.backdrop}>
      <div style={modalStyles.container}>
        {/* Header */}
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>🏢 Yeni Firma Oluştur</h2>
          <button onClick={onClose} style={modalStyles.closeButton}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={modalStyles.content}>
          {/* Error */}
          {error && <div style={modalStyles.errorMessage}>{error}</div>}

          {/* Firma Adı */}
          <div style={modalStyles.fullWidth}>
            <label style={modalStyles.label}>Firma Adı *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="örn: Pizza Max şti."
              style={modalStyles.input}
            />
          </div>

          {/* Açıklama */}
          <div style={modalStyles.fullWidth}>
            <label style={modalStyles.label}>Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Firma hakkında bilgi..."
              rows={3}
              style={modalStyles.textarea}
            />
          </div>

          {/* Checkbox */}
          <div style={{ ...modalStyles.fullWidth, marginBottom: "16px" }}>
            <label style={modalStyles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={modalStyles.checkbox}
              />
              <span>Firmayı aktif olarak oluştur</span>
            </label>
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
              {loading ? "⏳ Kaydediliyor..." : "✅ Firma Oluştur"}
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
