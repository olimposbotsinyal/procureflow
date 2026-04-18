import { useState } from "react";
import { Link } from "react-router-dom";
import { CompanyCreateModal } from "../../components/CompanyCreateModal";
import type { Company } from "../../services/admin.service";

interface CompaniesTabProps {
  companies: Company[];
  loadData: () => Promise<void>;
  handleDeleteCompany: (id: number) => Promise<void>;
  readOnly?: boolean;
}

export function CompaniesTab({ companies, loadData, handleDeleteCompany, readOnly = false }: CompaniesTabProps) {
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);

  return (
    <div>
      {readOnly && (
        <div style={{ marginBottom: 16, padding: 12, borderRadius: 12, background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }}>
          Platform personeli firma portfoyunu inceleyebilir; yeni firma ekleme, duzenleme ve silme aksiyonlari bu yuzeyde salt okunur moda alinmistir.
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowNewCompanyModal(true)}
          disabled={readOnly}
          style={{
            padding: "10px 16px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: readOnly ? "not-allowed" : "pointer",
            fontWeight: "bold",
            opacity: readOnly ? 0.6 : 1,
          }}
        >
          ➕ Yeni Firma
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: 10, textAlign: "left", width: 56 }}>Logo</th>
              <th style={{ padding: 10, textAlign: "left" }}>Firma Adı</th>
              <th style={{ padding: 10, textAlign: "left" }}>Firma Ünvanı</th>
              <th style={{ padding: 10, textAlign: "left" }}>Durum</th>
              <th style={{ padding: "10px 10px", textAlign: "left", width: 290 }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => {
              const rawLogo = company.logo_url;
              const apiBase = (import.meta.env.VITE_API_URL as string | undefined) || "http://127.0.0.1:8000";
              const logoSrc = rawLogo ? (rawLogo.startsWith("http") ? rawLogo : `${apiBase}${rawLogo}`) : null;
              return (
                <tr key={company.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f8fafc", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {logoSrc
                        ? <img src={logoSrc} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }} />
                        : <span style={{ fontSize: 10, color: "#cbd5e1" }}>-</span>}
                    </div>
                  </td>
                  <td style={{ padding: "8px 10px", fontWeight: 500, textAlign: "left" }}>{company.name}</td>
                  <td style={{ padding: "8px 10px", textAlign: "left" }}>{company.trade_name || company.description || "-"}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", background: company.is_active ? "#d1fae5" : "#fee2e2", color: company.is_active ? "#065f46" : "#991b1b", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                      {company.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td style={{ padding: "8px 10px", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Link to={`/admin/companies/${company.id}`} style={{ padding: "4px 12px", background: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: 12, textDecoration: "none", display: "inline-block" }}>🔍 Detay</Link>
                      {!readOnly && <Link to={`/admin/companies/${company.id}?edit=true`} style={{ padding: "4px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: 12, textDecoration: "none", display: "inline-block" }}>✏️ Düzenle</Link>}
                      {!readOnly && <button onClick={() => handleDeleteCompany(company.id)} style={{ padding: "4px 8px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: 12 }}>Sil</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CompanyCreateModal
        isOpen={showNewCompanyModal}
        onClose={() => setShowNewCompanyModal(false)}
        onSuccess={() => {
          loadData();
          setShowNewCompanyModal(false);
        }}
      />
    </div>
  );
}
