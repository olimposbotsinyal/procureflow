import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  deleteAdminSupplierDocument,
  listAdminSupplierDocuments,
  uploadAdminSupplierDocument,
  type AdminSupplierDocCategory,
  type AdminSupplierDocumentItem,
} from "../services/admin.service";
import { getToken } from "../lib/session";

type WorkspaceTab = AdminSupplierDocCategory;

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

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
`;

const Input = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
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
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  border: 1px solid ${(p) => (p.$danger ? "#fecaca" : "#cbd5e1")};
  background: ${(p) => (p.$danger ? "#fff5f5" : "#fff")};
  color: ${(p) => (p.$danger ? "#b91c1c" : "#334155")};
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
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

function getInitialTab(search: string): WorkspaceTab {
  const tab = new URLSearchParams(search).get("tab") as WorkspaceTab | null;
  if (tab === "certificates" || tab === "company_docs" || tab === "personnel_docs" || tab === "guarantee_docs") {
    return tab;
  }
  return "certificates";
}

export default function AdminSupplierWorkspacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const supplierId = Number(id);
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<WorkspaceTab>(() => getInitialTab(location.search));
  const [documents, setDocuments] = useState<AdminSupplierDocumentItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileNameFilter, setFileNameFilter] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const flash = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setTab(getInitialTab(location.search));
  }, [location.search]);

  useEffect(() => {
    async function loadData() {
      if (!Number.isFinite(supplierId) || supplierId <= 0) return;
      setLoading(true);
      try {
        setDocuments(await listAdminSupplierDocuments(supplierId, tab));
      } catch {
        flash("Veriler yüklenemedi", "error");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [supplierId, tab]);

  const filteredDocuments = useMemo(
    () => documents.filter((d) => !fileNameFilter.trim() || d.original_filename.toLowerCase().includes(fileNameFilter.trim().toLowerCase())),
    [documents, fileNameFilter],
  );

  const changeTab = (next: WorkspaceTab) => {
    navigate(`/admin/suppliers/${supplierId}/workspace?tab=${next}`);
  };

  const openDocument = async (doc: AdminSupplierDocumentItem) => {
    const token = getToken();
    if (!token) {
      flash("Oturum bulunamadı", "error");
      return;
    }
    const apiBase = (import.meta.env.VITE_API_URL as string | undefined) || "http://127.0.0.1:8000";
    const safe = encodeURIComponent(doc.stored_filename || "");
    const url = `${apiBase}/api/v1/suppliers/${supplierId}/documents/file/${safe}?category=${encodeURIComponent(doc.category)}`;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch {
      flash("Doküman açılamadı", "error");
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!window.confirm("Bu dokümanı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteAdminSupplierDocument(supplierId, documentId);
      flash("Doküman silindi", "success");
      setDocuments(await listAdminSupplierDocuments(supplierId, tab));
    } catch {
      flash("Doküman silinemedi", "error");
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      await uploadAdminSupplierDocument(supplierId, tab, file);
      flash("Evrak yüklendi", "success");
      setDocuments(await listAdminSupplierDocuments(supplierId, tab));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Evrak yüklenemedi";
      flash(message, "error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <PageWrap>
      <TopBar>
        <Title>Evrak ve Dokümanlar</Title>
        <BackBtn onClick={() => navigate(`/admin/suppliers/${supplierId}`)}>← Tedarikçi Detayına Dön</BackBtn>
      </TopBar>

      <Body>
        <Card>
          <TabRow>
            <TabBtn $active={tab === "certificates"} onClick={() => changeTab("certificates")}>Sertifikalar</TabBtn>
            <TabBtn $active={tab === "company_docs"} onClick={() => changeTab("company_docs")}>Şirket Evrakları</TabBtn>
            <TabBtn $active={tab === "personnel_docs"} onClick={() => changeTab("personnel_docs")}>Personel Evrakları</TabBtn>
            <TabBtn $active={tab === "guarantee_docs"} onClick={() => changeTab("guarantee_docs")}>Alınan Teminatlar</TabBtn>
          </TabRow>

          {loading && <div style={{ color: "#64748b", fontSize: 14 }}>Yükleniyor...</div>}

          {!loading && (
            <>
              <ActionRow>
                <Input value={fileNameFilter} onChange={(e) => setFileNameFilter(e.target.value)} placeholder="Dosya adına göre filtrele" />
                <UploadBtn onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? "⏳ Yükleniyor..." : "+ Evrak Yükle"}
                </UploadBtn>
              </ActionRow>

              <input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleUpload} />

              <List>
                {filteredDocuments.length === 0 && <Row style={{ color: "#64748b", fontSize: 13 }}>Kayıt bulunamadı</Row>}
                {filteredDocuments.map((doc) => (
                  <Row key={doc.id}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{doc.original_filename}</div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>{doc.created_at ? new Date(doc.created_at).toLocaleString("tr-TR") : ""}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <ActionBtn type="button" onClick={() => openDocument(doc)}>Görüntüle</ActionBtn>
                      <ActionBtn type="button" $danger onClick={() => void handleDelete(doc.id)}>Sil</ActionBtn>
                    </div>
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
