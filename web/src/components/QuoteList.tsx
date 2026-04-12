// QuoteList Component
import { useEffect, useState, useCallback } from "react";
import { getQuotes, deleteQuote } from "../services/quote.service";
import type { Quote } from "../services/quote.service";
import { Link, useNavigate } from "react-router-dom";
import { QuoteStatusLabel, QuoteStatusColor, type QuoteStatus } from "../types/quote.types";
import { http } from "../lib/http";
import SendQuoteModal from "./SendQuoteModal";

function normalizeQuoteStatus(status: Quote["status"]): QuoteStatus {
  const normalized = String(status).toLowerCase();
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  if (normalized === "submitted" || normalized === "sent" || normalized === "pending" || normalized === "responded") {
    return "submitted";
  }
  return "draft";
}

export default function QuoteList() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sendTarget, setSendTarget] = useState<Quote | null>(null);
  const [projectSuppliers, setProjectSuppliers] = useState<Array<{ id: number; supplier_id: number; supplier_name: string; supplier_email: string; category?: string; is_active: boolean }>>([]);

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuotes(page, 10, statusFilter || undefined);
      setQuotes(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Teklif yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleDelete = async (quoteId: number) => {
    if (!window.confirm("Bu teklifi silmek istediğinize emin misiniz?")) return;
    try {
      await deleteQuote(quoteId);
      await fetchQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Teklif silinemedi");
    }
  };

  const openSendModal = async (quote: Quote) => {
    try {
      const res = await http.get(`/suppliers/projects/${quote.project_id}/suppliers`);
      setProjectSuppliers(Array.isArray(res.data) ? res.data : []);
      setSendTarget(quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Projeye ekli tedarikçiler yüklenemedi");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 20 }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: "16px" }}>
      {sendTarget && (
        <SendQuoteModal
          quoteId={sendTarget.id}
          projectId={Number(sendTarget.project_id || 0)}
          suppliers={projectSuppliers}
          onClose={() => setSendTarget(null)}
          onSent={async () => {
            setSendTarget(null);
            await fetchQuotes();
          }}
        />
      )}
      <div style={{ marginBottom: "20px" }}>
        <h3>Teklifler ({total})</h3>

        {/* Filter Bar */}
        <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
          >
            <option value="">Tüm Durumlar</option>
            <option value="draft">Taslak</option>
            <option value="sent">Gönderildi</option>
            <option value="approved">Onaylandı</option>
            <option value="rejected">Reddedildi</option>
          </select>

          <Link to="/quotes/create" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "8px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Yeni Teklif
            </button>
          </Link>
        </div>

        {error && (
          <div style={{ color: "red", padding: "8px", background: "#fee2e2", borderRadius: "4px" }}>
            {error}
          </div>
        )}

        {/* Quote List */}
        {quotes.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>Teklif bulunamadı</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Başlık</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Tutar</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Durum</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Ver</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => {
                  const quoteStatus = normalizeQuoteStatus(quote.status);
                  return (
                  <tr key={quote.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{quote.title}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                      {(quote.total_amount || quote.amount || 0).toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          background: QuoteStatusColor[quoteStatus],
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {QuoteStatusLabel[quoteStatus]}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "12px" }}>
                      {new Date(quote.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                        <Link
                          to={`/quotes/${quote.id}`}
                          style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "bold" }}
                        >
                          Görüntüle
                        </Link>
                        <button
                          onClick={() => navigate(`/quotes/${quote.id}/edit`)}
                          style={{ border: "none", background: "transparent", color: "#0f766e", cursor: "pointer", fontWeight: 700 }}
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          style={{ border: "none", background: "transparent", color: "#dc2626", cursor: "pointer", fontWeight: 700 }}
                        >
                          Sil
                        </button>
                        <button
                          onClick={() => openSendModal(quote)}
                          style={{ border: "none", background: "transparent", color: "#1d4ed8", cursor: "pointer", fontWeight: 700 }}
                        >
                          Gönder
                        </button>
                        {(String(quote.status).toLowerCase() === "sent" || String(quote.status).toLowerCase() === "responded") && (
                          <button
                            onClick={() => navigate(`/quotes/${quote.id}`)}
                            style={{ border: "none", background: "transparent", color: "#7c3aed", cursor: "pointer", fontWeight: 700 }}
                          >
                            Göster
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 10 && (
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "8px" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              Önceki
            </button>
            <span style={{ padding: "8px 12px" }}>
              Sayfa {page} / {Math.ceil(total / 10)}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(Math.ceil(total / 10), p + 1))}
              disabled={page >= Math.ceil(total / 10)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: page >= Math.ceil(total / 10) ? "not-allowed" : "pointer",
                opacity: page >= Math.ceil(total / 10) ? 0.5 : 1,
              }}
            >
              Sonraki
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
