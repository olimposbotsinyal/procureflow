import { useState, type CSSProperties } from "react";
import NavBar, { BRAND_COLORS } from "../components/NavBar";

export default function DemoRequestPage() {
  const [sent, setSent] = useState(false);
  const audience = new URLSearchParams(globalThis.location?.search || "").get("audience") === "supplier" ? "supplier" : "strategic";
  const isSupplierDemo = audience === "supplier";
  const c = isSupplierDemo ? BRAND_COLORS.supplier : BRAND_COLORS.strategic;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: isSupplierDemo ? "#f0f9ff" : "#f0fdf4" }}>
      <NavBar variant={isSupplierDemo ? "supplier" : "strategic"} activePath="/demo" />

      {/* Hero Banner */}
      <section style={{ background: `linear-gradient(135deg, ${c.bg} 0%, ${isSupplierDemo ? "#1e4976" : "#1e4a3d"} 100%)`, padding: "40px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `rgba(${isSupplierDemo ? "14,165,233" : "212,175,55"},0.12)`, border: `1px solid rgba(${isSupplierDemo ? "14,165,233" : "212,175,55"},0.35)`, color: c.accent, borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 16 }}>
            {isSupplierDemo ? "🏭 Tedarikçi Demosu" : "🤝 Stratejik Ortak Demosu"}
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#fff" }}>
            {isSupplierDemo ? "Tedarikçi Deneyimini Birlikte Keşfedelim" : "Kurumsal Demo — Sizin Sürecinizle"}
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.6 }}>
            {isSupplierDemo
              ? "Teklif yanıt akışları, kategori görünürlüğü ve performans panelini canlı inceleyin."
              : "Sektörünüze özel 45 dakikalık canlı senaryo, gap analizi ve 90 günlük onboarding planı."}
          </p>
          {/* Mod değiştirici */}
          <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
            <a href="/demo?audience=strategic" style={{ background: !isSupplierDemo ? BRAND_COLORS.strategic.accent : "rgba(255,255,255,0.12)", color: !isSupplierDemo ? BRAND_COLORS.strategic.bg : "rgba(255,255,255,0.75)", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 800, fontSize: 13, border: !isSupplierDemo ? "none" : "1px solid rgba(255,255,255,0.2)" }}>
              🤝 Stratejik Ortak Demosu
            </a>
            <a href="/demo?audience=supplier" style={{ background: isSupplierDemo ? BRAND_COLORS.supplier.accent : "rgba(255,255,255,0.12)", color: isSupplierDemo ? "#fff" : "rgba(255,255,255,0.75)", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 800, fontSize: 13, border: isSupplierDemo ? "none" : "1px solid rgba(255,255,255,0.2)" }}>
              🏭 Tedarikçi Demosu
            </a>
          </div>
        </div>
      </section>

      {/* İçerik + Form */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {/* Açıklama kutusu */}
        <article style={{ background: "#fff", border: `1px solid ${isSupplierDemo ? "#e0f2fe" : "#dcfce7"}`, borderLeft: `4px solid ${c.accent}`, borderRadius: 16, padding: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <h2 style={{ marginTop: 0, fontSize: 20, color: "#0f172a", fontWeight: 900 }}>Demo Kapsamı</h2>
          <ul style={{ margin: "0 0 16px", paddingLeft: 20, lineHeight: 2, fontSize: 14, color: "#334155" }}>
            {isSupplierDemo ? (
              <>
                <li>Tedarikçi onboarding ve profil devreye alma</li>
                <li>İhale daveti alma ve teklif gönderme akışı</li>
                <li>Kategori bazlı görünürlük stratejisi</li>
                <li>Performans paneli ve geri bildirim sistemi</li>
                <li>Tedarikçi paketi fiyatlandırma rehberi</li>
              </>
            ) : (
              <>
                <li>45 dakika canlı ürün senaryosu</li>
                <li>Mevcut sürecine özel gap analizi</li>
                <li>İlk 90 gün onboarding planı</li>
                <li>Rol bazlı onay ve denetim akışları</li>
                <li>Kurumsal fiyatlandırma ve entegrasyon rehberi</li>
              </>
            )}
          </ul>
          <div style={{ background: isSupplierDemo ? "#f0f9ff" : "#f0fdf4", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#334155", lineHeight: 1.6 }}>
            <strong>⏱️ Süre:</strong> ~45 dakika &nbsp;|&nbsp; <strong>📍 Format:</strong> Online / Yerinde
          </div>
        </article>

        {/* Form */}
        <article style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <h2 style={{ marginTop: 0, fontSize: 20, color: "#0f172a", fontWeight: 900 }}>Demo Talep Formu</h2>
          {sent ? (
            <div style={{ background: "#ecfdf5", border: "1px solid #86efac", color: "#166534", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.7 }}>
              ✅ <strong>Talebiniz alındı!</strong> En kısa sürede ekibimiz size dönüş yapacak.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "grid", gap: 10 }}>
              <input required placeholder="Ad Soyad *" style={inputStyle} />
              <input required type="email" placeholder="İş e-postası *" style={inputStyle} />
              <input placeholder="Firma" style={inputStyle} />
              <input placeholder={isSupplierDemo ? "Ürün / Hizmet Kategorisi" : "Pozisyon"} style={inputStyle} />
              <input placeholder={isSupplierDemo ? "Yıllık ihale yanıt adedi" : "Aylık ihale adedi"} style={inputStyle} />
              <textarea placeholder="Notunuz" rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />
              <button type="submit" style={{ background: `linear-gradient(135deg, ${c.bg} 0%, ${isSupplierDemo ? "#1e4976" : "#1e4a3d"} 100%)`, color: isSupplierDemo ? c.accent : c.accent, border: "none", borderRadius: 10, padding: "12px 16px", fontWeight: 800, cursor: "pointer", fontSize: 15, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                📅 Demo Talep Gönder
              </button>
            </form>
          )}
        </article>
      </section>

      <footer style={{ background: c.bg, color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "20px", fontSize: 13 }}>
        © {new Date().getFullYear()} BUYER ASISTANS · Demo Talebi
      </footer>
    </div>
  );
}

const inputStyle: CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box" as const,
};
