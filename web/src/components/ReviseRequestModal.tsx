// web/src/components/ReviseRequestModal.tsx
import { useState } from "react";

interface ReviseRequestModalProps {
  visible: boolean;
  supplierQuoteName: string;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  loading?: boolean;
}

export function ReviseRequestModal({
  visible,
  supplierQuoteName,
  onClose,
  onSubmit,
  loading = false,
}: ReviseRequestModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("Lütfen revize nedenini giriniz");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reason);
      setReason("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Revize İste</h2>

        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
            <strong>Tedarikçi:</strong> {supplierQuoteName}
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
            Revize Nedeni
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Örn: Fiyatlar çok yüksek, lütfen indirim yapınız"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "14px",
              boxSizing: "border-box",
              minHeight: "100px",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={isSubmitting || loading}
            style={{
              padding: "8px 16px",
              background: "#e5e7eb",
              color: "#1f2937",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
            style={{
              padding: "8px 16px",
              background: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isSubmitting || loading ? "wait" : "pointer",
              fontSize: "14px",
              opacity: isSubmitting || loading ? 0.6 : 1,
            }}
          >
            {isSubmitting || loading ? "Gönderiliyor..." : "Revize İste"}
          </button>
        </div>
      </div>
    </div>
  );
}
