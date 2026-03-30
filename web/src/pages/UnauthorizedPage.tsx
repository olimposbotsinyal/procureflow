// FILE: web\src\pages\UnauthorizedPage.tsx
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: "100%",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>403 - Yetkisiz Erişim</h1>
        <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
          Bu sayfayı görüntülemek için gerekli izniniz yok.
          Hesap rolünüz bu alan için yeterli değil.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Link
            to="/dashboard"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 8,
              background: "#111827",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Dashboard’a Dön
          </Link>

          <Link
            to="/login"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              color: "#111827",
              fontWeight: 600,
            }}
          >
            Farklı Hesapla Giriş
          </Link>
        </div>
      </div>
    </div>
  );
}
