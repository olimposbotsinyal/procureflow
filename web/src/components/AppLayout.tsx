// FILE: web\src\components\AppLayout.tsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { notify } from "../lib/notify";
import { NAV_ITEMS } from "../config/navigation";
import { hasPermission } from "../auth/permissions";
import { useState } from "react";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    ? NAV_ITEMS.filter((item) => hasPermission(user.role, item.permission))
    : [];

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f7f7f8" }}>
      <header
        style={{
          height: 64,
          background: "#111827",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <strong>ProcureFlow</strong>
          {visibleItems.map((item) => (
            <Link key={item.to} to={item.to} style={{ color: "#d1d5db", textDecoration: "none" }}>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "#1f2937",
              border: "1px solid #374151",
              color: "#d1d5db",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            👤 {user?.email}
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
