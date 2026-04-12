// QuoteDetail Page
import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  getQuote,
  updateQuote,
  updateQuoteItems,
  deleteQuote,
  submitQuote,
  approveQuote,
  rejectQuote,
  getQuoteHistory,
  getSupplierQuotesGrouped,
  requestQuoteRevision,
  submitRevisionedQuote,
  type SupplierQuotesGrouped,
  type SupplierQuoteRevision,
} from "../services/quote.service";
import type { Quote, StatusLog, QuoteItemPayload } from "../services/quote.service";
import { useAuth } from "../hooks/useAuth";
import { QuoteStatusLabel, QuoteStatusColor, type QuoteStatus } from "../types/quote.types";
import { getSettings } from "../services/settings.service";
import { SupplierQuotesGroupedView } from "../components/SupplierQuotesGroupedView";
import { ReviseRequestModal } from "../components/ReviseRequestModal";
import { ReviseSubmitModal } from "../components/ReviseSubmitModal";

function normalizeQuoteStatus(status: Quote["status"]): QuoteStatus {
  const normalized = String(status).toLowerCase();
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  if (normalized === "submitted" || normalized === "sent" || normalized === "pending" || normalized === "responded") {
    return "submitted";
  }
  return "draft";
}

const IS = {
  inp: {
    width: "100%", padding: "7px 9px", border: "1px solid #d1d5db",
    borderRadius: "5px", fontSize: "14px", boxSizing: "border-box" as const,
  },
  cellInp: {
    width: "100%", padding: "4px 6px", border: "1px solid #d1d5db",
    borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" as const,
  },
  label: { display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "#374151" } as React.CSSProperties,
};

const EMPTY_ITEM = (): QuoteItemPayload => ({
  line_number: "", category_code: "", category_name: "",
  description: "", unit: "adet", quantity: 1, unit_price: undefined, vat_rate: 20,
});

type ItemMeta = { detail: string; imageUrl: string };

const parseItemMeta = (notes?: string): ItemMeta => {
  if (!notes) return { detail: "", imageUrl: "" };
  try {
    const parsed = JSON.parse(notes) as { detail?: string; image_url?: string };
    return {
      detail: parsed.detail || "",
      imageUrl: parsed.image_url || "",
    };
  } catch {
    return { detail: notes, imageUrl: "" };
  }
};

const composeItemMeta = (detail: string, imageUrl: string): string | undefined => {
  const d = detail.trim();
  const i = imageUrl.trim();
  if (!d && !i) return undefined;
  return JSON.stringify({ detail: d, image_url: i });
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsDataURL(file);
  });

type QuoteItemLike = QuoteItemPayload | NonNullable<Quote["items"]>[number];

const isGroupHeaderRow = (item: QuoteItemLike): boolean => {
  const explicit = (item as { is_group_header?: boolean }).is_group_header;
  if (explicit) return true;
  const line = String(item.line_number || "").trim();
  return line.length > 0 && !line.includes(".");
};

const resolveGroupKey = (item: QuoteItemLike): string => {
  const explicitKey = (item as { group_key?: string }).group_key;
  if (explicitKey) return String(explicitKey);
  const line = String(item.line_number || "").trim();
  if (!line) return "";
  return line.includes(".") ? line.split(".")[0] : line;
};

type GroupTotals = { net: number; vat: number; gross: number };

const buildGroupTotals = (items: QuoteItemLike[]): Record<string, GroupTotals> => {
  const totals: Record<string, GroupTotals> = {};
  items.forEach((item) => {
    if (isGroupHeaderRow(item)) return;
    const key = resolveGroupKey(item);
    if (!key) return;
    const net = Number((item as { total_price?: number }).total_price ?? 0) || (Number(item.quantity || 0) * Number(item.unit_price || 0));
    const vatRate = Number(item.vat_rate ?? 20);
    const vat = net * (vatRate / 100);
    if (!totals[key]) {
      totals[key] = { net: 0, vat: 0, gross: 0 };
    }
    totals[key].net += net;
    totals[key].vat += vat;
    totals[key].gross += net + vat;
  });
  return totals;
};

const renumberItems = (rows: QuoteItemPayload[]): QuoteItemPayload[] => {
  let groupNo = 0;
  let currentGroup = "";
  let plainNo = 0;
  const childCounters: Record<string, number> = {};

  return rows.map((row) => {
    const header = isGroupHeaderRow(row);
    if (header) {
      groupNo += 1;
      currentGroup = String(groupNo);
      childCounters[currentGroup] = 0;
      return {
        ...row,
        is_group_header: true,
        group_key: currentGroup,
        line_number: currentGroup,
      };
    }
    const effectiveGroup = row.group_key || currentGroup;
    if (!effectiveGroup) {
      plainNo += 1;
      return {
        ...row,
        is_group_header: false,
        group_key: undefined,
        line_number: String(plainNo),
      };
    }
    if (!childCounters[effectiveGroup]) childCounters[effectiveGroup] = 0;
    childCounters[effectiveGroup] += 1;
    return {
      ...row,
      is_group_header: false,
      group_key: effectiveGroup,
      line_number: `${effectiveGroup}.${childCounters[effectiveGroup]}`,
    };
  });
};

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [history, setHistory] = useState<StatusLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "", description: "",
  });
  const [editItems, setEditItems] = useState<QuoteItemPayload[]>([]);
  const [vatRates, setVatRates] = useState<number[]>([1, 10, 20]);
  const [actionReason, setActionReason] = useState("");
  const [collapsedEditGroups, setCollapsedEditGroups] = useState<Record<string, boolean>>({});
  const [collapsedViewGroups, setCollapsedViewGroups] = useState<Record<string, boolean>>({});
  
  // Revize sistemi state'leri
  const [supplierQuotes, setSupplierQuotes] = useState<SupplierQuotesGrouped[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [selectedSupplierQuote, setSelectedSupplierQuote] = useState<SupplierQuoteRevision | null>(null);
  const [reviseRequestModal, setReviseRequestModal] = useState<{ visible: boolean; supplierQuoteId: number; supplierName: string }>({
    visible: false,
    supplierQuoteId: 0,
    supplierName: "",
  });
  const [reviseSubmitModal, setReviseSubmitModal] = useState<{ visible: boolean; supplierQuoteId: number; supplierName: string }>({
    visible: false,
    supplierQuoteId: 0,
    supplierName: "",
  });
  const detailsCardRef = useRef<HTMLDivElement | null>(null);
  const autoRevisionOpenedRef = useRef(false);

  const clearRevisionActionParams = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("action");
    next.delete("supplierQuoteId");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const q = await getQuote(Number(id));
      setQuote(q);
      setEditData({
        title: q.title,
        description: q.description || "",
      });
      setEditItems(
        renumberItems(
          (q.items || []).map((it) => ({
            line_number: it.line_number,
            category_code: it.category_code,
            category_name: it.category_name,
            group_key: it.group_key,
            is_group_header: it.is_group_header,
            description: it.description,
            unit: it.unit,
            quantity: Number(it.quantity),
            unit_price: it.unit_price != null ? Number(it.unit_price) : undefined,
            vat_rate: it.vat_rate != null ? Number(it.vat_rate) : 20,
            notes: it.notes,
          }))
        )
      );
      const hist = await getQuoteHistory(Number(id));
      setHistory(hist);
      
      // Supplier quotes'ı fetch et
      try {
        setLoadingSuppliers(true);
        const suppliers = await getSupplierQuotesGrouped(Number(id));
        setSupplierQuotes(suppliers);
      } catch (err) {
        console.warn("Supplier quotes yüklenemedi:", err);
        setSupplierQuotes([]);
      } finally {
        setLoadingSuppliers(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Veri yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  useEffect(() => {
    getSettings()
      .then((s) => {
        if (Array.isArray(s.vat_rates) && s.vat_rates.length > 0) {
          setVatRates(s.vat_rates);
        }
      })
      .catch(() => setVatRates([1, 10, 20]));
  }, []);

  useEffect(() => {
    const action = searchParams.get("action");
    const supplierQuoteId = Number(searchParams.get("supplierQuoteId") || 0);
    if (action !== "revize") {
      autoRevisionOpenedRef.current = false;
      return;
    }
    if (!supplierQuoteId || supplierQuotes.length === 0 || autoRevisionOpenedRef.current) return;

    const findQuote = (quotes: SupplierQuoteRevision[]): SupplierQuoteRevision | null => {
      for (const q of quotes) {
        if (q.id === supplierQuoteId) return q;
        if (q.revisions && q.revisions.length > 0) {
          const found = findQuote(q.revisions);
          if (found) return found;
        }
      }
      return null;
    };

    for (const supplier of supplierQuotes) {
      const found = findQuote(supplier.quotes);
      if (!found) continue;
      autoRevisionOpenedRef.current = true;
      setReviseRequestModal({
        visible: true,
        supplierQuoteId: found.id,
        supplierName: supplier.supplier_name,
      });
      break;
    }
  }, [searchParams, supplierQuotes]);

  const updateEditItem = (idx: number, field: keyof QuoteItemPayload, val: string | number | undefined) => {
    setEditItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return renumberItems(next);
    });
  };

  const addEditItem = () => {
    setEditItems((prev) => {
      const lastGroup = [...prev]
        .reverse()
        .find((it) => isGroupHeaderRow(it) && resolveGroupKey(it));
      const groupKey = lastGroup ? resolveGroupKey(lastGroup) : undefined;
      return renumberItems([
        ...prev,
        {
          ...EMPTY_ITEM(),
          group_key: groupKey,
          is_group_header: false,
        },
      ]);
    });
  };

  const addEditGroup = () => {
    setEditItems((prev) =>
      renumberItems([
        ...prev,
        {
          ...EMPTY_ITEM(),
          description: "Yeni Grup",
          unit: "",
          quantity: 0,
          unit_price: undefined,
          vat_rate: 20,
          is_group_header: true,
        },
      ])
    );
  };

  const toggleEditGroup = (groupKey: string) => {
    setCollapsedEditGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const toggleViewGroup = (groupKey: string) => {
    setCollapsedViewGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleEditItemImageSelect = async (idx: number, file: File) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const current = parseItemMeta(editItems[idx]?.notes);
      updateEditItem(idx, "notes", composeItemMeta(current.detail, dataUrl));
    } catch {
      setError("Görsel dosyası okunamadı");
    }
  };

  const handleUpdate = async () => {
    if (!quote || !editData.title) return;
    try {
      const updated = await updateQuote(quote.id, {
        title: editData.title,
        description: editData.description || undefined,
      });
      // Kalem değişikliği varsa kaydet
      const validItems = editItems
        .filter((it) => it.description.trim() || it.line_number.trim())
        .map((it) => {
          const header = isGroupHeaderRow(it);
          const key = resolveGroupKey(it);
          return {
            ...it,
            group_key: key || undefined,
            is_group_header: header,
            unit: header ? "" : it.unit,
            quantity: header ? 0 : Number(it.quantity || 0),
            unit_price: header
              ? undefined
              : (it.unit_price === undefined || it.unit_price === null || it.unit_price === 0
                ? undefined
                : Number(it.unit_price)),
            vat_rate: Number(it.vat_rate ?? 20),
          };
        });
      if (validItems.length > 0 || (quote.items || []).length > 0) {
        const withItems = await updateQuoteItems(quote.id, validItems);
        setQuote(withItems);
      } else {
        setQuote(updated);
      }
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncelleme başarısız");
    }
  };

  const handleDelete = async () => {
    if (!quote || !window.confirm("Teklifi silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteQuote(quote.id);
      navigate("/quotes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silme başarısız");
    }
  };

  const handleSubmit = async () => {
    if (!quote) return;
    try {
      const updated = await submitQuote(quote.id, actionReason ? { reason: actionReason } : undefined);
      setQuote(updated);
      setActionReason("");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gönderme başarısız");
    }
  };

  const handleApprove = async () => {
    if (!quote) return;
    try {
      const updated = await approveQuote(quote.id, actionReason ? { reason: actionReason } : undefined);
      setQuote(updated);
      setActionReason("");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onay başarısız");
    }
  };

  const handleReject = async () => {
    if (!quote || !window.confirm("Teklifi geri çevirmek istediğinizden emin misiniz?")) return;
    try {
      const updated = await rejectQuote(quote.id, actionReason ? { reason: actionReason } : undefined);
      setQuote(updated);
      setActionReason("");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reddetme başarısız");
    }
  };

  useEffect(() => {
    if (!quote) return;
    const status = normalizeQuoteStatus(quote.status);
    const owner = user?.id === quote.created_by_id;
    const admin = user?.role === "admin" || user?.role === "super_admin";
    const editable = (owner || admin) && status === "draft";
    const editRequested = searchParams.get("edit") === "1" || location.pathname.endsWith("/edit");
    if (editable && editRequested) {
      setIsEditing(true);
    }
  }, [quote, user, searchParams, location.pathname]);

  if (loading) return <div style={{ textAlign: "center", padding: 20 }}>Yükleniyor...</div>;
  if (!quote) return <div style={{ textAlign: "center", padding: 20 }}>Teklif bulunamadı</div>;

  const quoteStatus = normalizeQuoteStatus(quote.status);
  const isOwner = user?.id === quote.created_by_id;
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const canEdit = (isOwner || isAdmin) && quoteStatus === "draft";
  const canSubmit = (isOwner || isAdmin) && quoteStatus === "draft";
  const canApprove = isAdmin && quoteStatus === "submitted";
  const canReject = isAdmin && quoteStatus === "submitted";

  const quoteItems = quote.items || [];
  const quoteGroupTotals = buildGroupTotals(quoteItems);
  const editGroupTotals = buildGroupTotals(editItems);
  const netTotal = quoteItems.filter((it) => !isGroupHeaderRow(it)).reduce((s, it) => s + Number(it.total_price || 0), 0);
  const vatTotal = quoteItems.filter((it) => !isGroupHeaderRow(it)).reduce((s, it) => {
    const net = Number(it.total_price || 0);
    const rate = Number(it.vat_rate || 20);
    return s + (net * rate) / 100;
  }, 0);
  const grossTotal = netTotal + vatTotal;
  const editNetTotal = editItems
    .filter((it) => !isGroupHeaderRow(it))
    .reduce((s, it) => s + (Number(it.quantity || 0) * Number(it.unit_price || 0)), 0);
  const editVatTotal = editItems
    .filter((it) => !isGroupHeaderRow(it))
    .reduce((s, it) => {
      const net = Number(it.quantity || 0) * Number(it.unit_price || 0);
      const rate = Number(it.vat_rate ?? 20);
      return s + net * (rate / 100);
    }, 0);
  const editGrossTotal = editNetTotal + editVatTotal;

  // ============================================================================
  // Revize Sistemi Handlers
  // ============================================================================

  const handleRequestRevision = async (reason: string) => {
    if (!quote) return;
    try {
      await requestQuoteRevision(quote.id, reviseRequestModal.supplierQuoteId, reason);
      alert("Revize talebi gönderildi");
      setReviseRequestModal({ visible: false, supplierQuoteId: 0, supplierName: "" });
      clearRevisionActionParams();
      autoRevisionOpenedRef.current = false;
      fetchData(); // Veriyi yenile
    } catch (err) {
      alert("Revize talebi gönderilemedi: " + (err instanceof Error ? err.message : "Bilinmeyen hata"));
    }
  };

  const handleSubmitRevision = async (revisedPrices: Array<{quote_item_id: number; unit_price: number; total_price: number}>) => {
    if (!quote) return;
    try {
      const result = await submitRevisionedQuote(quote.id, reviseSubmitModal.supplierQuoteId, revisedPrices);
      alert(`Revize teklif gönderildi. Tasarruf: ₺${(result.profitability.amount || 0).toLocaleString("tr-TR", {maximumFractionDigits: 2})}`);
      setReviseSubmitModal({ visible: false, supplierQuoteId: 0, supplierName: "" });
      fetchData(); // Veriyi yenile
    } catch (err) {
      alert("Revize teklif gönderilemedi: " + (err instanceof Error ? err.message : "Bilinmeyen hata"));
    }
  };

  const handleViewSupplierQuote = (supplierQuoteId: number) => {
    // Tedarikçi quote'ünü bul ve state'e koy
    const findQuote = (quotes: SupplierQuoteRevision[]): SupplierQuoteRevision | null => {
      for (const q of quotes) {
        if (q.id === supplierQuoteId) return q;
        if (q.revisions && q.revisions.length > 0) {
          const found = findQuote(q.revisions);
          if (found) return found;
        }
      }
      return null;
    };

    let found: SupplierQuoteRevision | null = null;
    for (const supplier of supplierQuotes) {
      found = findQuote(supplier.quotes);
      if (found) break;
    }

    if (found) {
      setSelectedSupplierQuote(found);
      // Modal açmak istiyorsak açabiliriz, şu an sadece select et
    }
  };

  void vatRates;
  void collapsedEditGroups;
  void addEditItem;
  void addEditGroup;
  void toggleEditGroup;
  void handleEditItemImageSelect;
  void editGroupTotals;
  void editGrossTotal;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "16px",
          padding: "8px 12px",
          background: "#f3f4f6",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ← Geri
      </button>

      {error && (
        <div style={{ color: "red", padding: "12px", background: "#fee2e2", borderRadius: "4px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0" }}>{quote.title}</h2>
            <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
              Teklif ID: {quote.id} • V{quote.version}
            </p>
          </div>
          <span
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              background: QuoteStatusColor[quoteStatus],
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {QuoteStatusLabel[quoteStatus]}
          </span>
        </div>
      </div>

      {/* Details */}
      <div
        ref={detailsCardRef}
        style={{ background: "white", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}
      >
        <h3 style={{ margin: "0 0 16px 0" }}>Teklif Detayları</h3>

        {isEditing ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={IS.label}>Başlık *</label>
                <input style={IS.inp} value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
              </div>
              <div>
                <label style={IS.label}>Açıklama</label>
                <input style={IS.inp} value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="İsteğe bağlı" />
              </div>
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: "#f9fafb", color: "#4b5563", marginBottom: "12px", fontSize: "13px" }}>
              Kalem düzenleme görünümü sadeleştirildi. Mevcut kalemleri aşağıda önizleme olarak görebilir, başlık ve açıklamayı güncelleyebilirsiniz.
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleUpdate}
                style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  void fetchData();
                }}
                style={{ padding: "8px 16px", background: "#e5e7eb", color: "#111827", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Vazgeç
              </button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Sıra</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Açıklama</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Birim</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Miktar</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Birim Fiyat</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Birim Toplam Fiyat</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>KDV</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>KDV Tutar</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>KDV Dahil Toplam</th>
                </tr>
              </thead>
              <tbody>
                {(quote.items || []).map((item, idx) => {
                  const header = isGroupHeaderRow(item);
                  const key = resolveGroupKey(item);
                  const meta = parseItemMeta(item.notes);
                  const hiddenChild = !header && !!collapsedViewGroups[key];
                  if (hiddenChild) {
                    return null;
                  }
                  const group = quoteGroupTotals[key] || { net: 0, vat: 0, gross: 0 };
                  const net = header ? group.net : Number(item.total_price || 0);
                  const vatRate = Number(item.vat_rate || 20);
                  const vat = header ? group.vat : net * (vatRate / 100);
                  const gross = header ? group.gross : net + vat;

                  return (
                    <Fragment key={item.id}>
                      <tr style={{ borderBottom: header ? "2px solid #eab308" : "1px solid #eee", background: header ? "#fef3c7" : "transparent", fontWeight: header ? 700 : 400 }}>
                        <td style={{ padding: "10px" }}>{item.line_number || idx + 1}</td>
                        <td style={{ padding: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                            {header && (
                              <button
                                type="button"
                                onClick={() => toggleViewGroup(key)}
                                style={{ border: "none", background: "transparent", cursor: "pointer", fontWeight: 700, color: "#92400e", flexShrink: 0 }}
                                title={collapsedViewGroups[key] ? "Alt kalemleri aç" : "Alt kalemleri kapat"}
                              >
                                {collapsedViewGroups[key] ? "▶" : "▼"}
                              </button>
                            )}
                            {header && (
                              <span style={{ fontSize: "11px", background: "#f59e0b", color: "#fff", borderRadius: "999px", padding: "2px 7px", fontWeight: 700, flexShrink: 0 }}>
                                Grup
                              </span>
                            )}
                            <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>{item.description}</div>
                          </div>
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>{header ? "" : item.unit}</td>
                        <td style={{ padding: "10px", textAlign: "right" }}>{header ? "" : item.quantity}</td>
                        <td style={{ padding: "10px", textAlign: "right" }}>
                          {header ? (
                            <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700 }}>Grup Toplamı</span>
                          ) : (
                            <span>{net > 0 ? `₺${Number(item.unit_price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}` : ""}</span>
                          )}
                        </td>
                        <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>
                          <span>₺{net.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                        </td>
                        <td style={{ padding: "10px", textAlign: "right" }}>{header ? "" : `%${vatRate}`}</td>
                        <td style={{ padding: "10px", textAlign: "right" }}>{`₺${vat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`}</td>
                        <td style={{ padding: "10px", textAlign: "right" }}>{`₺${gross.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`}</td>
                      </tr>
                      {!header ? (
                        <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "0 10px 10px" }}></td>
                          <td colSpan={8} style={{ padding: "0 10px 10px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: meta.imageUrl ? "180px minmax(0, 1fr)" : "minmax(0, 1fr)", gap: "10px", alignItems: "start" }}>
                              {meta.imageUrl && (
                                <div>
                                  <a href={meta.imageUrl} target="_blank" rel="noopener noreferrer" title="Görseli yeni sekmede aç">
                                    <img
                                      src={meta.imageUrl}
                                      alt="Kalem görseli"
                                      style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                                    />
                                  </a>
                                </div>
                              )}
                              <div style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                                {meta.detail || (meta.imageUrl ? "-" : "")}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={8} style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>Teklif Toplamı:</td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>₺{netTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td colSpan={8} style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>KDV Toplamı:</td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>₺{vatTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td colSpan={8} style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>Genel Toplam (KDV Dahil):</td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#15803d" }}>₺{grossTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Actions */}
      {(canEdit || canSubmit || canApprove || canReject) && (
        <div style={{ background: "white", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
          <h3>İşlemler</h3>

          {canEdit && (
            <button
              onClick={() => {
                setIsEditing(true);
                detailsCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                marginRight: "8px",
                marginBottom: "8px",
                padding: "8px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Düzenle
            </button>
          )}

          {canSubmit && (
            <div style={{ marginBottom: "12px" }}>
              <textarea
                placeholder="Onaya gönderme notu (opsiyonel)"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginBottom: "8px",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleSubmit}
                style={{
                  padding: "8px 16px",
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Onaya Gönder
              </button>
            </div>
          )}

          {canApprove && (
            <div style={{ marginBottom: "12px" }}>
              <textarea
                placeholder="Onay notu (opsiyonel)"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginBottom: "8px",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleApprove}
                style={{
                  marginRight: "8px",
                  padding: "8px 16px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Onayla
              </button>
              {canReject && (
                <button
                  onClick={handleReject}
                  style={{
                    padding: "8px 16px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reddet
                </button>
              )}
            </div>
          )}

          {canEdit && (
            <button
              onClick={handleDelete}
              style={{
                marginTop: "8px",
                padding: "8px 16px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sil
            </button>
          )}
        </div>
      )}

      {/* Supplier Quotes / Responses */}
      {supplierQuotes.length > 0 && (
        <div style={{ background: "white", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
          <h3>Tedarikçi Teklifleri</h3>
          <SupplierQuotesGroupedView
            suppliers={supplierQuotes}
            onRequestRevision={async (sqId, sqName) => {
              setReviseRequestModal({ visible: true, supplierQuoteId: sqId, supplierName: sqName });
            }}
            onViewDetails={handleViewSupplierQuote}
            loading={loadingSuppliers}
            isAdmin={isAdmin}
          />
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ background: "white", border: "1px solid #ddd", borderRadius: "8px", padding: "20px" }}>
          <h3>Durum Geçişi Geçmişi</h3>
          <div style={{ fontSize: "14px" }}>
            {history.map((log, idx) => (
              <div
                key={idx}
                style={{
                  padding: "8px 0",
                  borderBottom: idx < history.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                <strong>{log.from_status}</strong> → <strong>{log.to_status}</strong>
                <br />
                <small style={{ color: "#666" }}>
                  {new Date(log.created_at || log.changed_at || "").toLocaleString("tr-TR")}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revise Request Modal */}
      <ReviseRequestModal
        visible={reviseRequestModal.visible}
        supplierQuoteName={reviseRequestModal.supplierName}
        onClose={() => {
          setReviseRequestModal({ visible: false, supplierQuoteId: 0, supplierName: "" });
          clearRevisionActionParams();
          autoRevisionOpenedRef.current = false;
        }}
        onSubmit={handleRequestRevision}
        loading={loadingSuppliers}
      />

      {/* Revise Submit Modal */}
      <ReviseSubmitModal
        visible={reviseSubmitModal.visible}
        supplierQuoteName={reviseSubmitModal.supplierName}
        items={
          selectedSupplierQuote?.items?.map((item: NonNullable<SupplierQuoteRevision["items"]>[number]) => {
            const origItem = quote?.items?.find((qi) => qi.id.toString() === item.quote_item_id.toString());
            return {
              quote_item_id: item.quote_item_id,
              original_unit_price: item.original_unit_price || origItem?.unit_price || 0,
              original_total_price: item.original_total_price || origItem?.total_price || 0,
              item_description: origItem?.description || "Bilinmeyen kalem",
            };
          }) || []
        }
        onClose={() => setReviseSubmitModal({ visible: false, supplierQuoteId: 0, supplierName: "" })}
        onSubmit={handleSubmitRevision}
        loading={loadingSuppliers}
      />
    </div>
  );
}
