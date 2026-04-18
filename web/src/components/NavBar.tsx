/**
 * NavBar — Paylaşımlı üst menü bileşeni
 *
 * Renk sabitleri (tüm uygulama genelinde kullanılmalı):
 *   Stratejik Ortak:  bg=#112a25  vurgu=#D4AF37
 *   Tedarikçi:        bg=#1a3a5c  vurgu=#0ea5e9
 */

export const BRAND_COLORS = {
  strategic: {
    bg: "#112a25",
    accent: "#D4AF37",
    accentHover: "#b5952f",
    text: "#f0fdf4",
    ctaBg: "#D4AF37",
    ctaText: "#112a25",
  },
  supplier: {
    bg: "#1a3a5c",
    accent: "#0ea5e9",
    accentHover: "#0284c7",
    text: "#f0f9ff",
    ctaBg: "#0ea5e9",
    ctaText: "#fff",
  },
  channel: {
    bg: "#2b1d0e",
    accent: "#f59e0b",
    accentHover: "#d97706",
    text: "#fff7ed",
    ctaBg: "#f59e0b",
    ctaText: "#2b1d0e",
  },
  neutral: {
    bg: "#0f172a",
    accent: "#22c55e",
    text: "#f8fafc",
  },
} as const;

type NavVariant = "strategic" | "supplier" | "channel" | "neutral";

interface NavBarProps {
  variant?: NavVariant;
  activePath?: string;
}

export default function NavBar({ variant = "neutral", activePath = "" }: NavBarProps) {
  const c = BRAND_COLORS[variant];

  const links: { href: string; label: string }[] = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/cozumler", label: "Çözümler" },
    { href: "/fiyatlandirma", label: "Fiyatlandırma" },
    { href: "/stratejik-ortaklik", label: "Stratejik Ortaklık" },
    { href: "/is-ortagi-programi", label: "İş Ortağı Programı" },
    { href: "/tedarikci-ol", label: "Tedarikçi Ol" },
    { href: "/demo", label: "Demo Talep Et" },
  ];

  return (
    <nav
      style={{
        background: c.bg,
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Logo → Ana Sayfa */}
      <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
        <img
          src="/brand/buyer-logo-custom.svg"
          alt="BUYER ASISTANS"
          style={{ height: 36, filter: "brightness(0) invert(1)", maxWidth: 160 }}
        />
      </a>

      {/* Navigasyon Linkleri */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {links.map((l) => {
          const isActive = activePath === l.href;
          return (
            <a
              key={l.href}
              href={l.href}
              style={{
                color: isActive ? (c as any).accent ?? "#D4AF37" : "rgba(255,255,255,0.75)",
                textDecoration: "none",
                fontWeight: isActive ? 800 : 600,
                fontSize: 13,
                padding: "6px 10px",
                borderRadius: 6,
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                borderBottom: isActive ? `2px solid ${(c as any).accent ?? "#D4AF37"}` : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {l.label}
            </a>
          );
        })}

        {/* Sağ CTA butonları */}
        <div style={{ marginLeft: 12, display: "flex", gap: 8 }}>
          {variant === "supplier" ? (
            <a href="/supplier/login" style={ctaBtn(BRAND_COLORS.supplier)}>
              Tedarikçi Girişi
            </a>
          ) : variant === "channel" ? (
            <a href="/login" style={ctaBtn(BRAND_COLORS.channel)}>
              İş Ortağı Girişi
            </a>
          ) : (
            <a href="/login" style={ctaBtn(BRAND_COLORS.strategic)}>
              Sisteme Giriş
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

function ctaBtn(c: { ctaBg: string; ctaText: string }) {
  return {
    background: c.ctaBg,
    color: c.ctaText,
    padding: "7px 14px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 13,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  } as const;
}
