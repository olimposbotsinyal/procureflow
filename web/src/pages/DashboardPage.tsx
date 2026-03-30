// FILE: web\src\pages\DashboardPage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../components/PageLoader";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) return <PageLoader text="Kullanıcı bilgileri yükleniyor..." />;

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 760, margin: "32px auto", padding: 16 }}>
      <h2>Dashboard</h2>

      <p><b>ID:</b> {user.id}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Rol:</b> {user.role}</p>

      {user.role === "admin" ? (
        <>
          <p><b>Admin Panel:</b> Aktif</p>
          <p><Link to="/admin">Admin Paneline Git</Link></p>
        </>
      ) : (
        <p><b>Kullanıcı Paneli:</b> Standart erişim</p>
      )}

      <button
        onClick={logout}
        style={{
          marginTop: 16,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}
