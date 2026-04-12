// web/src/components/SupplierResponsePortal.tsx
import { Fragment, useState, useEffect, useCallback, type ChangeEvent } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: #1f2937;
  }

  p {
    color: #6b7280;
    margin: 5px 0 0 0;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f9fafb;
  }
`;

const Button = styled.button<{ variant?: "primary" | "success" | "secondary" }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.variant) {
      case "success":
        return "#10b981";
      case "secondary":
        return "#6b7280";
      default:
        return "#3b82f6";
    }
  }};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.status) {
      case "tasarı":
        return "#f3f4f6";
      case "gönderilen":
        return "#fef3c7";
      case "revize_edildi":
        return "#ffedd5";
      case "yanıtlandı":
        return "#d1fae5";
      case "reddedildi":
      case "kapatildi":
      case "kapatıldı":
      case "kapatildi_yuksek_fiyat":
      case "kapatıldı_yüksek_fiyat":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "tasarı":
        return "#374151";
      case "gönderilen":
        return "#92400e";
      case "revize_edildi":
        return "#9a3412";
      case "yanıtlandı":
        return "#065f46";
      case "reddedildi":
      case "kapatildi":
      case "kapatıldı":
      case "kapatildi_yuksek_fiyat":
      case "kapatıldı_yüksek_fiyat":
        return "#991b1b";
      default:
        return "#374151";
    }
  }};
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 15px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 13px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
`;

interface QuoteItem {
  id: number;
  quote_item_id: number;
  description: string;
  unit: string;
  quantity: number;
  vat_rate?: number;
  original_unit_price: number;
  supplier_unit_price: number;
  supplier_total_price: number;
  notes?: string;
  is_group_header?: boolean;
  line_number?: string;
  item_detail?: string;
  item_image_url?: string;
}

interface PendingQuote {
  id: number;
  supplier_id: number;
  quote_id: number;
  quote_title: string;
  quote_status?: string;
  selected_supplier_id?: number | null;
  status: string;
  total_amount: number;
  final_amount: number;
  payment_terms?: string;
  delivery_time?: number;
  warranty?: string;
  items: QuoteItem[];
  created_at: string;
  submitted_at?: string;
}

interface SupplierResponsePortalProps {
  apiUrl: string;
  authToken: string;
  supplierUserId?: number;
}

export function SupplierResponsePortal({
  apiUrl,
  authToken,
}: SupplierResponsePortalProps) {
  const [quotes, setQuotes] = useState<PendingQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    [key: number]: {
      items: Array<{
        quote_item_id: number;
        unit_price: number;
        total_price: number;
        notes: string;
      }>;
      total_amount: number;
      discount_percent: number;
      discount_amount: number;
      final_amount: number;
      payment_terms: string;
      delivery_time: number;
      warranty: string;
    };
  }>({});

  const [submitting, setSubmitting] = useState<number | null>(null);
  const [focusedPriceInput, setFocusedPriceInput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "submitted" | "closed">("pending");

  const normalizeStatus = (value?: string | null): string => String(value || "").toLowerCase();

  const isClosedQuote = (q: PendingQuote): boolean => {
    const quoteStatus = normalizeStatus(q.quote_status);
    const supplierStatus = normalizeStatus(q.status);
    // revize_edildi her zaman aktif (bekleyen) sayılır — kapalı değil
    if (supplierStatus === "revize_edildi") return false;
    return (
      quoteStatus === "approved" ||
      quoteStatus === "rejected" ||
      supplierStatus === "reddedildi" ||
      supplierStatus === "kapatildi" ||
      supplierStatus === "kapatıldı" ||
      supplierStatus === "kapatildi_yuksek_fiyat" ||
      supplierStatus === "kapatıldı_yüksek_fiyat"
    );
  };

  const isSubmittedQuote = (q: PendingQuote): boolean => {
    const supplierStatus = normalizeStatus(q.status);
    return supplierStatus === "yanıtlandı" && !isClosedQuote(q);
  };

  const isPendingQuote = (q: PendingQuote): boolean => {
    if (isClosedQuote(q) || isSubmittedQuote(q)) return false;
    const supplierStatus = normalizeStatus(q.status);
    return supplierStatus === "gönderilen" || supplierStatus === "tasarı" || supplierStatus === "revize_edildi" || !supplierStatus;
  };

  const getClosedReason = (q: PendingQuote): string => {
    const quoteStatus = normalizeStatus(q.quote_status);
    if (quoteStatus === "approved") {
      if (q.selected_supplier_id && q.selected_supplier_id !== q.supplier_id) {
        return "Fiyatınız yüksek bulunduğu için sözleşme başka tedarikçi ile yapıldı.";
      }
      if (q.selected_supplier_id && q.selected_supplier_id === q.supplier_id) {
        return "Teklifiniz onaylandı. Sözleşme süreci başlatılacaktır.";
      }
      return "Bu teklif yönetici tarafından onaylanarak kapatıldı.";
    }
    if (quoteStatus === "rejected") {
      return "İş kapsamı değişikliği veya red nedeniyle teklif kapatıldı.";
    }
    return "Teklif kapatıldı.";
  };

  const pendingQuotes = quotes.filter(isPendingQuote);
  const submittedQuotes = quotes.filter(isSubmittedQuote);
  const closedQuotes = quotes.filter(isClosedQuote);

  const loadQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiUrl}/api/v1/supplier-quotes/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData?.detail || "Teklif listesi yüklenemedi";
        throw new Error(errorMsg);
      }

      const data: PendingQuote[] = await response.json();
      setQuotes(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Teklif listesi yüklenemedi";
      setError(errorMsg);
      console.error("Error loading quotes:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authToken]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  function initializeForm(quote: PendingQuote) {
    if (!formData[quote.id]) {
      setFormData((prev) => ({
        ...prev,
        [quote.id]: {
          items: quote.items
            .filter((item) => !item.is_group_header)
            .map((item) => ({
            quote_item_id: item.quote_item_id,
            unit_price: item.supplier_unit_price || 0,
            total_price: item.supplier_total_price || 0,
            notes: item.notes || "",
          })),
          total_amount: quote.total_amount,
          discount_percent: 0,
          discount_amount: 0,
          final_amount: quote.final_amount,
          payment_terms: quote.payment_terms || "",
          delivery_time: quote.delivery_time || 0,
          warranty: quote.warranty || "",
        },
      }));
    }
  }

  async function handleSaveDraft(quoteId: number) {
    try {
      setSubmitting(quoteId);
      const data = formData[quoteId];

      const response = await fetch(
        `${apiUrl}/api/v1/supplier-quotes/${quoteId}/draft-save`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Taslak kaydedilemedi");
      }

      setSuccess("✅ Taslak kaydedildi");
      window.alert("Teklif taslağı kaydedildi.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(null);
    }
  }

  async function handleSubmit(quoteId: number) {
    try {
      setSubmitting(quoteId);
      const data = formData[quoteId];

      const response = await fetch(
        `${apiUrl}/api/v1/supplier-quotes/${quoteId}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Teklif gönderilemedi");
      }

      setSuccess("✅ Teklif başarıyla gönderildi. Yönetici panelinde ilgili teklif detayında görülebilir.");
      window.alert("Teklif gönderildi. Yönetici panelinde ilgili teklif detayında görüntülenebilir.");
      setExpanded(null);
      loadQuotes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(null);
    }
  }

  if (loading) {
    return <Container>Yükleniyor...</Container>;
  }

  return (
    <Container>
      <Header>
        <h2>📬 Teklif Yanıtları</h2>
        <p>Gönderilen tekliflere fiyat girerek yanıt verin</p>
      </Header>

      {error && <ErrorMessage>❌ {error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {/* Tab navigasyonu */}
      <div style={{ display: "flex", gap: "0", marginBottom: "16px", borderBottom: "2px solid #e5e7eb" }}>
        {([
          { key: "pending", label: "Bekleyen", count: pendingQuotes.length, activeColor: "#f59e0b", activeBg: "#fffbeb" },
          { key: "submitted", label: "Gönderilen", count: submittedQuotes.length, activeColor: "#059669", activeBg: "#f0fdf4" },
          { key: "closed", label: "Kapanmış", count: closedQuotes.length, activeColor: "#dc2626", activeBg: "#fef2f2" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 18px",
              border: "none",
              borderBottom: activeTab === tab.key ? `3px solid ${tab.activeColor}` : "3px solid transparent",
              background: activeTab === tab.key ? tab.activeBg : "transparent",
              cursor: "pointer",
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: "14px",
              color: activeTab === tab.key ? tab.activeColor : "#6b7280",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {tab.label}
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "20px",
              height: "20px",
              borderRadius: "999px",
              padding: "0 6px",
              fontSize: "11px",
              fontWeight: 700,
              background: activeTab === tab.key ? tab.activeColor : "#e5e7eb",
              color: activeTab === tab.key ? "#fff" : "#6b7280",
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {quotes.length === 0 ? (
        <EmptyState>
          <p>Henüz teklif alınmamış veya tüm tekliflere yanıt verilmiş</p>
        </EmptyState>
      ) : activeTab === "pending" ? (
        pendingQuotes.length === 0 ? (
          <EmptyState><p>Bekleyen teklif yok.</p></EmptyState>
        ) :
        pendingQuotes
          .map((quote) => {
            if (!formData[quote.id]) {
              initializeForm(quote);
            }

            const data = formData[quote.id];
            const isRevisionRequested = normalizeStatus(quote.status) === "revize_edildi";

            return (
              <Card key={quote.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "8px 0",
                  }}
                  onClick={() =>
                    setExpanded(expanded === quote.id ? null : quote.id)
                  }
                >
                  <div>
                    <h3 style={{ margin: "0 0 5px 0" }}>
                      {quote.quote_title}
                    </h3>
                    <p style={{ margin: "0", fontSize: "13px", color: "#6b7280" }}>
                      {quote.items.length} kalem • Son Tarih:{" "}
                      {new Date(quote.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <StatusBadge status={quote.status}>
                    {quote.status}
                  </StatusBadge>
                </div>

                {expanded === quote.id && data && (
                  <>
                    {isRevisionRequested && (
                      <div
                        style={{
                          marginTop: "10px",
                          marginBottom: "8px",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          background: "#fff7ed",
                          border: "1px solid #fdba74",
                          fontSize: "12px",
                          color: "#9a3412",
                        }}
                      >
                        Revize istendi. Eski fiyatlar sabit gösterilir, her kaleme yeni revize fiyat girilir.
                      </div>
                    )}
                    <Table style={{ marginTop: "15px" }}>
                      <thead>
                        <tr>
                          <th>Kalem</th>
                          <th>Ünite</th>
                          <th>Miktar</th>
                          <th>Birim Fiyat</th>
                          <th>Birim Toplam Fiyat</th>
                          <th>KDV Tutar</th>
                          <th>KDV Dahil Toplam</th>
                          <th>Notlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quote.items.map((quoteItem, idx) => {
                          const isHeader = !!quoteItem.is_group_header;
                          const currentGroupKey = (quoteItem.line_number || "").split(".")[0];
                          const groupChildren = quote.items.filter(
                            (qi) => !qi.is_group_header && (qi.line_number || "").startsWith(`${currentGroupKey}.`)
                          );
                          const headerNet = groupChildren.reduce((sum, qi) => {
                            const formLine = data.items.find((fi) => fi.quote_item_id === qi.quote_item_id);
                            return sum + Number(formLine?.total_price || 0);
                          }, 0);
                          const headerVat = groupChildren.reduce((sum, qi) => {
                            const formLine = data.items.find((fi) => fi.quote_item_id === qi.quote_item_id);
                            const net = Number(formLine?.total_price || 0);
                            const rate = Number(qi.vat_rate ?? 20);
                            return sum + (net * rate) / 100;
                          }, 0);
                          // Başlık satırı
                          if (isHeader) {
                            return (
                              <tr
                                key={idx}
                                style={{
                                  background: "#fef3c7",
                                  borderBottom: "2px solid #eab308",
                                  fontWeight: 700,
                                }}
                              >
                                <td
                                  colSpan={3}
                                  style={{
                                    padding: "10px 12px",
                                    color: "#92400e",
                                    fontSize: "13px",
                                    letterSpacing: "0.03em",
                                  }}
                                >
                                  <span
                                    style={{
                                      background: "#f59e0b",
                                      color: "#fff",
                                      borderRadius: "999px",
                                      padding: "2px 8px",
                                      fontSize: "11px",
                                      marginRight: "8px",
                                      fontWeight: 700,
                                    }}
                                  >
                                    Grup
                                  </span>
                                  {quoteItem.description}
                                </td>
                                <td style={{ padding: "10px 12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                                  <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700 }}>Grup Toplamı</span>
                                </td>
                                <td style={{ padding: "10px 12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                                    <span>₺{headerNet.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                                  </div>
                                </td>
                                <td style={{ padding: "10px 12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                                  ₺{headerVat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: "10px 12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                                  ₺{(headerNet + headerVat).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: "10px 12px" }}></td>
                              </tr>
                            );
                          }
                          // Normal kalem - formData içindeki index'i bul
                          const formIdx = data.items.findIndex(
                            (fi) => fi.quote_item_id === quoteItem.quote_item_id
                          );
                          if (formIdx === -1) return null;
                          const item = data.items[formIdx];
                          const vatRate = Number(quoteItem.vat_rate ?? 20);
                          const vatAmount = item.total_price * (vatRate / 100);
                          const grossTotal = item.total_price + vatAmount;
                          return (
                            <Fragment key={idx}>
                              <tr style={{ background: "#fff" }}>
                              <td style={{ verticalAlign: "top", paddingBottom: quoteItem.item_detail || quoteItem.item_image_url ? "2px" : undefined }}>
                                <div style={{ fontWeight: 600 }}>{quoteItem.description}</div>
                              </td>
                              <td>{quoteItem.unit}</td>
                              <td>
                                {quoteItem.quantity.toLocaleString("tr-TR")}
                              </td>
                              <td>
                                {isRevisionRequested && (
                                  <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>
                                    Eski: ₺{Number(quoteItem.supplier_unit_price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                  </div>
                                )}
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.unit_price === 0 && focusedPriceInput === `${quote.id}-${formIdx}` ? "" : item.unit_price}
                                  onFocus={() => setFocusedPriceInput(`${quote.id}-${formIdx}`)}
                                  onBlur={() => setFocusedPriceInput((prev) => (prev === `${quote.id}-${formIdx}` ? null : prev))}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const newItems = [...data.items];
                                    const raw = e.target.value.trim();
                                    const parsed = raw === "" ? 0 : (parseFloat(raw) || 0);
                                    newItems[formIdx].unit_price = parsed;
                                    newItems[formIdx].total_price =
                                      newItems[formIdx].unit_price *
                                      (quoteItem.quantity || 0);

                                    const total = newItems.reduce(
                                      (sum, i) => sum + i.total_price,
                                      0
                                    );

                                    setFormData((prev) => ({
                                      ...prev,
                                      [quote.id]: {
                                        ...data,
                                        items: newItems,
                                        total_amount: total,
                                        final_amount:
                                          total -
                                          (total *
                                            (data.discount_percent / 100) || 0),
                                      },
                                    }));
                                  }}
                                  style={{ width: "100%" }}
                                />
                              </td>
                              <td>
                                {isRevisionRequested && (
                                  <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "2px" }}>
                                    Eski: ₺{Number(quoteItem.supplier_total_price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                  </div>
                                )}
                                <div>
                                  ₺
                                  {item.total_price.toLocaleString("tr-TR", {
                                    minimumFractionDigits: 2,
                                  })}
                                </div>
                              </td>
                              <td>
                                ₺
                                {vatAmount.toLocaleString("tr-TR", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                ₺
                                {grossTotal.toLocaleString("tr-TR", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  value={item.notes}
                                  placeholder="Not..."
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const newItems = [...data.items];
                                    newItems[formIdx].notes = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      [quote.id]: {
                                        ...data,
                                        items: newItems,
                                      },
                                    }));
                                  }}
                                  style={{ width: "100%" }}
                                />
                              </td>
                            </tr>
                            {(quoteItem.item_detail || quoteItem.item_image_url) && (
                              <tr style={{ background: "#fafafa" }}>
                                <td colSpan={8} style={{ paddingTop: "2px", paddingBottom: "10px", paddingLeft: "12px" }}>
                                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                    {quoteItem.item_image_url && (
                                      <a href={quoteItem.item_image_url} target="_blank" rel="noopener noreferrer" title="Görseli yeni sekmede aç">
                                        <img
                                          src={quoteItem.item_image_url}
                                          alt="Kalem görseli"
                                          style={{ width: "160px", height: "110px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb", flexShrink: 0 }}
                                        />
                                      </a>
                                    )}
                                    {quoteItem.item_detail && (
                                      <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                                        {quoteItem.item_detail}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </Table>

                    <Form>
                      <FormGroup style={{ gridColumn: "1 / -1" }}>
                        <Label>Toplam Tutar</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.total_amount}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [quote.id]: {
                                ...data,
                                total_amount: parseFloat(e.target.value) || 0,
                              },
                            }))
                          }
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>İndirim %</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={data.discount_percent}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const pct = parseFloat(e.target.value) || 0;
                            const amount =
                              (data.total_amount * pct) / 100;
                            setFormData((prev) => ({
                              ...prev,
                              [quote.id]: {
                                ...data,
                                discount_percent: pct,
                                discount_amount: amount,
                                final_amount: data.total_amount - amount,
                              },
                            }));
                          }}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>İndirim Tutar</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.discount_amount}
                          readOnly
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Final Tutar</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.final_amount}
                          readOnly
                          style={{
                            fontWeight: "bold",
                            color: "#10b981",
                            fontSize: "16px",
                          }}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Teslimat Süresi (Gün)</Label>
                        <Input
                          type="number"
                          value={data.delivery_time}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev) => ({
                              ...prev,
                              [quote.id]: {
                                ...data,
                                delivery_time: parseInt(e.target.value) || 0,
                              },
                            }))
                          }
                        />
                      </FormGroup>

                      <FormGroup style={{ gridColumn: "1 / -1" }}>
                        <Label>Ödeme Şartları</Label>
                        <Input
                          type="text"
                          placeholder="Örn: %50 peşin, %50 30 gün"
                          value={data.payment_terms}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev) => ({
                              ...prev,
                              [quote.id]: {
                                ...data,
                                payment_terms: e.target.value,
                              },
                            }))
                          }
                        />
                      </FormGroup>

                      <FormGroup style={{ gridColumn: "1 / -1" }}>
                        <Label>Garanti</Label>
                        <Input
                          type="text"
                          placeholder="Örn: 12 ay ürün garantisi"
                          value={data.warranty}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev) => ({
                              ...prev,
                              [quote.id]: {
                                ...data,
                                warranty: e.target.value,
                              },
                            }))
                          }
                        />
                      </FormGroup>
                    </Form>

                    <div style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
                      <Button
                        variant="secondary"
                        onClick={() => handleSaveDraft(quote.id)}
                        disabled={submitting !== null}
                      >
                        {submitting === quote.id ? "⏳" : "💾"} Taslak Kaydet
                      </Button>
                      <Button
                        onClick={() => handleSubmit(quote.id)}
                        disabled={submitting !== null}
                      >
                        {submitting === quote.id
                          ? "⏳ Gönderiliyor..."
                          : (isRevisionRequested ? "✅ Revize Teklifi Gönder" : "✅ Teklifi Gönder")}
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            );
          })
      ) : activeTab === "submitted" ? (
        submittedQuotes.length === 0 ? (
          <EmptyState><p>Henüz gönderilmiş teklif yok.</p></EmptyState>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {submittedQuotes.map((q) => (
              <Card key={`submitted-${q.id}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{q.quote_title}</div>
                    <div style={{ marginTop: "4px", fontSize: "13px", color: "#475569" }}>
                      Gönderilen Tutar: ₺{Number(q.final_amount || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </div>
                    {q.submitted_at && (
                      <div style={{ marginTop: "4px", fontSize: "12px", color: "#9ca3af" }}>
                        Gönderilme: {new Date(q.submitted_at).toLocaleString("tr-TR")}
                      </div>
                    )}
                  </div>
                  <StatusBadge status={q.status}>{q.status}</StatusBadge>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        closedQuotes.length === 0 ? (
          <EmptyState><p>Kapanmış teklif yok.</p></EmptyState>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {closedQuotes.map((q) => (
              <Card key={`closed-${q.id}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{q.quote_title}</div>
                    <div style={{ marginTop: "4px", fontSize: "13px", color: "#475569" }}>
                      Son Teklifiniz: ₺{Number(q.final_amount || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "#7c2d12",
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "6px",
                      padding: "8px 10px",
                    }}>
                      ℹ️ {getClosedReason(q)}
                    </div>
                  </div>
                  <StatusBadge status={q.status}>{q.status}</StatusBadge>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </Container>
  );
}
