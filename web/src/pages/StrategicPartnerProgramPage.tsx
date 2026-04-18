import NavBar, { BRAND_COLORS } from "../components/NavBar";

const c = BRAND_COLORS.strategic;

const features = [
  { icon: "🗓️", title: "90 Günlük Canlıya Geçiş Planı", desc: "Haftalık kilometre taşları, onboarding koçu ve teknik destek ile platforma en kısa sürede entegre olun." },
  { icon: "🔐", title: "Rol Bazlı Onay ve Denetim", desc: "Çok seviyeli onay zinciri, denetim izi ve kurumsal yönetişim gerekliliklerine tam uyum." },
  { icon: "🏭", title: "Tedarikçi Havuzu + Özel Havuz", desc: "Platform tedarikçi veri tabanı ile kendi özel tedarikçi listenizi yan yana yönetin." },
  { icon: "📊", title: "Yönetim KPI Panosu", desc: "Tasarruf oranı, onay süresi, tedarikçi performansı — yönetim kuruluna hazır raporlar." },
  { icon: "🤖", title: "AI Destekli Teklif Analizi", desc: "Gelen teklifleri piyasa verileriyle otomatik karşılaştır, sapan fiyatları anında tespit et." },
  { icon: "🔗", title: "ERP / API Entegrasyonu", desc: "SAP, Oracle ve diğer sistemlerle veri köprüsü — manuel veri girişine son." },
];

const steps = [
  { num: "01", title: "Keşif Görüşmesi", desc: "Mevcut süreçlerinizi ve hedeflerinizi birlikte haritalandırıyoruz." },
  { num: "02", title: "Özelleştirilmiş Demo", desc: "Sektörünüze özel senaryolarla canlı platform tanıtımı." },
  { num: "03", title: "Onboarding Başlangıcı", desc: "90 günlük plan aktivasyonu ve ilk tedarikçi entegrasyonu." },
  { num: "04", title: "Tam Operasyon", desc: "Süreç optimizasyonu, raporlama ve sürekli iyileştirme döngüsü." },
];

export default function StrategicPartnerProgramPage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <NavBar variant="strategic" activePath="/stratejik-ortaklik" />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${c.bg} 0%, #1e4a3d 55%, #20503e 100%)`, color: c.text, padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: c.accent, borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 24 }}>
            🤝 Stratejik Ortak Programı
          </div>
          <h1 style={{ margin: "0 0 16px", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.08, color: "#fff" }}>
            Satın Alma Operasyonunuzu <span style={{ color: c.accent }}>Birlikte Dönüştürelim</span>
          </h1>
          <p style={{ margin: "0 auto 32px", fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, maxWidth: 700 }}>
            BUYER ASISTANS, kurumsal satın alma ekipleri için operasyonel yazılım ve süreç danışmanlığını bir arada sunar. Onboarding'den tam operasyona kadar yanınızdayız.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/onboarding?tenant_type=strategic_partner" style={{ background: `linear-gradient(135deg, ${c.accent} 0%, ${c.accentHover} 100%)`, color: c.bg, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15 }}>🚀 Stratejik Ortak Ol</a>
            <a href="/demo?audience=strategic" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>📅 Demo Planla</a>
            <a href="/fiyatlandirma#stratejik" style={{ background: "transparent", color: c.accent, border: `1px solid ${c.accent}`, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>💰 Planları Gör</a>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "52px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>Stratejik Ortaklara Özel Yetenekler</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 32, fontSize: 15 }}>Kurumsal satın alma operasyonunuzu uçtan uca kapsayan modüller</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <article key={f.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderLeft: `4px solid ${c.accent}`, borderRadius: 14, padding: 22, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 16, marginBottom: 6 }}>{f.title}</div>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Adımlar */}
      <section style={{ background: `linear-gradient(135deg, ${c.bg} 0%, #1a3d30 100%)`, padding: "52px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 32 }}>Nasıl Çalışır?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {steps.map((s) => (
              <div key={s.num} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 14, padding: 22, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: c.accent, color: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, margin: "0 auto 14px" }}>{s.num}</div>
                <div style={{ fontWeight: 800, color: "#fff", marginBottom: 6, fontSize: 15 }}>{s.title}</div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alt CTA */}
      <section style={{ textAlign: "center", padding: "52px 24px", background: "#fff" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "0 0 12px" }}>Hazır mısınız?</h2>
        <p style={{ color: "#64748b", marginBottom: 28, fontSize: 15 }}>Kurumsal demo planlayın veya hemen kaydolun.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/onboarding?tenant_type=strategic_partner" style={{ background: `linear-gradient(135deg, ${c.bg} 0%, #1e4a3d 100%)`, color: c.accent, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15, border: "1px solid rgba(212,175,55,0.3)" }}>🚀 Hemen Başla</a>
          <a href="/demo?audience=strategic" style={{ background: c.accent, color: c.bg, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15 }}>📅 Demo Talep Et</a>
        </div>
      </section>

      <footer style={{ background: c.bg, color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "20px", fontSize: 13 }}>
        © {new Date().getFullYear()} BUYER ASISTANS · Stratejik Partner Satın Alma Platformu
      </footer>
    </div>
  );
}
