import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { http } from "../lib/http";
import { clearToken, getSupplierAccessToken } from "../lib/session";
import { getSupplierProfile } from "../services/supplier-profile.service";

const Container = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 40px 20px;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 32px;
    color: #1f2937;
    margin: 0;
    font-weight: 700;
  }

  p {
    color: #6b7280;
    font-size: 16px;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;

    &.profile {
      background-color: #667eea;
      color: white;

      &:hover {
        background-color: #5568d3;
      }
    }

    &.logout {
      background-color: #ef4444;
      color: white;

      &:hover {
        background-color: #dc2626;
      }
    }
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 40px;

  h2 {
    font-size: 20px;
    color: #1f2937;
    margin: 0 0 20px 0;
    font-weight: 600;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow: hidden;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }

  h3 {
    font-size: 18px;
    color: #1f2937;
    margin: 0 0 12px 0;
    font-weight: 600;
  }

  .project-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #6b7280;

    span {
      display: flex;
      align-items: center;
      gap: 8px;

      strong {
        color: #1f2937;
      }
    }
  }

  .status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
    background-color: #dbeafe;
    color: #0c4a6e;

    &.pending {
      background-color: #fef3c7;
      color: #78350f;
    }

    &.submitted {
      background-color: #d1fae5;
      color: #065f46;
    }
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .actions > button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;

    &.primary {
      background-color: #667eea;
      color: white;

      &:hover {
        background-color: #5568d3;
      }
    }

    &.secondary {
      background-color: #e5e7eb;
      color: #374151;

      &:hover {
        background-color: #d1d5db;
      }
    }
  }
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  color: #6b7280;

  .icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 18px;
    color: #1f2937;
    margin: 0 0 10px 0;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 16px;
  color: #6b7280;
`;

export interface Project {
  id: number;
  name: string;
  description?: string;
  budget?: number;
  status?: string;
}

export interface AssignedProject extends Project {
  supplier_status?: string;
  quote_submitted?: boolean;
  company?: {
    id?: number | null;
    name?: string;
    logo_url?: string | null;
  };
  quote?: {
    id?: number | null;
    title?: string;
    description?: string | null;
    status?: string | null;
  };
  supplier_quote?: {
    id?: number | null;
    status?: string | null;
    submitted?: boolean;
  };
  project_files?: Array<{
    id: number;
    name: string;
    size: number;
    file_type?: string;
  }>;
}

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<AssignedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState<string>("-");
  const [supplierUserText, setSupplierUserText] = useState<string>("-");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all projects assigned to this supplier
      const response = await http.get("/suppliers/dashboard/projects");
      setProjects(response.data || []);
    } catch (err: unknown) {
      console.error("Error loading projects:", err);
      let message = "Projeler yüklenirken hata oluştu";
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response;
        if (response?.data?.detail) {
          message = response.data.detail;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSupplierIdentity = useCallback(async () => {
    try {
      const profile = await getSupplierProfile();
      setSupplierName(profile.supplier.company_name || "Firma");
      setSupplierUserText(`${profile.user.name} (${profile.user.email})`);
      if (profile.supplier.logo_url) {
        const base = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";
        setLogoUrl(profile.supplier.logo_url.startsWith("http") ? profile.supplier.logo_url : base + profile.supplier.logo_url);
      }
    } catch {
      setSupplierName("Firma");
      setSupplierUserText("Tedarikci kullanicisi");
    }
  }, []);

  useEffect(() => {
    // Eğer supplier token yoksa login'e yönlendir
    const supplierToken = getSupplierAccessToken();

    if (!supplierToken) {
      window.location.href = "/supplier/login";
      return;
    }

    void loadProjects();
    void loadSupplierIdentity();
  }, [loadProjects, loadSupplierIdentity]);

  const resolveLogo = (logo?: string | null) => {
    if (!logo) return null;
    if (logo.startsWith("http")) return logo;
    const base = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || window.location.origin;
    return `${base}${logo}`;
  };

  const openFile = async (fileId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const token = getSupplierAccessToken();
    if (!token) return;

    try {
      const base = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || window.location.origin;
      const response = await fetch(`${base}/api/v1/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as { detail?: string })?.detail || "Dosya açılamadı");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Dosya açılamadı";
      alert(msg);
    }
  };

  const downloadFile = async (fileId: number, fileName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const token = getSupplierAccessToken();
    if (!token) return;

    try {
      const base = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || window.location.origin;
      const response = await fetch(`${base}/api/v1/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as { detail?: string })?.detail || "Dosya indirilemedi");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Dosya indirilemedi";
      alert(msg);
    }
  };

  const handleRespondQuote = (project: AssignedProject) => {
    if (!project.supplier_quote?.id) {
      alert("Bu proje için henüz oluşturulmuş bir teklif kaydı bulunmuyor.");
      return;
    }
    navigate(`/supplier/workspace?tab=offers&supplierQuoteId=${project.supplier_quote.id}`);
  };

  const handleDeclineQuote = async (project: AssignedProject) => {
    if (!project.supplier_quote?.id) {
      alert("Bu proje için reddedilecek teklif kaydı bulunmuyor.");
      return;
    }
    const reason = window.prompt("Cevaplamayı reddetme nedenini yazın (opsiyonel):", "");
    if (reason === null) return;

    try {
      await http.post(`/supplier-quotes/${project.supplier_quote.id}/decline${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`);
      await loadProjects();
      alert("Teklif cevaplama reddi kaydedildi.");
    } catch (err: unknown) {
      const detail =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      alert(detail || "Reddetme işlemi başarısız.");
    }
  };

  const handleEditProfile = () => {
    navigate("/supplier/profile");
  };

  const handleOpenQuotes = () => {
    navigate("/supplier/workspace?tab=offers");
  };

  const handleLogout = () => {
    console.log("[LOGOUT] Supplier çıkış yapıyor...");
    clearToken();
    sessionStorage.removeItem("pf_user");
    localStorage.removeItem("pf_user");
    navigate("/supplier/login", { replace: true });
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>⏳ Projeler yükleniyor...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Firma logosu"
              style={{ height: 52, maxWidth: 140, objectFit: "contain", borderRadius: 8, background: "#fff", padding: "4px 8px", border: "1px solid #e5e7eb" }}
            />
          )}
          <div>
            <h1>📊 Tedarikçi Paneli</h1>
            <p>{supplierUserText} - {supplierName}</p>
          </div>
        </div>
        <div className="actions">
          <button className="profile" onClick={handleOpenQuotes}>
            📬 Tekliflerim
          </button>
          <button className="profile" onClick={handleEditProfile}>
            👤 Profilim
          </button>
          <button className="logout" onClick={handleLogout}>
            🚪 Çıkış
          </button>
        </div>
      </Header>

      <Content>
        {error && (
          <Section>
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          </Section>
        )}

        <Section>
          <h2>📦 Size Atanan Projeler</h2>

          {projects.length === 0 ? (
            <EmptyState>
              <div className="icon">📭</div>
              <h3>Henüz proje atanmamış</h3>
              <p>Size proje atandığında burada gösterilecektir</p>
            </EmptyState>
          ) : (
            <ProjectsGrid>
              {projects.map((project) => (
                <ProjectCard key={project.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    {resolveLogo(project.company?.logo_url) ? (
                      <img
                        src={resolveLogo(project.company?.logo_url) || ""}
                        alt={`${project.company?.name || "Firma"} logosu`}
                        style={{ width: 42, height: 42, objectFit: "contain", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" }}
                      />
                    ) : (
                      <div style={{ width: 42, height: 42, borderRadius: 8, border: "1px solid #e5e7eb", display: "grid", placeItems: "center", color: "#94a3b8" }}>🏢</div>
                    )}
                    <div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>Firma</div>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{project.company?.name || "Firma bilgisi yok"}</div>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: 8 }}>{project.name}</h3>

                  <div className="status-badge pending" style={{ marginBottom: 10 }}>
                    {project.supplier_quote?.submitted ? "Teklif Gönderildi" : "Teklif Bekleniyor"}
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Teklif Başlığı</div>
                    <div style={{ fontWeight: 700, color: "#1f2937" }}>{project.quote?.title || "Teklif yok"}</div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Teklif Açıklaması</div>
                    <div style={{ color: "#374151", fontSize: 13 }}>{project.quote?.description || "Açıklama girilmemiş"}</div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Bu Projenin Dosyaları</div>
                    {(project.project_files || []).length === 0 ? (
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>Dosya yok</div>
                    ) : (
                      <div style={{ display: "grid", gap: 6 }}>
                        {(project.project_files || []).slice(0, 4).map((f) => (
                          <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px" }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 12, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>{(f.size / 1024).toFixed(1)} KB</div>
                            </div>
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                              <button onClick={(e) => { void openFile(f.id, e); }} type="button" style={{ padding: "6px 8px", fontSize: 11, borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", color: "#334155", cursor: "pointer", whiteSpace: "nowrap" }}>Aç</button>
                              <button onClick={(e) => { void downloadFile(f.id, f.name, e); }} type="button" style={{ padding: "6px 8px", fontSize: 11, borderRadius: 6, border: "1px solid #93c5fd", background: "#dbeafe", color: "#1e40af", cursor: "pointer", whiteSpace: "nowrap" }}>İndir</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="actions">
                    <button className="primary" onClick={() => handleRespondQuote(project)}>
                      Teklifi Cevapla
                    </button>
                    <button className="secondary" onClick={() => handleDeclineQuote(project)}>
                      Cevaplamayı Reddet
                    </button>
                  </div>
                </ProjectCard>
              ))}
            </ProjectsGrid>
          )}
        </Section>

        <Section>
          <h2>📞 Destek</h2>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
            <p>
              Sorularınız veya sorunlarınız için lütfen
              <strong> info@olimposyapi.com </strong>
              adresine e-posta gönderin.
            </p>
          </div>
        </Section>
      </Content>
    </Container>
  );
}
