import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { clearSupplierToken } from "../lib/session";
import { confirmSupplierEmailChange } from "../services/supplier-profile.service";

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #eef2f7;
  padding: 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.12);
  padding: 26px;
`;

const Btn = styled.button`
  margin-top: 18px;
  border: none;
  background: #0f766e;
  color: #fff;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export default function SupplierEmailChangeConfirmPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("Doğrulama yapılıyor...");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    async function run() {
      const tokenValue = (params.get("token") || "").trim();
      if (!tokenValue) {
        setMessage("Token bulunamadı.");
        setLoading(false);
        return;
      }
      setToken(tokenValue);
      setMessage("E-posta doğrulamak için isterseniz yeni şifre belirleyip onaylayın.");
      setLoading(false);
    }
    void run();
  }, [params]);

  const handleConfirm = async () => {
    if (!token || submitting) return;
    if (password || password2) {
      if (password !== password2) {
        setMessage("Şifre tekrar alanı eşleşmiyor.");
        return;
      }
      if (password.length < 4) {
        setMessage("Şifre en az 4 karakter olmalıdır.");
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await confirmSupplierEmailChange(token, password || undefined);
      setMessage(res.message || "E-posta değişikliği onaylandı.");
      setSuccess(true);
      clearSupplierToken();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setMessage(detail || "Onay işlemi başarısız.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (loading || !success) return;
    if (countdown <= 0) {
      navigate("/supplier/login", { replace: true });
      return;
    }

    const timer = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [loading, success, countdown, navigate]);

  return (
    <Wrap>
      <Card>
        <h2 style={{ marginTop: 0, color: "#1f2937" }}>E-posta Doğrulama</h2>
        <p style={{ color: "#475569", fontSize: 15 }}>
          {loading ? "İşlem sürüyor..." : message}
        </p>
        {!loading && !success && (
          <div style={{ display: "grid", gap: 10 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni şifre (opsiyonel)"
              style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}
            />
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Yeni şifre tekrar"
              style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}
            />
            <Btn onClick={handleConfirm} disabled={submitting}>
              {submitting ? "Onaylanıyor..." : "E-postayı Onayla"}
            </Btn>
          </div>
        )}
        {!loading && success && (
          <p style={{ color: "#0f766e", fontSize: 14, fontWeight: 700 }}>
            Oturumunuz güvenlik için kapatıldı. {countdown} sn içinde giriş sayfasına yönlendirileceksiniz.
          </p>
        )}
        {!loading && success && (
          <Btn onClick={() => navigate("/supplier/login", { replace: true })}>
            {success ? "Giriş Sayfasına Git" : "Tekrar Girişe Dön"}
          </Btn>
        )}
      </Card>
    </Wrap>
  );
}
