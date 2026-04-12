// web/src/components/ReviseSubmitModal.tsx
import { useState, useEffect } from "react";

interface RevisionItem {
  quote_item_id: number;
  original_unit_price: number;
  original_total_price: number;
  item_description: string;
}

interface ReviseSubmitModalProps {
  visible: boolean;
  supplierQuoteName: string;
  items: RevisionItem[];
  onClose: () => void;
  onSubmit: (revisedPrices: Array<{quote_item_id: number; unit_price: number; total_price: number}>) => Promise<void>;
  loading?: boolean;
}

export function ReviseSubmitModal({
  visible,
  supplierQuoteName,
  items,
  onClose,
  onSubmit,
  loading = false,
}: ReviseSubmitModalProps) {
  const [revisedPrices, setRevisedPrices] = useState<Record<number, {unit_price: number; total_price: number}>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible && Object.keys(revisedPrices).length === 0) {
      // İlk yüklemede orijinal fiyatları kopyala
      const initial: typeof revisedPrices = {};
      items.forEach((item) => {
        initial[item.quote_item_id] = {
          unit_price: item.original_unit_price,
          total_price: item.original_total_price,
        };
      });
      setRevisedPrices(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const handleUnitPriceChange = (itemId: number, unitPrice: number) => {
    const item = items.find((i) => i.quote_item_id === itemId);
    if (!item) return;

    const quantity = item.original_total_price / item.original_unit_price;
    const totalPrice = unitPrice * quantity;

    setRevisedPrices((prev) => ({
      ...prev,
      [itemId]: { unit_price: unitPrice, total_price: totalPrice },
    }));
  };

  const handleTotalPriceChange = (itemId: number, totalPrice: number) => {
    const item = items.find((i) => i.quote_item_id === itemId);
    if (!item) return;

    const quantity = item.original_total_price / item.original_unit_price;
    const unitPrice = quantity > 0 ? totalPrice / quantity : 0;

    setRevisedPrices((prev) => ({
      ...prev,
      [itemId]: { unit_price: unitPrice, total_price: totalPrice },
    }));
  };

  const calculateTotalProfitability = () => {
    let totalSavings = 0;
    items.forEach((item) => {
      const revised = revisedPrices[item.quote_item_id];
      if (revised) {
        totalSavings += item.original_total_price - revised.total_price;
      }
    });
    return totalSavings;
  };

  const handleSubmit = async () => {
    const payload = items.map((item) => ({
      quote_item_id: item.quote_item_id,
      unit_price: revisedPrices[item.quote_item_id]?.unit_price || 0,
      total_price: revisedPrices[item.quote_item_id]?.total_price || 0,
    }));

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      setRevisedPrices({});
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalProfitability = calculateTotalProfitability();

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
        overflow: "auto",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "800px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          margin: "20px auto",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Revize Teklif Gönder</h2>

        <div style={{ marginBottom: "16px", padding: "12px", background: "#f3f4f6", borderRadius: "4px" }}>
          <p style={{ margin: 0, fontSize: "14px" }}>
            <strong>Tedarikçi:</strong> {supplierQuoteName}
          </p>
        </div>

        <div style={{ marginBottom: "16px", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ background: "#f3f4f6", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Kalem</th>
                <th style={{ padding: "8px", textAlign: "right" }}>İlk Birim Fiyat</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Revize Birim Fiyat</th>
                <th style={{ padding: "8px", textAlign: "right" }}>İlk Toplam</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Revize Toplam</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Tasarruf</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => {
                if (!item) return null;
                const revised = revisedPrices[item.quote_item_id];
                const savings = (item.original_total_price || 0) - (revised?.total_price || 0);
                // quantity: item.original_total_price / item.original_unit_price (used internally in handlers)

                return (
                  <tr key={item.quote_item_id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{item.item_description}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>
                      ₺{item.original_unit_price.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <input
                        type="number"
                        step="0.01"
                        value={revised?.unit_price || 0}
                        onChange={(e) => handleUnitPriceChange(item.quote_item_id, parseFloat(e.target.value) || 0)}
                        style={{
                          width: "100%",
                          padding: "4px",
                          border: "1px solid #ddd",
                          borderRadius: "3px",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "8px", textAlign: "right" }}>
                      ₺{item.original_total_price.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <input
                        type="number"
                        step="0.01"
                        value={revised?.total_price || 0}
                        onChange={(e) => handleTotalPriceChange(item.quote_item_id, parseFloat(e.target.value) || 0)}
                        style={{
                          width: "100%",
                          padding: "4px",
                          border: "1px solid #ddd",
                          borderRadius: "3px",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        color: savings > 0 ? "#10b981" : savings < 0 ? "#ef4444" : "#666",
                        fontWeight: 600,
                      }}
                    >
                      {savings > 0 ? "+" : ""}₺{savings.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "12px",
            background: totalProfitability > 0 ? "#ecfdf5" : "#fef2f2",
            borderRadius: "4px",
            marginBottom: "16px",
            textAlign: "right",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: totalProfitability > 0 ? "#10b981" : "#ef4444",
            }}
          >
            Toplam Tasarruf: {totalProfitability > 0 ? "+" : ""}₺
            {Math.abs(totalProfitability).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
          </span>
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
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isSubmitting || loading ? "wait" : "pointer",
              fontSize: "14px",
              opacity: isSubmitting || loading ? 0.6 : 1,
            }}
          >
            {isSubmitting || loading ? "Gönderiliyor..." : "Revize Teklif Gönder"}
          </button>
        </div>
      </div>
    </div>
  );
}
