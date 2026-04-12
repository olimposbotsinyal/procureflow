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

  button {
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

  const handleViewProject = (projectId: number) => {
    alert(`⏰ Proje #${projectId} detayları çok yakında kullanılabilir olacak!`);
    // navigate(`/supplier/project/${projectId}`);
  };

  const handleSubmitQuote = (projectId: number) => {
    alert(`⏰ Proje #${projectId} için teklif gönderme fonksiyonu çok yakında kullanılabilir olacak!`);
    // navigate(`/supplier/project/${projectId}/quote`);
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
                  <h3>{project.name}</h3>

                  <div className="status-badge pending">
                    {project.quote_submitted
                      ? "📬 Teklif Gönderildi"
                      : "📝 Teklif Bekleniyor"}
                  </div>

                  <div className="project-meta">
                    {project.description && (
                      <span>
                        <strong>📋</strong> {project.description.substring(0, 50)}
                        ...
                      </span>
                    )}
                    {project.budget && (
                      <span>
                        <strong>💰</strong> Bütçe:{" "}
                        {new Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        }).format(project.budget)}
                      </span>
                    )}
                  </div>

                  <div className="actions">
                    <button
                      className="primary"
                      disabled
                      onClick={() => handleSubmitQuote(project.id)}
                      title="Çok yakında kullanılabilir"
                    >
                      {project.quote_submitted ? "📝 Teklifi Düzenle" : "📝 Teklif Gönder"}
                    </button>
                    <button
                      className="secondary"
                      disabled
                      onClick={() => handleViewProject(project.id)}
                      title="Çok yakında kullanılabilir"
                    >
                      👁️ Detaylar
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
