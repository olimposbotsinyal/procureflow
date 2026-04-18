import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAccessToken } from "../lib/token";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type Plan = {
  code: string;
  name: string;
  description?: string;
  price_monthly?: number;
  currency?: string;
  features?: string[];
};

type PricingConfig = {
  strategic_partner: { plans: Plan[] };
  supplier: { plans: Plan[] };
};

const FALLBACK: PricingConfig = {
  strategic_partner: { plans: [] },
  supplier: { plans: [] },
};

export default function PublicPricingAdminPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<PricingConfig>(FALLBACK);
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = useMemo(() => user?.system_role === "super_admin" || user?.role === "super_admin", [user]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/admin/public-pricing-config`, {
      headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setRaw(JSON.stringify(data, null, 2));
      })
      .catch(() => {
        setError("Public pricing config yuklenemedi");
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveConfig() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const parsed = JSON.parse(raw);
      const res = await fetch(`${API_BASE}/api/v1/admin/public-pricing-config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken() ?? ""}`,
        },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Kayit hatasi");
      }
      setConfig(data);
      setRaw(JSON.stringify(data, null, 2));
      setMessage("Public pricing config guncellendi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayit hatasi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: "26px 18px", fontFamily: "'Segoe UI', sans-serif" }}>
      <section style={{ maxWidth: 1000, margin: "0 auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
        <h1 style={{ marginTop: 0, color: "#0f172a" }}>Public Fiyatlandirma Ayarlari</h1>
        <p style={{ color: "#475569", lineHeight: 1.6 }}>
          Bu alan stratejik ortak ve tedarikci plan fiyatlarini merkezi olarak yonetir.
          Public sayfalar (`/fiyatlandirma`) bu konfigurasyonu otomatik kullanir.
        </p>

        {loading ? (
          <div style={{ color: "#64748b" }}>Yukleniyor…</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
              <StatCard label="Stratejik Plan" value={String(config.strategic_partner?.plans?.length || 0)} />
              <StatCard label="Tedarikci Plan" value={String(config.supplier?.plans?.length || 0)} />
              <StatCard label="Yetki" value={isSuperAdmin ? "Yazma" : "Salt Okuma"} />
            </div>

            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={26}
              style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 10, padding: 12, fontFamily: "Consolas, monospace", fontSize: 13 }}
              disabled={!isSuperAdmin}
            />

            {error && <div style={{ marginTop: 10, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 10 }}>{error}</div>}
            {message && <div style={{ marginTop: 10, color: "#065f46", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, padding: 10 }}>{message}</div>}

            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={saveConfig}
                disabled={!isSuperAdmin || saving}
                style={{ background: isSuperAdmin ? "#0f766e" : "#94a3b8", color: "#fff", border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: isSuperAdmin ? "pointer" : "not-allowed" }}
              >
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </button>
              <a href="/admin?tab=campaigns" style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", color: "#0f172a", fontWeight: 700 }}>
                Admin'e Don
              </a>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, background: "#f8fafc" }}>
      <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase" }}>{label}</div>
      <div style={{ color: "#0f172a", fontSize: 24, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </article>
  );
}
