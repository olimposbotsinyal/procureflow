// FILE: web\src\components\AppLayout.tsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { notify } from "../lib/notify";
import { NAV_ITEMS } from "../config/navigation";
import { hasPermission } from "../auth/permissions";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    notify.info("Çıkış yapıldı.");
    navigate("/login", { replace: true });
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

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: "#d1d5db", fontSize: 14 }}>
            {user?.email} ({user?.role})
          </span>
          <button
            onClick={handleLogout}
            style={{ border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
