// FILE: web/src/test/login-page.test.tsx
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { AuthContext } from "../context/auth-context";
import type { AuthContextType } from "../context/auth-context";

function renderWithAuth(
  ctx: AuthContextType,
  initialEntries: Array<string | { pathname: string; state?: unknown }> = ["/login"]
) {
  return render(
    <AuthContext.Provider value={ctx}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/reports" element={<div>Reports</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("başarılı login sonrası dashboard'a gider", async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue(undefined);

    renderWithAuth({ user: null, loading: false, login, logout: vi.fn() });

    await user.type(screen.getByLabelText(/e-posta/i), "admin@example.com");
    await user.type(screen.getByLabelText(/sifre/i), "123456");
    await user.click(screen.getByRole("button", { name: /giris yap/i }));

    expect(login).toHaveBeenCalledWith("admin@example.com", "123456");
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  test("location.state.from varsa oraya gider", async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue(undefined);

    renderWithAuth(
      { user: null, loading: false, login, logout: vi.fn() },
      [{ pathname: "/login", state: { from: { pathname: "/reports" } } }]
    );

    await user.type(screen.getByLabelText(/e-posta/i), "user@example.com");
    await user.type(screen.getByLabelText(/sifre/i), "123456");
    await user.click(screen.getByRole("button", { name: /giris yap/i }));

    expect(await screen.findByText("Reports")).toBeInTheDocument();
  });
});
