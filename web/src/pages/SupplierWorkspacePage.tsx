import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSupplierAccessToken } from "../lib/session";
import {
  getSupplierProfile,
  listSupplierContracts,
  listSupplierDocuments,
  listSupplierGuarantees,
  uploadSupplierDocument,
  type SupplierContractItem,
  type SupplierDocCategory,
  type SupplierDocumentItem,
  type SupplierGuaranteeItem,
  type SupplierProfileResponse,
} from "../services/supplier-profile.service";
import { SupplierResponsePortal } from "../components/SupplierResponsePortal";

type WorkspaceTab = "profile" | "offers" | "contracts" | "guarantees" | SupplierDocCategory;

const DOC_TABS: SupplierDocCategory[] = ["certificates", "company_docs", "personnel_docs", "guarantee_docs"];

const TAB_LABELS: Record<WorkspaceTab, string> = {
  profile: "Profilim",
  offers: "Tekliflerim",
  contracts: "Sözleşmelerim",
  guarantees: "Teminatlarım",
  certificates: "Sertifikalar",
  company_docs: "Şirket Evrakları",
  personnel_docs: "Personel Evrakları",
  guarantee_docs: "Alınan Teminatlar",
};

const PageWrap = styled.div`
  min-height: 100vh;
  background: #f0f4f8;
`;

const TopBar = styled.div`
  background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%);
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 20px;
`;

const BackBtn = styled.button`
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const Body = styled.div`
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px 50px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
`;

const TabRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const TabBtn = styled.button<{ $active: boolean }>`
  border: 1px solid ${(p) => (p.$active ? "#0f766e" : "#cbd5e1")};
  background: ${(p) => (p.$active ? "#ccfbf1" : "#fff")};
  color: ${(p) => (p.$active ? "#134e4a" : "#334155")};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const UploadBtn = styled.button`
  border: none;
  background: #2d6a9f;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
`;

const Select = styled.select`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
`;

const List = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  margin-top: 12px;
`;

const Row = styled.div`
  border-bottom: 1px dashed #dbe3ee;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  &:last-child { border-bottom: none; }
  a {
    color: #0f766e;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
  }
`;

const Toast = styled.div<{ $type: "success" | "error" }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${(p) => (p.$type === "success" ? "#065f46" : "#991b1b")};
  color: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
`;

function isDocTab(tab: WorkspaceTab): tab is SupplierDocCategory {
  return DOC_TABS.includes(tab as SupplierDocCategory);
}

function getInitialTab(search: string): WorkspaceTab {
  const value = new URLSearchParams(search).get("tab");
  const validTabs: WorkspaceTab[] = ["profile", "offers", "contracts", "guarantees", ...DOC_TABS];
  if (value && validTabs.includes(value as WorkspaceTab)) {
    return value as WorkspaceTab;
  }
  return "profile";
}

export default function SupplierWorkspacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<WorkspaceTab>(() => getInitialTab(location.search));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [profile, setProfile] = useState<SupplierProfileResponse | null>(null);
  const [documents, setDocuments] = useState<SupplierDocumentItem[]>([]);
  const [contracts, setContracts] = useState<SupplierContractItem[]>([]);
  const [guarantees, setGuarantees] = useState<SupplierGuaranteeItem[]>([]);

  const [fileNameFilter, setFileNameFilter] = useState("");
  const [docFromDate, setDocFromDate] = useState("");
  const [docToDate, setDocToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const flash = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!getSupplierAccessToken()) {
      navigate("/supplier/login", { replace: true });
      return;
    }
    setTab(getInitialTab(location.search));
  }, [location.search, navigate]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (tab === "profile") {
          setProfile(await getSupplierProfile());
        } else if (isDocTab(tab)) {
          setDocuments(await listSupplierDocuments(tab));
        } else if (tab === "contracts") {
          setContracts(await listSupplierContracts());
        } else if (tab === "guarantees") {
          setGuarantees(await listSupplierGuarantees());
        }
      } catch {
        flash("Veriler yüklenemedi", "error");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [tab]);

  const changeTab = (next: WorkspaceTab) => {
    navigate(`/supplier/workspace?tab=${next}`);
  };

  const inDateRange = (value: string | undefined, fromDate: string, toDate: string) => {
    if (!fromDate && !toDate) return true;
    if (!value) return false;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return false;
    if (fromDate && d < new Date(`${fromDate}T00:00:00`)) return false;
    if (toDate && d > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  };

  const filteredDocuments = useMemo(
    () => documents.filter((d) => {
      const nameOk = !fileNameFilter.trim() || d.original_filename.toLowerCase().includes(fileNameFilter.trim().toLowerCase());
      const dateOk = inDateRange(d.created_at, docFromDate, docToDate);
      return nameOk && dateOk;
    }),
    [documents, fileNameFilter, docFromDate, docToDate]
  );

  const filteredContracts = useMemo(
    () => contracts.filter((c) => statusFilter === "all" || c.status === statusFilter),
    [contracts, statusFilter]
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isDocTab(tab)) return;
    try {
      setUploading(true);
      await uploadSupplierDocument(tab, file);
      setDocuments(await listSupplierDocuments(tab));
      flash("Evrak yüklendi", "success");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Evrak yüklenemedi";
      flash(msg, "error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const openDocument = async (doc: SupplierDocumentItem) => {
    const token = getSupplierAccessToken();
    if (!token) {
      flash("Oturum bulunamadı", "error");
      return;
    }
    const apiBase = (import.meta.env.VITE_API_URL as string | undefined) || "http://127.0.0.1:8000";
    try {
      const response = await fetch(`${apiBase}${doc.file_url}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch {
      flash("Doküman açılamadı", "error");
    }
  };

  return (
    <PageWrap>
      <TopBar>
        <Title>Tedarikçi Workspace</Title>
        <BackBtn onClick={() => navigate("/supplier/dashboard")}>← Panele Dön</BackBtn>
      </TopBar>

      <Body>
        <Card>
          <TabRow>
            <TabBtn $active={tab === "profile"} onClick={() => changeTab("profile")}>{TAB_LABELS.profile}</TabBtn>
            <TabBtn $active={tab === "offers"} onClick={() => changeTab("offers")}>{TAB_LABELS.offers}</TabBtn>
            <TabBtn $active={tab === "contracts"} onClick={() => changeTab("contracts")}>{TAB_LABELS.contracts}</TabBtn>
            <TabBtn $active={tab === "guarantees"} onClick={() => changeTab("guarantees")}>{TAB_LABELS.guarantees}</TabBtn>
            {DOC_TABS.map((docTab) => (
              <TabBtn key={docTab} $active={tab === docTab} onClick={() => changeTab(docTab)}>{TAB_LABELS[docTab]}</TabBtn>
            ))}
          </TabRow>

          {loading && <div style={{ color: "#64748b", fontSize: 14 }}>Yükleniyor...</div>}

          {!loading && tab === "profile" && (
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, background: "#f8fafc", padding: 14 }}>
              {profile ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><div style={{ fontSize: 12, color: "#64748b" }}>Firma</div><div style={{ fontWeight: 700 }}>{profile.supplier.company_name || "-"}</div></div>
                    <div><div style={{ fontSize: 12, color: "#64748b" }}>Kategori</div><div style={{ fontWeight: 700 }}>{profile.supplier.category || "-"}</div></div>
                    <div><div style={{ fontSize: 12, color: "#64748b" }}>Email</div><div style={{ fontWeight: 700 }}>{profile.supplier.email || "-"}</div></div>
                    <div><div style={{ fontSize: 12, color: "#64748b" }}>Telefon</div><div style={{ fontWeight: 700 }}>{profile.supplier.phone || "-"}</div></div>
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <UploadBtn onClick={() => navigate("/supplier/profile")}>Profili Düzenle</UploadBtn>
                    <UploadBtn style={{ background: "#334155" }} onClick={() => navigate("/supplier/finance")}>Finans Modülü</UploadBtn>
                  </div>
                </>
              ) : (
                <div style={{ color: "#64748b", fontSize: 13 }}>Profil bilgileri bulunamadı.</div>
              )}
            </div>
          )}

          {!loading && tab === "offers" && (
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff", padding: 8 }}>
              <SupplierResponsePortal
                apiUrl={(import.meta.env.VITE_API_URL as string | undefined) || ""}
                authToken={getSupplierAccessToken() || ""}
              />
            </div>
          )}

          {!loading && tab === "contracts" && (
            <>
              <FilterRow>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tüm Durumlar</option>
                  <option value="draft">Taslak</option>
                  <option value="generated">Oluşturuldu</option>
                  <option value="sent">Gönderildi</option>
                  <option value="signed">İmzalı</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal</option>
                </Select>
              </FilterRow>
              <List>
                {filteredContracts.length === 0 && <div style={{ padding: 12, fontSize: 13, color: "#64748b" }}>Sözleşme bulunmuyor.</div>}
                {filteredContracts.map((c) => (
                  <div key={c.id} style={{ borderBottom: "1px dashed #dbe3ee", padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <strong style={{ fontSize: 13 }}>{c.contract_number}</strong>
                      <span style={{ fontSize: 12, color: "#0f766e", fontWeight: 700 }}>{c.status}</span>
                    </div>
                    <div style={{ marginTop: 4, fontSize: 12, color: "#475569", display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span>Teklif: {c.quote_id}</span>
                      <span>{c.final_amount ? `${c.final_amount.toLocaleString("tr-TR")} TL` : "-"}</span>
                    </div>
                  </div>
                ))}
              </List>
            </>
          )}

          {!loading && tab === "guarantees" && (
            <List>
              {guarantees.length === 0 && <div style={{ padding: 12, fontSize: 13, color: "#64748b" }}>Teminat kaydı bulunmuyor.</div>}
              {guarantees.map((g) => (
                <div key={g.id} style={{ borderBottom: "1px dashed #dbe3ee", padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <strong style={{ fontSize: 13 }}>{g.title}</strong>
                    <span style={{ fontSize: 12, color: "#0f766e", fontWeight: 700 }}>{g.status}</span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
                    {g.amount ? `${g.amount.toLocaleString("tr-TR")} ${g.currency}` : "Tutar yok"}
                  </div>
                </div>
              ))}
            </List>
          )}

          {!loading && isDocTab(tab) && (
            <>
              <FilterRow>
                <Input value={fileNameFilter} onChange={(e) => setFileNameFilter(e.target.value)} placeholder="Dosya adına göre filtrele" />
                <Input type="date" value={docFromDate} onChange={(e) => setDocFromDate(e.target.value)} />
                <Input type="date" value={docToDate} onChange={(e) => setDocToDate(e.target.value)} />
                <UploadBtn onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "⏳ Yükleniyor..." : "+ Evrak Yükle"}</UploadBtn>
              </FilterRow>
              <input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleUpload} />
              <List>
                {filteredDocuments.length === 0 && <div style={{ padding: 12, fontSize: 13, color: "#64748b" }}>Filtreye uygun evrak yok.</div>}
                {filteredDocuments.map((d) => (
                  <Row key={d.id}>
                    <div>
                      <div style={{ fontSize: 13, color: "#334155" }}>{d.original_filename}</div>
                      <div style={{ marginTop: 2, fontSize: 11, color: "#64748b" }}>{d.created_at ? new Date(d.created_at).toLocaleString("tr-TR") : "Tarih bilgisi yok"}</div>
                    </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); void openDocument(d); }}>Aç</a>
                  </Row>
                ))}
              </List>
            </>
          )}
        </Card>
      </Body>

      {toast && <Toast $type={toast.type}>{toast.msg}</Toast>}
    </PageWrap>
  );
}
