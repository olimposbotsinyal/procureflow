import { useMemo, useState } from "react";
import { http } from "../lib/http";

type ProjectSupplier = {
  id: number;
  supplier_id: number;
  supplier_name: string;
  supplier_email: string;
  category?: string;
  is_active: boolean;
};

type Props = {
  quoteId: number;
  projectId: number;
  suppliers: ProjectSupplier[];
  onClose: () => void;
  onSent: () => void;
};

export default function SendQuoteModal({ quoteId, projectId, suppliers, onClose, onSent }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    suppliers.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "tr"))];
  }, [suppliers]);

  const visibleSuppliers = useMemo(() => {
    const active = suppliers.filter((s) => s.is_active);
    if (selectedCategory === "all") return active;
    return active.filter((s) => (s.category || "") === selectedCategory);
  }, [suppliers, selectedCategory]);

  const toggleSupplier = (supplierId: number) => {
    setSelectedSupplierIds((prev) =>
      prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId]
    );
  };

  const selectAllVisible = () => {
    setSelectedSupplierIds((prev) => {
      const set = new Set(prev);
      visibleSuppliers.forEach((s) => set.add(s.supplier_id));
      return Array.from(set);
    });
  };

  const clearSelection = () => setSelectedSupplierIds([]);

  const handleSend = async () => {
    if (selectedSupplierIds.length === 0) {
      setError("En az bir tedarikçi seçiniz.");
      return;
    }

    try {
      setSending(true);
      setError(null);
      await http.post(`/quotes/${quoteId}/send-to-suppliers`, selectedSupplierIds);
      onSent();
      onClose();
    } catch (err) {
      const detail =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { detail?: string } } }).response?.data?.detail === "string"
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setError(detail || (err instanceof Error ? err.message : "Teklif gönderilemedi"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1200,
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(760px, 100%)",
          maxHeight: "85vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          padding: "18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0 }}>Teklifi Tedarikçilere Gönder</h3>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "18px", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ fontSize: "13px", color: "#4b5563", marginBottom: "12px" }}>
          Proje ID: {projectId} - Sadece bu projeye eklenen tedarikçiler listelenir.
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: "999px",
                padding: "6px 10px",
                cursor: "pointer",
                background: selectedCategory === cat ? "#2563eb" : "#fff",
                color: selectedCategory === cat ? "#fff" : "#1f2937",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {cat === "all" ? "Tüm Kategoriler" : cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <button type="button" onClick={selectAllVisible} style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", background: "#fff" }}>
            Görünenleri Seç
          </button>
          <button type="button" onClick={clearSelection} style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", background: "#fff" }}>
            Seçimi Temizle
          </button>
        </div>

        {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "6px", marginBottom: "10px" }}>{error}</div>}

        <div style={{ display: "grid", gap: "8px", marginBottom: "12px" }}>
          {visibleSuppliers.length === 0 ? (
            <div style={{ color: "#6b7280", fontSize: "13px", padding: "8px" }}>Bu filtrede tedarikçi yok.</div>
          ) : (
            visibleSuppliers.map((s) => (
              <label key={s.id} style={{ display: "flex", alignItems: "center", gap: "10px", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={selectedSupplierIds.includes(s.supplier_id)} onChange={() => toggleSupplier(s.supplier_id)} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: "14px" }}>{s.supplier_name}</strong>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{s.supplier_email}</span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{s.category || "Kategori yok"}</span>
                </div>
              </label>
            ))
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button type="button" onClick={onClose} style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}>
            İptal
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || selectedSupplierIds.length === 0}
            style={{ padding: "8px 14px", borderRadius: "6px", border: "none", background: sending ? "#9ca3af" : "#2563eb", color: "#fff", cursor: sending ? "not-allowed" : "pointer", fontWeight: 700 }}
          >
            {sending ? "Gönderiliyor..." : `Gönder (${selectedSupplierIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
