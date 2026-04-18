import { useEffect, useMemo, useState } from "react";
import { http } from "../lib/http";
import { resolveApprovalRoleLabel } from "../auth/permissions";
import type { QuotePendingApprovalLike } from "../types/approval";

type SupplierSourceType = "all" | "private" | "platform_network";

type ProjectSupplier = {
  id: number;
  supplier_id: number;
  supplier_name: string;
  supplier_email: string;
  source_type?: "private" | "platform_network";
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
  const [selectedSourceType, setSelectedSourceType] = useState<SupplierSourceType>("all");
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<number[]>([]);
  const [alreadySentSupplierIds, setAlreadySentSupplierIds] = useState<number[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<QuotePendingApprovalLike[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingSentSuppliers, setLoadingSentSuppliers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSentSuppliers = async () => {
      try {
        setLoadingSentSuppliers(true);
        const [sentRes, approvalsRes] = await Promise.all([
          http.get<Array<{ supplier_id: number }>>(`/quotes/${quoteId}/suppliers`),
          http.get<QuotePendingApprovalLike[]>(`/approvals/${quoteId}/pending`),
        ]);
        if (cancelled) return;
        const supplierIds = Array.isArray(sentRes.data)
          ? sentRes.data.map((row) => Number(row.supplier_id)).filter((value) => Number.isFinite(value))
          : [];
        setAlreadySentSupplierIds(supplierIds);
        setPendingApprovals(Array.isArray(approvalsRes.data) ? approvalsRes.data.filter((approval) => approval.status === "beklemede") : []);
        setSelectedSupplierIds((prev) => prev.filter((id) => !supplierIds.includes(id)));
      } catch {
        if (!cancelled) {
          setAlreadySentSupplierIds([]);
          setPendingApprovals([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingSentSuppliers(false);
        }
      }
    };

    void loadSentSuppliers();
    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    suppliers.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "tr"))];
  }, [suppliers]);

  const visibleSuppliers = useMemo(() => {
    const active = suppliers.filter((s) => s.is_active);
    const sourceFiltered =
      selectedSourceType === "all"
        ? active
        : active.filter((s) => (s.source_type || "private") === selectedSourceType);
    if (selectedCategory === "all") return sourceFiltered;
    return sourceFiltered.filter((s) => (s.category || "") === selectedCategory);
  }, [suppliers, selectedCategory, selectedSourceType]);

  const sourceSummary = useMemo(
    () => ({
      all: suppliers.filter((s) => s.is_active).length,
      private: suppliers.filter((s) => s.is_active && (s.source_type || "private") === "private").length,
      platform_network: suppliers.filter((s) => s.is_active && (s.source_type || "private") === "platform_network").length,
    }),
    [suppliers],
  );

  const toggleSupplier = (supplierId: number) => {
    if (alreadySentSupplierIds.includes(supplierId)) {
      return;
    }
    setSelectedSupplierIds((prev) =>
      prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId]
    );
  };

  const selectAllVisible = () => {
    setSelectedSupplierIds((prev) => {
      const set = new Set(prev);
      visibleSuppliers
        .filter((s) => !alreadySentSupplierIds.includes(s.supplier_id))
        .forEach((s) => set.add(s.supplier_id));
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

        {loadingSentSuppliers && (
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "12px" }}>
            Daha önce gönderilen tedarikçiler kontrol ediliyor...
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px", marginBottom: "12px" }}>
          {[
            { key: "all", label: "Tum Kaynaklar", value: sourceSummary.all, color: "#0f172a" },
            { key: "private", label: "Private Supplier", value: sourceSummary.private, color: "#7c3aed" },
            { key: "platform_network", label: "Platform Agi", value: sourceSummary.platform_network, color: "#0f766e" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedSourceType(item.key as SupplierSourceType)}
              style={{
                border: selectedSourceType === item.key ? `2px solid ${item.color}` : "1px solid #d1d5db",
                borderRadius: "14px",
                padding: "10px 12px",
                cursor: "pointer",
                background: "#fff",
                color: item.color,
                fontSize: "12px",
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              <div style={{ textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</div>
              <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: 900 }}>{item.value}</div>
            </button>
          ))}
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

        {pendingApprovals.length > 0 && (
          <div style={{ background: "#fff7ed", color: "#9a3412", padding: "10px", borderRadius: "6px", marginBottom: "10px", border: "1px solid #fdba74" }}>
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>
              Tedarikçiye gönderim henüz açılamaz
            </div>
            {pendingApprovals.map((approval) => (
              <div key={approval.id} style={{ fontSize: "12px" }}>
                Seviye {approval.level}: {resolveApprovalRoleLabel(approval)} onayı bekleniyor
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gap: "8px", marginBottom: "12px" }}>
          {visibleSuppliers.length === 0 ? (
            <div style={{ color: "#6b7280", fontSize: "13px", padding: "8px" }}>Bu filtrede tedarikçi yok.</div>
          ) : (
            visibleSuppliers.map((s) => (
              <label
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "10px",
                  cursor: alreadySentSupplierIds.includes(s.supplier_id) ? "not-allowed" : "pointer",
                  opacity: alreadySentSupplierIds.includes(s.supplier_id) ? 0.6 : 1,
                  background: alreadySentSupplierIds.includes(s.supplier_id) ? "#f9fafb" : "#fff",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSupplierIds.includes(s.supplier_id)}
                  disabled={alreadySentSupplierIds.includes(s.supplier_id) || pendingApprovals.length > 0}
                  onChange={() => toggleSupplier(s.supplier_id)}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: "14px" }}>{s.supplier_name}</strong>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{s.supplier_email}</span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{s.category || "Kategori yok"}</span>
                  <span style={{ fontSize: "12px", color: s.source_type === "platform_network" ? "#0f766e" : "#7c3aed", fontWeight: 600 }}>
                    {s.source_type === "platform_network" ? "Platform Agi" : "Private Supplier"}
                  </span>
                  {alreadySentSupplierIds.includes(s.supplier_id) && (
                    <span style={{ fontSize: "12px", color: "#92400e", fontWeight: 600 }}>
                      Bu tedarikçiye daha önce gönderildi
                    </span>
                  )}
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
            disabled={sending || loadingSentSuppliers || pendingApprovals.length > 0 || selectedSupplierIds.length === 0}
            style={{ padding: "8px 14px", borderRadius: "6px", border: "none", background: sending || loadingSentSuppliers || pendingApprovals.length > 0 ? "#9ca3af" : "#2563eb", color: "#fff", cursor: sending || loadingSentSuppliers || pendingApprovals.length > 0 ? "not-allowed" : "pointer", fontWeight: 700 }}
          >
            {sending ? "Gönderiliyor..." : `Gönder (${selectedSupplierIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
