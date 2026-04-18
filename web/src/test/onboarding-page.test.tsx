import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import OnboardingPage from "../pages/OnboardingPage";

function createJsonResponse(payload: unknown, ok: boolean = true, status: number = 200): Response {
  return {
    ok,
    status,
    json: async () => payload,
  } as Response;
}

describe("OnboardingPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("plan katalogunu yukler ve varsayilan plan ile detay adimina gecer", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      createJsonResponse({
        plans: [
          {
            code: "starter",
            name: "Starter",
            description: "Temel paket",
            audience: "Yeni ekipler",
            is_default: true,
            modules: [
              { code: "rfq_core", name: "RFQ Core", description: "RFQ", enabled: true, limit_value: 5, unit: "proje" },
            ],
          },
          {
            code: "growth",
            name: "Growth",
            description: "Buyuyen ekipler",
            audience: "Orta olcek",
            is_default: false,
            modules: [],
          },
        ],
      })
    );

    const user = userEvent.setup();
    render(<OnboardingPage />);

    expect(await screen.findByRole("heading", { name: /paketinizi seçin/i })).toBeInTheDocument();
    expect(screen.getByText(/starter/i)).toBeInTheDocument();
    expect(screen.getByText(/önerilen/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /devam et/i }));

    expect(await screen.findByText(/firma ve hesap bilgileri/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/örnek a.ş./i)).toBeInTheDocument();
  });

  it("kayit basarisinda tamamlandi ekranini gosterir ve payloadi dogru gonderir", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          plans: [
            {
              code: "starter",
              name: "Starter",
              description: "Temel paket",
              audience: "Yeni ekipler",
              is_default: true,
              modules: [],
            },
          ],
        })
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          tenant_slug: "ornek-as",
          admin_email: "admin@ornek.com",
          invitation_sent: true,
          message: "Kaydınız alındı. Aktivasyon bağlantısı e-posta adresinize gönderildi.",
        })
      );

    const user = userEvent.setup();
    render(<OnboardingPage />);

    await screen.findByRole("heading", { name: /paketinizi seçin/i });
    await user.click(screen.getByRole("button", { name: /devam et/i }));

    await user.type(screen.getByPlaceholderText(/örnek a.ş./i), "Ornek A.S.");
    await user.type(screen.getByPlaceholderText(/opsiyonel/i), "Ornek");
    await user.type(screen.getByPlaceholderText(/ahmet yılmaz/i), "Ayse Yilmaz");
    await user.type(screen.getByPlaceholderText(/ahmet@sirket.com.tr/i), "admin@ornek.com");
    await user.type(screen.getByPlaceholderText(/\+90 5xx xxx xx xx/i), "+90 555 000 00 00");

    await user.click(screen.getByRole("button", { name: /kaydı tamamla/i }));

    expect(await screen.findByRole("heading", { name: /kaydınız alındı/i })).toBeInTheDocument();
    expect(screen.getByText(/gelen kutunuzu kontrol edin/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@ornek.com/i)).toBeInTheDocument();

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("/api/v1/onboarding/register"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_code: "starter",
          legal_name: "Ornek A.S.",
          brand_name: "Ornek",
          full_name: "Ayse Yilmaz",
          email: "admin@ornek.com",
          phone: "+90 555 000 00 00",
        }),
      })
    );
  });

  it("backend hata dondugunde kullaniciya mesaj gosterir", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          plans: [
            {
              code: "starter",
              name: "Starter",
              description: "Temel paket",
              audience: "Yeni ekipler",
              is_default: true,
              modules: [],
            },
          ],
        })
      )
      .mockResolvedValueOnce(createJsonResponse({ detail: "Bu e-posta adresi ile kayitli bir hesap zaten mevcut." }, false, 409));

    const user = userEvent.setup();
    render(<OnboardingPage />);

    await screen.findByRole("heading", { name: /paketinizi seçin/i });
    await user.click(screen.getByRole("button", { name: /devam et/i }));

    await user.type(screen.getByPlaceholderText(/örnek a.ş./i), "Ornek A.S.");
    await user.type(screen.getByPlaceholderText(/ahmet yılmaz/i), "Ayse Yilmaz");
    await user.type(screen.getByPlaceholderText(/ahmet@sirket.com.tr/i), "admin@ornek.com");
    await user.click(screen.getByRole("button", { name: /kaydı tamamla/i }));

    await waitFor(() => {
      expect(screen.getByText(/bu e-posta adresi ile kayitli bir hesap zaten mevcut/i)).toBeInTheDocument();
    });
  });
});