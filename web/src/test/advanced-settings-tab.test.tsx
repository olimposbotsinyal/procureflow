import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { AdvancedSettingsTab } from "../components/AdvancedSettingsTab";
import { AuthContext } from "../context/auth-context";
import type { AuthContextType } from "../context/auth-context";

vi.mock("../services/advanced-settings.service", () => ({
  getEmailSettings: vi.fn().mockResolvedValue({ from_email: "noreply@test.com", smtp_host: "smtp.test.com", smtp_port: 587 }),
  getEmailProfiles: vi.fn().mockResolvedValue([
    { owner_user_id: null, label: "Varsayılan Sistem SMTP", kind: "default", from_email: "noreply@test.com" },
    { owner_user_id: 12, label: "Firma SMTP: Admin User", kind: "personal", from_email: "admin@test.com" },
  ]),
  updateEmailSettings: vi.fn(),
  testEmailSettings: vi.fn(),
  getLoggingSettings: vi.fn().mockResolvedValue({}),
  updateLoggingSettings: vi.fn(),
  getBackupSettings: vi.fn().mockResolvedValue({}),
  updateBackupSettings: vi.fn(),
  triggerBackupManually: vi.fn(),
  getNotificationSettings: vi.fn().mockResolvedValue({}),
  updateNotificationSettings: vi.fn(),
  getAPIKeys: vi.fn().mockResolvedValue([]),
  createAPIKey: vi.fn(),
  revokeAPIKey: vi.fn(),
  uploadEmailSignatureImage: vi.fn(),
}));

vi.mock("../services/system-email.service", () => ({
  getSystemEmails: vi.fn().mockResolvedValue([]),
  createSystemEmail: vi.fn(),
  updateSystemEmail: vi.fn(),
  deleteSystemEmail: vi.fn(),
}));

function renderTab(user: AuthContextType["user"]) {
  const authValue: AuthContextType = {
    user,
    loading: false,
    login: async () => {},
    logout: () => {},
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <AdvancedSettingsTab />
    </AuthContext.Provider>
  );
}

describe("AdvancedSettingsTab email profile permissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("platform support icin sadece kendi SMTP profilini gosterir", async () => {
    renderTab({
      id: 5,
      email: "support@test.com",
      role: "user",
      system_role: "platform_support",
    });

    expect(await screen.findByText(/kullanılan profil/i)).toBeInTheDocument();
    expect(screen.getByText(/platform personeli bu ayarlari goruntuleyebilir/i)).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByText(/kendi SMTP profiliniz/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^kaydet$/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /test gönder/i })).toBeDisabled();
  });

  it("super admin icin profil secimini gosterir", async () => {
    renderTab({
      id: 1,
      email: "super@test.com",
      role: "super_admin",
      system_role: "super_admin",
    });

    expect(await screen.findByText(/profil seçimi/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());
    expect(screen.getByText(/varsayılan sistem SMTP profilini ve admin profillerini ayrı ayrı düzenleyebilir/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^kaydet$/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /test gönder/i })).toBeEnabled();
  });
});
