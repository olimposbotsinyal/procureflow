// FILE: web/src/pages/OnboardingPage.tsx
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface PlanModule {
  code: string;
  name: string;
  description: string;
  enabled: boolean;
  limit_key?: string;
  limit_value?: number;
  unit?: string;
}

interface Plan {
  code: string;
  name: string;
  description: string;
  audience: string;
  price_monthly?: number;
  currency?: string;
  requires_payment?: boolean;
  is_default: boolean;
  modules: PlanModule[];
}

interface PaymentProvider {
  code: string;
  name: string;
  ready?: boolean;
}

type TenantType = "strategic_partner" | "supplier";
type WizardStep = "tenant_type" | "plan" | "details" | "payment" | "done";

interface TenantTypeOption {
  type: TenantType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const TENANT_TYPES: TenantTypeOption[] = [
  {
    type: "strategic_partner",
    title: "Stratejik Ortaklik",
    description: "Kurumsal satin alma ekibi - Tedarikcileri yonetin, teklif alin",
    color: "#4f46e5",
    bgColor: "#eef2ff",
  },
  {
    type: "supplier",
    title: "Tedarikci",
    description: "Teklif sunun, musteri bulun, daha fazla is kazanin",
    color: "#0891b2",
    bgColor: "#ecf0ff",
  },
];

export default function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const paramTenantType = (searchParams.get("tenant_type") || "") as TenantType | "";
  const paramPlanCode = (searchParams.get("plan_code") || "").trim();

  const [step, setStep] = useState<WizardStep>(paramTenantType ? "plan" : "tenant_type");
  const [selectedTenantType, setSelectedTenantType] = useState<TenantType | "">(paramTenantType || "");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>(paramPlanCode || "");

  const [legalName, setLegalName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("bank_transfer");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentTransactionId, setPaymentTransactionId] = useState<number | null>(null);
  const [paymentNote, setPaymentNote] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneData, setDoneData] = useState<{ tenant_slug: string; admin_email: string; invitation_sent: boolean; message: string; payment_verified?: boolean } | null>(null);

  const selectedPlanObj = useMemo(() => plans.find((p) => p.code === selectedPlan) || null, [plans, selectedPlan]);
  const selectedPlanPrice = Number(selectedPlanObj?.price_monthly || 0);
  const selectedPlanCurrency = selectedPlanObj?.currency || "TRY";
  const selectedPlanRequiresPayment = Boolean(selectedPlanObj?.requires_payment && selectedPlanPrice > 0);
  const selectedPlanNeedsSalesContact = Boolean(
    selectedPlanObj?.audience === "strategic_partner" && selectedPlanPrice <= 0,
  );

  useEffect(() => {
    if (!selectedTenantType) {
      setPlans([]);
      setPlansLoading(false);
      return;
    }

    setPlansLoading(true);
    fetch(`${API_BASE}/api/v1/onboarding/plans`)
      .then((r) => r.json())
      .then((data) => {
        const allPlans = Array.isArray(data?.plans) ? data.plans : [];
        const filteredPlans = allPlans.filter((p: Plan) => p.audience === selectedTenantType);
        setPlans(filteredPlans);

        if (paramPlanCode) {
          const fromQuery = filteredPlans.find((p: Plan) => p.code === paramPlanCode);
          if (fromQuery) {
            setSelectedPlan(fromQuery.code);
            return;
          }
        }

        const def = filteredPlans.find((p: Plan) => p.is_default);
        if (def) {
          setSelectedPlan(def.code);
        } else if (filteredPlans.length > 0) {
          setSelectedPlan(filteredPlans[0].code);
        }
      })
      .catch(() => setPlans([]))
      .finally(() => setPlansLoading(false));
  }, [selectedTenantType, paramPlanCode]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/payment/providers`)
      .then((r) => r.json())
      .then((data) => {
        const providers = Array.isArray(data?.providers) ? data.providers : [];
        setPaymentProviders(providers);
        if (providers.length > 0 && !providers.some((p: PaymentProvider) => p.code === selectedProvider)) {
          setSelectedProvider(providers[0].code);
        }
      })
      .catch(() => setPaymentProviders([]));
  }, [selectedProvider]);

  async function submitRegistration(planCodeToUse: string, paymentTxnId: number | null) {
    const res = await fetch(`${API_BASE}/api/v1/onboarding/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_code: planCodeToUse,
        legal_name: legalName.trim(),
        brand_name: brandName.trim() || undefined,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        payment_transaction_id: paymentTxnId ?? undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail ?? "Kayit sirasinda bir hata olustu.");
    }
    setDoneData(data);
    setStep("done");
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!legalName.trim() || !fullName.trim() || !email.trim() || !selectedPlan) {
      setError("Lutfen zorunlu alanlari doldurun.");
      return;
    }

    if (selectedPlanNeedsSalesContact) {
      setError("Bu plan kuruma ozel oldugu icin self-serve kayitla tamamlanamaz. Lutfen satis ekibiyle iletisime gecin.");
      return;
    }

    if (selectedPlanRequiresPayment && !paymentTransactionId) {
      setStep("payment");
      return;
    }

    setSubmitting(true);
    try {
      await submitRegistration(selectedPlan, paymentTransactionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sunucuya baglanilamadi. Lutfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePaymentAndComplete() {
    setError(null);

    if (!selectedPlanObj || selectedPlanPrice <= 0) {
      setError("Odeme gerektiren bir plan secmelisiniz.");
      return;
    }

    if (!email.trim() || !fullName.trim()) {
      setError("Odeme adimindan once hesap bilgilerini doldurun.");
      setStep("details");
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentRes = await fetch(`${API_BASE}/api/v1/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider,
          amount: selectedPlanPrice,
          currency: selectedPlanCurrency,
          description: `Onboarding ${selectedPlanObj.name} plani`,
          buyer_email: email.trim(),
          buyer_name: fullName.trim(),
          transaction_type: "subscription",
          reference_type: "onboarding_plan",
          extra: {
            plan_code: selectedPlanObj.code,
            transfer_reference: `ONB-${Date.now()}`,
          },
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentData.detail ?? "Odeme baslatilamadi.");
      }

      const txnId = Number(paymentData.transaction_id);
      if (!txnId) {
        throw new Error("Odeme islemi olusturulamadi.");
      }

      setPaymentTransactionId(txnId);

      if (paymentData.redirect_url) {
        window.open(String(paymentData.redirect_url), "_blank", "noopener,noreferrer");
        setPaymentNote("Odeme penceresi yeni sekmede acildi. Odeme adimini tamamlayip geri donun.");
      } else {
        setPaymentNote("Odeme islemi olusturuldu. Kayit adimina devam ediliyor.");
      }

      setSubmitting(true);
      await submitRegistration(selectedPlanObj.code, txnId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Odeme adimi basarisiz oldu.");
    } finally {
      setPaymentLoading(false);
      setSubmitting(false);
    }
  }

  const navVariant = selectedTenantType === "supplier" ? "supplier" : "strategic";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)" }}>
      <NavBar variant={navVariant} activePath="/onboarding" />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.header}>
            <img src="/brand/buyer-logo-custom.svg" alt="BUYER ASISTANS" style={{ height: 44, maxWidth: "100%" }} />
            <div style={styles.subtitle}>Tedarik sureclerinizi dijitallestirin</div>
          </div>

          <div style={styles.steps}>
            {(["tenant_type", "plan", "details", "payment", "done"] as WizardStep[]).map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    ...styles.stepDot,
                    background: step === s ? "#4f46e5" : i < ["tenant_type", "plan", "details", "payment", "done"].indexOf(step) ? "#6ee7b7" : "#e5e7eb",
                    color: step === s || i < ["tenant_type", "plan", "details", "payment", "done"].indexOf(step) ? "#fff" : "#9ca3af",
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ fontSize: 12, color: step === s ? "#4f46e5" : "#6b7280", fontWeight: step === s ? 600 : 400 }}>
                  {s === "tenant_type" ? "Siz Kimsiniz?" : s === "plan" ? "Plan Secimi" : s === "details" ? "Hesap Bilgileri" : s === "payment" ? "Odeme" : "Tamamlandi"}
                </span>
                {i < 4 && <div style={styles.stepLine} />}
              </div>
            ))}
          </div>

          {step === "tenant_type" && (
            <div>
              <h2 style={styles.stepTitle}>Siz kimsiniz?</h2>
              <p style={styles.stepDesc}>Lutfen isletme tipinizi secin.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginTop: 20 }}>
                {TENANT_TYPES.map((type) => (
                  <div
                    key={type.type}
                    onClick={() => {
                      setSelectedTenantType(type.type);
                      setSelectedPlan("");
                      setError(null);
                      setStep("plan");
                    }}
                    style={{
                      ...styles.planCard,
                      border: "2px solid #e5e7eb",
                      cursor: "pointer",
                      background: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: type.bgColor,
                          border: `2px solid ${type.color}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: type.color,
                          fontWeight: 700,
                          fontSize: 20,
                        }}
                      >
                        {type.type === "strategic_partner" ? "🏢" : "🏭"}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 17, color: "#111827" }}>{type.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "plan" && (
            <div>
              <h2 style={styles.stepTitle}>Paketinizi secin</h2>
              <p style={styles.stepDesc}>Fiyat bilgisi super admin tarafindan yonetilir ve secime gore odeme adimi zorunlu tutulur.</p>
              {plansLoading ? (
                <div style={styles.loading}>Paketler yukleniyor...</div>
              ) : (
                <div style={styles.planGrid}>
                  {plans.map((plan) => (
                    <div
                      key={plan.code}
                      onClick={() => {
                        setSelectedPlan(plan.code);
                        setError(null);
                      }}
                      style={{
                        ...styles.planCard,
                        border: selectedPlan === plan.code ? "2px solid #4f46e5" : "2px solid #e5e7eb",
                        background: selectedPlan === plan.code ? "#eef2ff" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 17 }}>{plan.name}</span>
                        {plan.is_default ? <span style={styles.badge}>Onerilen</span> : null}
                      </div>
                      <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{plan.description}</p>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                        {renderPrice(plan)}
                      </div>
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                        {plan.modules.slice(0, 4).map((m) => (
                          <div key={m.code} style={{ fontSize: 12, color: "#374151", display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ color: "#10b981" }}>✓</span>
                            <span>
                              {m.name}
                              {m.limit_value ? ` - ${m.limit_value} ${m.unit}` : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {error && <div style={styles.error}>{error}</div>}
              <div style={styles.actions}>
                {!paramTenantType ? (
                  <button type="button" style={styles.btnSecondary} onClick={() => setStep("tenant_type")}>← Geri</button>
                ) : null}
                <button
                  style={styles.btnPrimary}
                  disabled={!selectedPlan || selectedPlanNeedsSalesContact}
                  onClick={() => {
                    setError(null);
                    setStep("details");
                  }}
                >
                  Devam Et →
                </button>
              </div>
              {selectedPlanNeedsSalesContact ? (
                <div style={styles.infoBox}>
                  Bu plan kuruma ozel oldugu icin self-serve akista devam edilemez. Lutfen <a href="/demo?audience=strategic">satis ekibiyle gorusun</a>.
                </div>
              ) : null}
            </div>
          )}

          {step === "details" && (
            <form onSubmit={handleRegister}>
              <h2 style={styles.stepTitle}>Firma ve hesap bilgileri</h2>
              <p style={styles.stepDesc}>Sisteme giris yapacak ilk yonetici hesabini olusturun.</p>
              {selectedPlanObj && (
                <div style={styles.infoBox}>
                  <strong>Secilen plan:</strong> {selectedPlanObj.name} - {renderPrice(selectedPlanObj)}
                </div>
              )}
              <div style={styles.formGrid}>
                <label style={styles.label}>
                  Firma ticari unvani *
                  <input style={styles.input} value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Ornek A.S." required />
                </label>
                <label style={styles.label}>
                  Marka adi
                  <input style={styles.input} value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Opsiyonel" />
                </label>
                <label style={styles.label}>
                  Yetkili adi soyadi *
                  <input style={styles.input} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ahmet Yilmaz" required />
                </label>
                <label style={styles.label}>
                  Is e-posta adresi *
                  <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ahmet@sirket.com.tr" required />
                </label>
                <label style={styles.label}>
                  Telefon
                  <input style={styles.input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 5xx xxx xx xx" />
                </label>
              </div>
              {error && <div style={styles.error}>{error}</div>}
              <div style={styles.actions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setStep("plan")}>← Geri</button>
                <button type="submit" style={styles.btnPrimary} disabled={submitting}>
                  {submitting ? "Kaydediliyor..." : selectedPlanRequiresPayment ? "Odeme Adimina Gec" : "Kaydi Tamamla"}
                </button>
              </div>
            </form>
          )}

          {step === "payment" && (
            <div>
              <h2 style={styles.stepTitle}>Odeme adimi</h2>
              <p style={styles.stepDesc}>Secilen plan ucretli oldugu icin kayit oncesi odeme islemi zorunludur.</p>
              <div style={styles.infoBox}>
                <div><strong>Plan:</strong> {selectedPlanObj?.name}</div>
                <div><strong>Tutar:</strong> {selectedPlanPrice.toLocaleString("tr-TR")} {selectedPlanCurrency} / ay</div>
              </div>

              <label style={styles.label}>
                Odeme yontemi
                <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)} style={styles.select}>
                  {paymentProviders.length === 0 ? <option value="bank_transfer">Havale / EFT</option> : null}
                  {paymentProviders.map((p) => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </label>

              {paymentNote ? <div style={styles.success}>{paymentNote}</div> : null}
              {error && <div style={styles.error}>{error}</div>}

              <div style={styles.actions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setStep("details")}>← Geri</button>
                <button type="button" style={styles.btnPrimary} onClick={handlePaymentAndComplete} disabled={paymentLoading || submitting}>
                  {paymentLoading || submitting ? "Isleniyor..." : "Odemeyi Baslat ve Kaydi Tamamla"}
                </button>
              </div>
            </div>
          )}

          {step === "done" && doneData && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h2 style={{ ...styles.stepTitle, textAlign: "center" }}>Kaydiniz alindi!</h2>
              <p style={{ color: "#6b7280", margin: "0 0 20px" }}>{doneData.message}</p>
              <div style={styles.doneBox}>
                <div><strong>Hesap:</strong> {doneData.admin_email}</div>
                <div style={{ marginTop: 6 }}>
                  {doneData.payment_verified ? "✅ Odeme adimi dogrulandi." : "ℹ️ Bu plan icin odeme adimi gerekmiyor."}
                </div>
                <div style={{ marginTop: 6 }}>
                  {doneData.invitation_sent ? "✅ Aktivasyon e-postasi gonderildi. Gelen kutunuzu kontrol edin." : "⏳ Aktivasyon baglantisi yakinda iletilecektir."}
                </div>
              </div>
              <a href="/login" style={styles.linkBtn}>Giris sayfasina git →</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderPrice(plan: Plan): string {
  const amount = Number(plan.price_monthly || 0);
  if (!amount || amount <= 0) {
    return "Kuruma Ozel Teklif";
  }
  return `${amount.toLocaleString("tr-TR")} ${plan.currency || "TRY"} / ay`;
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
    padding: "40px 48px",
    width: "100%",
    maxWidth: 760,
  },
  header: { textAlign: "center", marginBottom: 28 },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  steps: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 32, flexWrap: "wrap" },
  stepDot: { width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 },
  stepLine: { width: 22, height: 2, background: "#e5e7eb" },
  stepTitle: { fontSize: 32, fontWeight: 700, color: "#111827", margin: "0 0 6px" },
  stepDesc: { fontSize: 14, color: "#6b7280", margin: "0 0 20px" },
  loading: { textAlign: "center", padding: 32, color: "#6b7280" },
  planGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 },
  planCard: { borderRadius: 10, padding: "16px 14px", transition: "border-color 0.15s" },
  badge: { background: "#4f46e5", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600 },
  formGrid: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 },
  label: { display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "#374151", fontWeight: 500 },
  input: { border: "1px solid #d1d5db", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none", color: "#111827" },
  select: { border: "1px solid #d1d5db", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none", color: "#111827", marginBottom: 16 },
  error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 },
  success: { background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 },
  infoBox: { background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", marginBottom: 14, color: "#334155", fontSize: 13 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 },
  btnPrimary: { background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnSecondary: { background: "transparent", color: "#6b7280", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 20px", fontWeight: 500, fontSize: 14, cursor: "pointer" },
  doneBox: { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", textAlign: "left", marginBottom: 20, fontSize: 14 },
  linkBtn: { display: "inline-block", color: "#4f46e5", fontWeight: 600, fontSize: 14, textDecoration: "none" },
};
