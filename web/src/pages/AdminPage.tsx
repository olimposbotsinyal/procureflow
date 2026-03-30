// FILE: web\src\pages\AdminPage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 760, margin: "32px auto", padding: 16 }}>
      <h2>Admin Panel</h2>
      <p>Hoş geldin, {user?.email}</p>
      <p>Bu alan sadece admin kullanıcılar içindir.</p>

      <p style={{ marginTop: 16 }}>
        <Link to="/dashboard">Dashboard’a dön</Link>
      </p>
    </div>
  );
}
