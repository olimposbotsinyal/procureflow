import NavBar, { BRAND_COLORS } from "../components/NavBar";

const c = BRAND_COLORS.supplier;

const features = [
  { icon: "⚡", title: "Hızlı Profil Devreye Alma", desc: "Tedarikçi profilinizi dakikalar içinde oluşturun, kategori ve coğrafya etiketlerinizi tanımlayın." },
  { icon: "📬", title: "İhale Davetlerine Tek Panelden Yanıt", desc: "Gelen ihale davetlerini tek yerden görün, teklifinizi gönderin, durumu takip edin." },
  { icon: "🎯", title: "Kategori Bazlı Görünürlük", desc: "Seçtiğiniz ürün ve hizmet kategorilerinde alıcı kurumların radarında kalın." },
  { icon: "📈", title: "Performans ve Geri Bildirim Raporu", desc: "Teklif kabul oranı, teslimat puanı ve alıcı yorumlarıyla kendinizi geliştirin." },
  { icon: "🏆", title: "Öncü Tedarikçi Rozeti", desc: "Prime seviyede öne çıkma ve öncelikli ihale daveti fırsatları kazanın." },
  { icon: "🤝", title: "Doğrudan Alıcı Bağlantısı", desc: "Alıcı kurumlarla güvenli mesajlaşma ve sözleşme yönetimi tek platformda." },
];

const steps = [
  { num: "01", title: "Kayıt & Profil", desc: "Tedarikçi kaydı oluşturun, kategori ve belgelerinizi yükleyin." },
  { num: "02", title: "Onay & Devreye Alma", desc: "Platform ekibinin hızlı onayının ardından aktif duruma geçin." },
  { num: "03", title: "İhale Yanıtı", desc: "Gelen ihale davetlerine teklif gönderin, müzakere edin." },
  { num: "04", title: "Performans & Büyüme", desc: "Raporlarla kendinizi geliştirin, daha fazla fırsat kazanın." },
];

export default function SupplierProgramPage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f0f9ff" }}>
      <NavBar variant="supplier" activePath="/tedarikci-ol" />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${c.bg} 0%, #1e4976 55%, #1a3a5c 100%)`, color: c.text, padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.35)", color: c.accent, borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 24 }}>
            🏭 Tedarikçi Programı
          </div>
          <h1 style={{ margin: "0 0 16px", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.08, color: "#fff" }}>
            Daha Fazla Alıcıya Ulaşın, <span style={{ color: c.accent }}>Daha Hızlı Büyüyün</span>
          </h1>
          <p style={{ margin: "0 auto 32px", fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, maxWidth: 700 }}>
            BUYER ASISTANS tedarikçi programı; kurumsal alıcılarla buluşmanız, tekliflerinizi yönetmeniz ve performansınızı izlemeniz için tek bir platform.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/onboarding?tenant_type=supplier" style={{ background: `linear-gradient(135deg, ${c.accent} 0%, ${c.accentHover} 100%)`, color: "#fff", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15 }}>🏭 Tedarikçi Ol</a>
            <a href="/demo?audience=supplier" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>📅 Tedarikçi Demosu</a>
            <a href="/fiyatlandirma#tedarikci" style={{ background: "transparent", color: c.accent, border: `1px solid ${c.accent}`, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>💰 Planları Gör</a>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "52px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>Tedarikçi için Ne Sunuyoruz?</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 32, fontSize: 15 }}>Görünürlükten büyümeye, bütün aşamalarda yanınızdayız</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <article key={f.title} style={{ background: "#fff", border: "1px solid #e0f2fe", borderLeft: `4px solid ${c.accent}`, borderRadius: 14, padding: 22, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 16, marginBottom: 6 }}>{f.title}</div>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Adımlar */}
      <section style={{ background: `linear-gradient(135deg, ${c.bg} 0%, #1e4976 100%)`, padding: "52px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 32 }}>Nasıl Başlarsınız?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {steps.map((s) => (
              <div key={s.num} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 14, padding: 22, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: c.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, margin: "0 auto 14px" }}>{s.num}</div>
                <div style={{ fontWeight: 800, color: "#fff", marginBottom: 6, fontSize: 15 }}>{s.title}</div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alt CTA */}
      <section style={{ textAlign: "center", padding: "52px 24px", background: "#fff" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "0 0 12px" }}>Hemen Platforma Katılın</h2>
        <p style={{ color: "#64748b", marginBottom: 28, fontSize: 15 }}>Ücretsiz temel plan ile hemen başlayın.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/onboarding?tenant_type=supplier" style={{ background: `linear-gradient(135deg, ${c.bg} 0%, #1e4976 100%)`, color: c.accent, padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15, border: "1px solid rgba(14,165,233,0.3)" }}>🏭 Tedarikçi Kaydı</a>
          <a href="/demo?audience=supplier" style={{ background: c.accent, color: "#fff", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15 }}>📅 Demo Talep Et</a>
          <a href="/supplier/login" style={{ background: "#f1f5f9", color: "#0f172a", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15, border: "1px solid #e2e8f0" }}>🔑 Tedarikçi Girişi</a>
        </div>
      </section>

      <footer style={{ background: c.bg, color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "20px", fontSize: 13 }}>
        © {new Date().getFullYear()} BUYER ASISTANS · Tedarikçi Programı
      </footer>
    </div>
  );
}
