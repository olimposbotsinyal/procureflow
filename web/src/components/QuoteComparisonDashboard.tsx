// web/src/components/QuoteComparisonDashboard.tsx
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ContractPortal } from "./ContractPortal";

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

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: ${p => p.$active ? '#1f2937' : '#6b7280'};
  border-bottom: 3px solid ${p => p.$active ? '#3b82f6' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    color: #1f2937;
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
    cursor: pointer;

    &:hover {
      background-color: #e5e7eb;
    }
  }

  tr:hover {
    background-color: #f9fafb;
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
      case "yanıtlandı":
        return "#d1fae5";
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
      case "yanıtlandı":
        return "#065f46";
      default:
        return "#374151";
    }
  }};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? "#3b82f6" : "white"};
  color: ${(props) => (props.active ? "white" : "#374151")};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    border-color: #3b82f6;
  }
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  gap: 8px;
  margin: 15px 0;
`;

const Bar = styled.div<{ height: number; color?: string }>`
  flex: 1;
  background-color: ${(props) => props.color || "#3b82f6"};
  border-radius: 4px 4px 0 0;
  height: ${(props) => props.height}%;
  min-height: 5px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
`;

interface SupplierResponse {
  supplier_id: number;
  supplier_name: string;
  supplier_contact?: string;
  status: string;
  total_amount: number;
  discount_percent: number;
  discount_amount: number;
  final_amount: number;
  payment_terms?: string;
  delivery_time?: number;
  warranty?: string;
  submitted_at?: string;
}

interface QuoteComparisonDashboardProps {
  quoteId: number;
  apiUrl: string;
  authToken: string;
  supplierId?: number;
  supplierName?: string;
}

export function QuoteComparisonDashboard({
  quoteId,
  apiUrl,
  authToken,
  supplierId,
  supplierName = "Tedarikçi",
}: QuoteComparisonDashboardProps) {
  const [responses, setResponses] = useState<SupplierResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "delivery" | "name">(
    "price"
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "yanıtlandı" | "tasarı">(
    "yanıtlandı"
  );
  const [activeTab, setActiveTab] = useState<"comparison" | "contract">("comparison");

  const loadResponses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiUrl}/api/v1/supplier-quotes/quote/${quoteId}/responses`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Tedarikçi yanıtları yüklenemedi");
      }

      const data = await response.json();
      setResponses(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [quoteId, apiUrl, authToken]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  function sortResponses() {
    const filtered = responses.filter(
      (r) => filterStatus === "all" || r.status === filterStatus
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "price") {
        return a.final_amount - b.final_amount;
      } else if (sortBy === "delivery") {
        return (a.delivery_time || 999) - (b.delivery_time || 999);
      } else {
        return a.supplier_name.localeCompare(b.supplier_name);
      }
    });
  }

  const sortedResponses = sortResponses();
  const minPrice = Math.min(
    ...sortedResponses.map((r) => r.final_amount),
    Infinity
  );
  const maxPrice = Math.max(
    ...sortedResponses.map((r) => r.final_amount),
    0
  );

  if (loading) {
    return <Container>Yükleniyor...</Container>;
  }

  return (
    <Container>
      <Header>
        <h2>📊 Teklif Yönetimi</h2>
        <p>Tedarikçilerin verdikleri fiyatları karşılaştırın ve sözleşme oluşturun</p>
      </Header>

      <TabsContainer>
        <Tab $active={activeTab === "comparison"} onClick={() => setActiveTab("comparison")}>
          📊 Karşılaştırma
        </Tab>
        <Tab $active={activeTab === "contract"} onClick={() => setActiveTab("contract")}>
          📄 Sözleşmeler
        </Tab>
      </TabsContainer>

      {activeTab === "comparison" ? (
        <>
          {error && <ErrorMessage>❌ {error}</ErrorMessage>}

          {responses.length === 0 ? (
            <EmptyState>
              <p>Henüz tedarikçi yanıtı alınmamış</p>
            </EmptyState>
          ) : (
            <>
              <FilterContainer>
            <FilterButton
              active={filterStatus === "all"}
              onClick={() => setFilterStatus("all")}
            >
              Tümü ({responses.length})
            </FilterButton>
            <FilterButton
              active={filterStatus === "yanıtlandı"}
              onClick={() => setFilterStatus("yanıtlandı")}
            >
              Yanıtlandı (
              {responses.filter((r) => r.status === "yanıtlandı").length})
            </FilterButton>
            <FilterButton
              active={filterStatus === "tasarı"}
              onClick={() => setFilterStatus("tasarı")}
            >
              Tasarı (
              {responses.filter((r) => r.status === "tasarı").length})
            </FilterButton>
          </FilterContainer>

          <Card>
            <div style={{ marginBottom: "15px" }}>
              <strong>Sıralama:</strong>
              <FilterContainer style={{ marginBottom: 0, marginTop: "8px" }}>
                <FilterButton
                  active={sortBy === "price"}
                  onClick={() => setSortBy("price")}
                >
                  💰 Fiyata Göre
                </FilterButton>
                <FilterButton
                  active={sortBy === "delivery"}
                  onClick={() => setSortBy("delivery")}
                >
                  📦 Teslimat Süresine Göre
                </FilterButton>
                <FilterButton
                  active={sortBy === "name"}
                  onClick={() => setSortBy("name")}
                >
                  🏢 Tedarikçiye Göre
                </FilterButton>
              </FilterContainer>
            </div>
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Fiyat Karşılaştırması</h3>
            <BarChart>
              {sortedResponses.map((response, idx) => {
                const barHeight =
                  ((response.final_amount - minPrice) /
                    (maxPrice - minPrice || 1)) *
                    100 +
                  (maxPrice - minPrice === 0 ? 50 : 0);
                const color =
                  response.final_amount === minPrice
                    ? "#10b981" // Yeşil - En düşük fiyat
                    : idx < 2
                      ? "#3b82f6" // Mavi - İkinci tercih
                      : "#f3f4f6"; // Açık gri - Diğerleri

                return (
                  <div
                    key={response.supplier_id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Bar height={barHeight} color={color}></Bar>
                    <div
                      style={{
                        fontSize: "11px",
                        marginTop: "8px",
                        textAlign: "center",
                        wordBreak: "break-word",
                      }}
                    >
                      {response.supplier_name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginTop: "4px",
                        color:
                          response.final_amount === minPrice
                            ? "#10b981"
                            : "#374151",
                      }}
                    >
                      ₺{response.final_amount.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                );
              })}
            </BarChart>
            <Legend>
              <LegendItem>
                <div className="dot" style={{ backgroundColor: "#10b981" }}></div>
                <span>En Düşük Fiyat</span>
              </LegendItem>
              <LegendItem>
                <div className="dot" style={{ backgroundColor: "#3b82f6" }}></div>
                <span>Competitive</span>
              </LegendItem>
              <LegendItem>
                <div className="dot" style={{ backgroundColor: "#f3f4f6" }}></div>
                <span>Diğer</span>
              </LegendItem>
            </Legend>
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Detaylı Karşılaştırma</h3>
            <Table>
              <thead>
                <tr>
                  <th>🏢 Tedarikçi</th>
                  <th>
                    {sortBy === "price" ? "💰" : ""} Toplam Fiyat
                  </th>
                  <th>% İndirim</th>
                  <th>
                    {sortBy === "price" ? "⭐" : ""} Final Fiyat
                  </th>
                  <th>
                    {sortBy === "delivery" ? "⭐" : ""} Teslimat (Gün)
                  </th>
                  <th>💳 Ödeme</th>
                  <th>Garanti</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {sortedResponses.map((response) => (
                  <tr key={response.supplier_id}>
                    <td>
                      <strong>{response.supplier_name}</strong>
                      {response.supplier_contact && (
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          {response.supplier_contact}
                        </div>
                      )}
                    </td>
                    <td>
                      ₺
                      {response.total_amount.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      {response.discount_percent > 0 && (
                        <>
                          {response.discount_percent.toFixed(2)}%{" "}
                          <span style={{ fontSize: "11px", color: "#6b7280" }}>
                            (-₺
                            {response.discount_amount.toLocaleString("tr-TR", {
                              minimumFractionDigits: 2,
                            })}
                            )
                          </span>
                        </>
                      )}
                    </td>
                    <td>
                      <strong
                        style={{
                          color:
                            response.final_amount === minPrice
                              ? "#10b981"
                              : "#374151",
                          fontSize: "16px",
                        }}
                      >
                        ₺
                        {response.final_amount.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}
                      </strong>
                    </td>
                    <td>
                      {response.delivery_time ? (
                        `${response.delivery_time} gün`
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td>
                      {response.payment_terms ? (
                        <span style={{ fontSize: "12px" }}>
                          {response.payment_terms}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td>
                      {response.warranty ? (
                        <span style={{ fontSize: "12px" }}>
                          {response.warranty}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={response.status}>
                        {response.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          <Card style={{ backgroundColor: "#f0fdf4", borderColor: "#86efac" }}>
            <h3 style={{ marginTop: 0, color: "#15803d" }}>✅ Öneriler</h3>
            <ul style={{ margin: "0", paddingLeft: "20px", color: "#15803d" }}>
              <li>
                En düşük fiyat: <strong>{sortedResponses[0]?.supplier_name}</strong> (
                ₺{sortedResponses[0]?.final_amount.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}
                )
              </li>
              {sortedResponses[0]?.delivery_time && (
                <li>
                  En hızlı teslimat: <strong>{sortedResponses[0]?.supplier_name}</strong> ({sortedResponses[0]?.delivery_time} gün)
                </li>
              )}
              <li>
                Toplam {sortedResponses.length} tedarikçiden yanıt alındı
              </li>
            </ul>
          </Card>
            </>
          )}
        </>
      ) : (
        supplierId ? (
          <ContractPortal 
            quoteId={quoteId}
            supplierId={supplierId}
            supplierName={supplierName}
          />
        ) : (
          <Card>
            <p style={{ color: '#9ca3af', textAlign: 'center' }}>
              Sözleşme oluşturmak için bir tedarikçi seçiniz
            </p>
          </Card>
        )
      )}
    </Container>
  );
}
