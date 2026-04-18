// FILE: web\src\pages\DashboardPage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../components/PageLoader";
import QuoteList from "../components/QuoteList";
import { useEffect, useState } from "react";
import { getFinanceMismatches } from "../services/admin.service";
import { canAccessAdminSurface, getRoleIcon, getUserDisplayRoleLabel, getWorkspaceLabelFallback, normalizedBusinessRole } from "../auth/permissions";

interface MismatchItem {
  supplier_id: number;
  supplier_name: string;
  alerts: string[];
  totals: {
    contract_total: number;
    invoice_total: number;
    payment_total: number;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [mismatches, setMismatches] = useState<MismatchItem[]>([]);
  const workspaceName = user?.organization_name || user?.platform_name || "Buyera Asistans";
  const workspaceLabel = user?.workspace_label || getWorkspaceLabelFallback(user);

  useEffect(() => {
    if (canAccessAdminSurface(user)) {
      getFinanceMismatches(5)
        .then((data) => setMismatches(data.items as MismatchItem[]))
        .catch(() => {/* sessiz hata */});
    }
  }, [user]);

  if (!user) return <PageLoader text="Kullanıcı bilgileri yükleniyor..." />;
  const normalizedRole = normalizedBusinessRole(user);
  const roleIcon = getRoleIcon(normalizedRole);
  const roleLabel = getUserDisplayRoleLabel(user);

  return (
    <div style={{ fontFamily: "Arial" }}>
      <div style={{ maxWidth: 760, margin: "32px auto", padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
            borderRadius: 28,
            padding: 24,
            color: "white",
            background: "linear-gradient(135deg, #16302b 0%, #294d45 52%, #e5c383 100%)",
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#fef3c7" }}>
              {user.platform_name || "Buyera Asistans"}
            </div>
            <h2 style={{ margin: "10px 0 8px 0", fontSize: 34, lineHeight: 1.08 }}>{workspaceName}</h2>
            <p style={{ margin: "4px 0", color: "#e2e8f0", fontSize: "14px", lineHeight: 1.7 }}>
              {workspaceLabel}. Hoşgeldin, {roleIcon} {user.email} ({roleLabel})
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Çıkış Yap
          </button>
        </div>

        {canAccessAdminSurface(user) && (
          <div style={{ background: "#f0f4ff", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
            <Link to="/admin/quotes" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "bold" }}>
              → Tüm Teklifleri Yönet (Admin)
            </Link>
          </div>
        )}

        {mismatches.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: 15, color: "#991b1b" }}>⚠️ Finans Uyarıları</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {mismatches.map((m) => (
                <div
                  key={m.supplier_id}
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fca5a5",
                    borderRadius: 8,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#991b1b" }}>
                      <Link to={`/admin/suppliers/${m.supplier_id}`} style={{ color: "#991b1b", textDecoration: "underline" }}>
                        {m.supplier_name}
                      </Link>
                    </div>
                    <div style={{ fontSize: 12, color: "#7f1d1d", marginTop: 2 }}>
                      {m.alerts.join(" • ")}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#b91c1c", textAlign: "right", flexShrink: 0 }}>
                    <div>Sözleşme: {m.totals.contract_total.toLocaleString("tr-TR")}</div>
                    <div>Fatura: {m.totals.invoice_total.toLocaleString("tr-TR")}</div>
                    <div>Ödeme: {m.totals.payment_total.toLocaleString("tr-TR")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <QuoteList />
    </div>
  );
}
