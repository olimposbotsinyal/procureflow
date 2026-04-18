// FILE: web/src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import NavBar from "../components/NavBar";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || "/dashboard", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Giriş başarısız.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top left, rgba(236, 201, 130, 0.35), transparent 28%), linear-gradient(135deg, #f7f1e7 0%, #dfe8e2 48%, #eef4f7 100%)" }}>
      <NavBar variant="strategic" activePath="/login" />
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
      <div
        style={{
          width: "min(1120px, 100%)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: 32,
          overflow: "hidden",
          boxShadow: "0 30px 90px rgba(52, 73, 94, 0.18)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            padding: 56,
            color: "white",
            background:
              "radial-gradient(circle at top right, rgba(245,206,126,0.28), transparent 24%), radial-gradient(circle at bottom left, rgba(125,211,252,0.16), transparent 26%), linear-gradient(135deg, #16302b 0%, #21453d 52%, #294d45 100%)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <img src="/brand/buyer-logo-custom.svg" alt="BUYER ASISTANS" style={{ height: 44, maxWidth: "100%" }} />
            <h1 style={{ margin: "22px 0 12px", fontSize: 50, lineHeight: 1.02, fontWeight: 900 }}>
              Kurumsal satin alma calisma alani
            </h1>
            <p style={{ margin: 0, maxWidth: 560, fontSize: 16, lineHeight: 1.7, color: "#dbe4ea" }}>
              Super admin ana platformu yonetir. Admin ve personel kullanicilari giris sonrasinda kendi firma markasi, rolleri ve surecleriyle izole edilmis tenant alanina gecer.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, marginTop: 28 }}>
              <div style={{ borderRadius: 24, padding: 20, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", color: "#cbd5e1" }}>Platform</div>
                <div style={{ marginTop: 10, fontSize: 28, fontWeight: 800 }}>buyerasistans.com.tr</div>
              </div>
              <div style={{ borderRadius: 24, padding: 20, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", color: "#cbd5e1" }}>Model</div>
                <div style={{ marginTop: 10, fontSize: 28, fontWeight: 800 }}>Stratejik Partner Yonetimi</div>
              </div>
            </div>

            <div style={{ marginTop: 24, borderRadius: 28, padding: 22, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,15,15,0.14)" }}>
              <div style={{ fontWeight: 700, color: "#fef3c7" }}>Bu ekranda ne degisti?</div>
              <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.7, color: "#d9e4e9" }}>
                Giris sonrasi ust bar ve dashboard kullanicinin bagli oldugu firma adi, logo ve calisma alani kimligiyle acilir.
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "52px 44px" }}>
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2.2, textTransform: "uppercase", color: "#8a5b2b" }}>
                Yonetim girisi
              </div>
              <h2 style={{ margin: "10px 0 8px", fontSize: 34, lineHeight: 1.08, color: "#0f172a" }}>Hesabinla devam et</h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#64748b" }}>
                Admin, super admin ve davet edilmis personel kullanicilari bu ekran uzerinden kendi yetki alanlarina erisir.
              </p>
            </div>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>E-posta</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 18,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 14,
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Sifre</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 18,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 14,
                  }}
                />
              </label>

              {error && (
                <div style={{ borderRadius: 18, border: "1px solid #fecaca", background: "#fff1f2", padding: "12px 14px", color: "#be123c", fontSize: 14 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: 18,
                  border: "none",
                  background: "#8a5b2b",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Giris yapiliyor..." : "Giris yap"}
              </button>
            </form>

            <div style={{ marginTop: 18, borderRadius: 22, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "16px 18px", color: "#475569", fontSize: 14, lineHeight: 1.7 }}>
              Aktivasyon sonrasi giris yaparken davetin geldigi e-posta adresini kullanin. Sistem sizi dogrudan firma calisma alaniniza tasir.
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
