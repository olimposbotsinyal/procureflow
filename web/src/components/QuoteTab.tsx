// web/src/components/QuoteTab.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { Quote } from "../types/quote";
import { http } from "../lib/http";
import SendQuoteModal from "./SendQuoteModal";

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(Button)`
  background-color: #ef4444;

  &:hover {
    background-color: #dc2626;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

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

const ActionButton = styled.button<{ variant?: "danger" | "success" | "info" }>`
  padding: 6px 12px;
  font-size: 12px;
  background-color: ${(props) => {
    if (props.variant === "danger") return "#ef4444";
    if (props.variant === "info") return "#3b82f6";
    return "#10b981";
  }};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case "DRAFT":
        return "#f3f4f6";
      case "SENT":
        return "#fef3c7";
      case "PENDING":
        return "#dbeafe";
      case "RESPONDED":
        return "#d1fae5";
      case "APPROVED":
        return "#86efac";
      case "REJECTED":
        return "#fecaca";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "DRAFT":
        return "#374151";
      case "SENT":
        return "#92400e";
      case "PENDING":
        return "#1e40af";
      case "RESPONDED":
        return "#065f46";
      case "APPROVED":
        return "#166534";
      case "REJECTED":
        return "#991b1b";
      default:
        return "#374151";
    }
  }};
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

interface QuoteTabProps {
  projectId: number;
  apiUrl: string;
  authToken: string;
}

export function QuoteTab({ projectId, apiUrl, authToken }: QuoteTabProps) {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSendForQuote, setShowSendForQuote] = useState<Quote | null>(null);
  const [projectSuppliers, setProjectSuppliers] = useState<Array<{ id: number; supplier_id: number; supplier_name: string; supplier_email: string; category?: string; is_active: boolean }>>([]);

  const handleViewClick = (quoteId: number) => {
    navigate(`/quotes/${quoteId}`);
  };

  const handleEditClick = (quoteId: number) => {
    navigate(`/quotes/${quoteId}/edit`);
  };

  const handleDeleteClick = async (quoteId: number) => {
    if (!window.confirm("Bu teklifi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`${apiUrl}/api/v1/quotes/${quoteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Teklif silinemedi");
      setSuccess("Teklif silindi");
      await loadQuotes();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err) {
      setError(String(err));
    }
  };

  const loadProjectSuppliers = async () => {
    const res = await http.get(`/suppliers/projects/${projectId}/suppliers`);
    setProjectSuppliers(Array.isArray(res.data) ? res.data : []);
  };

  const openSendModal = async (quote: Quote) => {
    try {
      await loadProjectSuppliers();
      setShowSendForQuote(quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Projeye ekli tedarikçiler yüklenemedi");
    }
  };

  const statusLabelTr = (status?: string) => {
    const s = String(status || "DRAFT").toUpperCase();
    if (s === "DRAFT") return "Taslak";
    if (s === "SENT") return "Gönderildi";
    if (s === "PENDING") return "Onay Bekliyor";
    if (s === "RESPONDED") return "Yanıtlandı";
    if (s === "APPROVED") return "Onaylandı";
    if (s === "REJECTED") return "Reddedildi";
    return s;
  };

  const loadQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${apiUrl}/api/v1/quotes/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (!response.ok) throw new Error("Teklifler yüklenemedi");
      const data = await response.json();
      setQuotes(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [projectId, apiUrl, authToken]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  if (loading) return <Container>Yükleniyor...</Container>;

  return (
    <Container>
      {error && <ErrorMessage>❌ {error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {showSendForQuote && (
        <SendQuoteModal
          quoteId={showSendForQuote.id}
          projectId={projectId}
          suppliers={projectSuppliers}
          onClose={() => setShowSendForQuote(null)}
          onSent={async () => {
            setSuccess("Teklif seçilen tedarikçilere gönderildi");
            await loadQuotes();
          }}
        />
      )}

      <Header>
        <h2>Teklifler ({quotes.length})</h2>
        <Button onClick={() => navigate(`/quotes/create?projectId=${projectId}`)}>
          + Yeni Teklif
        </Button>
      </Header>

      {quotes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
          <p>Henüz teklif oluşturulmamış</p>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Durum</th>
              <th>Gönderildi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id}>
                <td>{quote.title}</td>
                <td>
                  <StatusBadge status={String(quote.status || "draft").toUpperCase()}>
                    {statusLabelTr(quote.status)}
                  </StatusBadge>
                </td>
                <td>
                  {quote.sent_at
                    ? new Date(quote.sent_at).toLocaleDateString("tr-TR")
                    : "-"}
                </td>
                <td>
                  <ActionButton variant="info" onClick={() => handleViewClick(quote.id)}>
                    Görüntüle
                  </ActionButton>
                  {" "}
                  <ActionButton variant="success" onClick={() => handleEditClick(quote.id)}>
                    Düzenle
                  </ActionButton>
                  {" "}
                  <ActionButton variant="info" onClick={() => openSendModal(quote)}>
                    Gönder
                  </ActionButton>
                  {" "}
                  <DangerButton onClick={() => handleDeleteClick(quote.id)}>
                    Sil
                  </DangerButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
