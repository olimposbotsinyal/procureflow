// FILE: web\src\components\AppLayout.tsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { notify } from "../lib/notify";
import { getVisibleNavItems } from "../config/navigation";
import { getRoleIcon, getUserDisplayRoleLabel, getWorkspaceLabelFallback, hasPermissionForUser, normalizedBusinessRole } from "../auth/permissions";
import { useState } from "react";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const workspaceName = user?.organization_name || user?.platform_name || "Buyera Asistans";
  const workspaceLabel = user?.workspace_label || getWorkspaceLabelFallback(user);
  const logoUrl = user?.organization_logo_url;

  function handleLogout() {
    logout();
    notify.info("Çıkış yapıldı.");
    navigate("/login", { replace: true });
    setMenuOpen(false);
  }

  function handleProfileClick() {
    navigate("/profile");
    setMenuOpen(false);
  }

  const visibleItems = user
    ? getVisibleNavItems(user).filter((item) => hasPermissionForUser(user, item.permission))
    : [];
  const normalizedRole = normalizedBusinessRole(user);
  const roleIcon = getRoleIcon(normalizedRole);
  const roleLabel = getUserDisplayRoleLabel(user);

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f4f5f2" }}>
      <header
        style={{
          minHeight: 76,
          background: "linear-gradient(135deg, #112a25 0%, #173630 52%, #20463e 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 22px",
          position: "relative",
          boxShadow: "0 14px 30px rgba(15, 23, 42, 0.12)",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginRight: 8 }}>
            {logoUrl ? (
              <img src={logoUrl} alt={workspaceName} style={{ width: 44, height: 44, borderRadius: 16, objectFit: "cover", border: "1px solid rgba(255,255,255,0.18)" }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 16, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.14)", fontWeight: 800 }}>
                {workspaceName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{workspaceName}</div>
              <div style={{ fontSize: 11, color: "#d6e1db", letterSpacing: 0.4 }}>{workspaceLabel} • {user?.platform_domain || "buyerasistans.com.tr"}</div>
            </div>
          </div>
          {visibleItems.map((item) => (
            <Link key={item.to} to={item.to} style={{ color: "#d1d5db", textDecoration: "none", fontSize: 14 }}>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#d1d5db",
              padding: "10px 14px",
              borderRadius: 14,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {roleIcon} {user?.full_name || user?.email}
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: 64,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                zIndex: 10,
                minWidth: 200,
              }}
            >
              <div style={{ padding: 8 }}>
                <div style={{ padding: "8px 16px", fontSize: 12, color: "#6b7280", borderBottom: "1px solid #e5e7eb", marginBottom: 4 }}>
                  {roleIcon} {roleLabel} • {user?.platform_name || "Buyera Asistans"}
                </div>
                <button
                  onClick={handleProfileClick}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#1f2937",
                    borderRadius: 4,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  👤 Profilim
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#ef4444",
                    borderRadius: 4,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  🚪 Çıkış Yap
                </button>
              </div>
            </div>
          )}

          {/* Close menu on outside click */}
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 5,
              }}
            />
          )}
        </div>
      </header>

      <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
