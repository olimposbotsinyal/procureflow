// web/src/pages/SupplierPortalPage.tsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { SupplierResponsePortal } from "../components/SupplierResponsePortal";
import { getSupplierAccessToken } from "../lib/session";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
`;

const Card = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 32px;
  }

  p {
    margin: 10px 0 0 0;
    opacity: 0.9;
    font-size: 16px;
  }
`;

const Content = styled.div`
  padding: 40px;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;

  .number {
    font-size: 32px;
    font-weight: bold;
    color: #667eea;
  }

  .label {
    font-size: 14px;
    color: #6b7280;
    margin-top: 5px;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  div {
    font-size: 48px;
    margin-bottom: 20px;
  }
`;

interface SupplierPortalPageProps {
  apiUrl?: string;
  authToken?: string;
  supplierUserId?: number;
}

export function SupplierPortalPage({
  apiUrl = "",
  authToken = getSupplierAccessToken() || "",
  supplierUserId = 1,
}: SupplierPortalPageProps) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    submitted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);

      // Tedarikçinin kendisine gönderilen teklifleri al
      const response = await fetch(`${apiUrl}/api/v1/supplier-quotes/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("İstatistikler yüklenemedi");
      }

      const quotes = await response.json();

      const pending = (quotes as Array<{status: string}>).filter((q) => q.status !== "yanıtlandı").length;
      const submitted = (quotes as Array<{status: string}>).filter((q) => q.status === "yanıtlandı").length;

      setStats({
        total: quotes.length,
        pending,
        submitted,
      });
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Card>
        <Header>
          <h1>📬 Tedarikçi Portal</h1>
          <p>Gönderilen tekliflere yanıt verin ve fiyat teklifi sunun</p>
        </Header>

        <Content>
          {error && <ErrorMessage>❌ {error}</ErrorMessage>}

          {loading ? (
            <LoadingState>
              <div>⏳</div>
              <div>Veriler yükleniyor...</div>
            </LoadingState>
          ) : (
            <>
              <Stats>
                <StatCard>
                  <div className="number">{stats.total}</div>
                  <div className="label">Toplam Teklif</div>
                </StatCard>
                <StatCard>
                  <div className="number">{stats.pending}</div>
                  <div className="label">Yanıt Bekleyen</div>
                </StatCard>
                <StatCard>
                  <div className="number">{stats.submitted}</div>
                  <div className="label">Yanıt Verilen</div>
                </StatCard>
              </Stats>

              <SupplierResponsePortal
                apiUrl={apiUrl}
                authToken={authToken}
                supplierUserId={supplierUserId}
              />
            </>
          )}
        </Content>
      </Card>
    </Container>
  );
}
