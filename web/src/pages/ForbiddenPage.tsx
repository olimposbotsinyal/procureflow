// FILE: web/src/pages/ForbiddenPage.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const deniedFrom =
    (location.state as { deniedFrom?: string } | null)?.deniedFrom ?? "bu sayfa";

  return (
    <div style={{ maxWidth: 720, margin: "48px auto", padding: 16, fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: 8 }}>403 - Yetkisiz Erişim</h1>
      <p style={{ color: "#374151" }}>
        <b>{deniedFrom}</b> için gerekli yetkiye sahip değilsiniz.
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "1px solid #d1d5db",
            background: "#fff",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Geri Dön
        </button>

        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#111827",
            background: "#fff",
          }}
        >
          Dashboard'a Git
        </Link>
      </div>
    </div>
  );
}
