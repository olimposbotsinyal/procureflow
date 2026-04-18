import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PublicHomePage from "../pages/PublicHomePage";
import SolutionsPage from "../pages/SolutionsPage";
import PricingPage from "../pages/PricingPage";
import DemoRequestPage from "../pages/DemoRequestPage";

describe("Public pages", () => {
  it("ana sayfa stratejik cta linklerini gosterir", () => {
    render(<PublicHomePage />);

    expect(screen.getByRole("heading", { name: /satın alma operasyonlarınızı tek merkezden yönetin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /hemen başla/i })).toHaveAttribute("href", "/onboarding");
    expect(screen.getByRole("link", { name: "Çözümleri İncele" })).toHaveAttribute("href", "/cozumler");
  });

  it("cozumler ve fiyatlandirma sayfalari temel icerigi gosterir", () => {
    const { rerender } = render(<SolutionsPage />);

    expect(screen.getByRole("heading", { name: /çözümler/i })).toBeInTheDocument();
    expect(screen.getByText(/rfq yönetimi/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /onay akışları/i })).toBeInTheDocument();

    rerender(<PricingPage />);

    expect(screen.getByRole("heading", { name: /fiyatlandırma/i })).toBeInTheDocument();
    expect(screen.getByText(/^Starter$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Growth$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Enterprise$/i)).toBeInTheDocument();
  });

  it("demo talebi formu submit sonrasi basari mesaji gosterir", async () => {
    const user = userEvent.setup();
    render(<DemoRequestPage />);

    await user.type(screen.getByPlaceholderText(/ad soyad/i), "Ayse Yilmaz");
    await user.type(screen.getByPlaceholderText("İş e-postası"), "ayse@test.com");
    await user.type(screen.getByPlaceholderText(/firma/i), "Ornek A.S.");
    await user.type(screen.getByPlaceholderText(/notunuz/i), "Canlı demo görmek istiyoruz.");
    await user.click(screen.getByRole("button", { name: /talep gönder/i }));

    expect(await screen.findByText(/talebiniz alındı/i)).toBeInTheDocument();
  });
});