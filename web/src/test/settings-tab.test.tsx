import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { AuthContext } from "../context/auth-context";
import { SettingsContext } from "../context/SettingsContext";
import type { AuthContextType } from "../context/auth-context";
import type { SettingsContextType } from "../context/settings-types";
import { SettingsTab } from "../components/SettingsTab";

vi.mock("../components/AdvancedSettingsTab", () => ({
  AdvancedSettingsTab: () => <div>Advanced Settings Mock</div>,
}));

vi.mock("../components/DemoDataTab", () => ({
  DemoDataTab: () => <div>Demo Data Mock</div>,
}));

vi.mock("../services/admin.service", () => ({
  getQuotePriceRules: vi.fn(),
  updateQuotePriceRules: vi.fn(),
}));

function renderSettingsTab(user: AuthContextType["user"]) {
  const authValue: AuthContextType = {
    user,
    loading: false,
    login: async () => {},
    logout: () => {},
  };

  const settingsValue: SettingsContextType = {
    settings: {
      id: 1,
      app_name: "ProcureFlow",
      maintenance_mode: false,
      vat_rates: [1, 10, 20],
      updated_by_id: 1,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    loading: false,
    error: null,
    updateSettings: async () => {},
    refreshSettings: async () => {},
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <SettingsContext.Provider value={settingsValue}>
        <SettingsTab />
      </SettingsContext.Provider>
    </AuthContext.Provider>
  );
}

describe("SettingsTab tenant identity permissions", () => {
  it("super admin icin temel ayarlari düzenlenebilir gosterir", () => {
    renderSettingsTab({
      id: 9,
      email: "super-admin@test.com",
      role: "super_admin",
      business_role: "super_admin",
      system_role: "super_admin",
    });

    expect(
      screen.queryByText(/tenant kimliği ve temel ayarlar salt okunur gösterilir/i)
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/uygulama adı/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/maintenance modu/i)).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /değişiklikleri kaydet/i })).not.toBeDisabled();
  });

  it("tenant admin icin temel ayarlari salt okunur gosterir", () => {
    renderSettingsTab({
      id: 10,
      email: "tenant-admin@test.com",
      role: "admin",
      business_role: "admin",
      system_role: "tenant_admin",
    });

    expect(
      screen.getByText(/tenant kimliği ve temel ayarlar salt okunur gösterilir/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/uygulama adı/i)).toBeDisabled();
    expect(screen.getByLabelText(/maintenance modu/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /değişiklikleri kaydet/i })).toBeDisabled();
  });

  it("tenant owner icin temel ayarlari düzenlenebilir gosterir", () => {
    renderSettingsTab({
      id: 11,
      email: "tenant-owner@test.com",
      role: "admin",
      business_role: "admin",
      system_role: "tenant_owner",
    });

    expect(
      screen.queryByText(/tenant kimliği ve temel ayarlar salt okunur gösterilir/i)
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/uygulama adı/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/maintenance modu/i)).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /değişiklikleri kaydet/i })).not.toBeDisabled();
  });

  it("platform support icin temel ayarlari salt okunur gosterir", () => {
    renderSettingsTab({
      id: 12,
      email: "platform-support@test.com",
      role: "user",
      business_role: "user",
      system_role: "platform_support",
    });

    expect(
      screen.getByText(/tenant kimliği ve temel ayarlar salt okunur gösterilir/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/uygulama adı/i)).toBeDisabled();
    expect(screen.getByLabelText(/maintenance modu/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /değişiklikleri kaydet/i })).toBeDisabled();
  });
});
