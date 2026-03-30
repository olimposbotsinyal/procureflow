import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider"; // sende dosya adı buysa
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";

import * as tokenLib from "../lib/token";
import { http } from "../lib/http";

vi.mock("../lib/http", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

function AppShell() {
  const { user, logout } = useAuth();
  return (
    <div>
      <span data-testid="email">{user?.email ?? "anon"}</span>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe("auth session flows", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test("hard refresh: token varsa /auth/me ile user restore edilir", async () => {
    vi.spyOn(tokenLib, "getAccessToken").mockReturnValue("token");
    vi.mocked(http.get).mockResolvedValueOnce({
      data: { id: 1, email: "admin@procureflow.dev", role: "admin" },
    } as never);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<AppShell />} />
            </Route>
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("email").textContent).toBe("admin@procureflow.dev")
    );
  });

  test("logout: token + user temizlenir", async () => {
    vi.spyOn(tokenLib, "getAccessToken").mockReturnValue("token");
    const clearSpy = vi.spyOn(tokenLib, "clearAccessToken").mockImplementation(() => {});

    vi.mocked(http.get).mockResolvedValueOnce({
      data: { id: 1, email: "admin@procureflow.dev", role: "admin" },
    } as never);
    vi.mocked(http.post).mockResolvedValueOnce({ data: {} } as never);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<AppShell />} />
            </Route>
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await screen.findByText("logout");
    await userEvent.click(screen.getByText("logout"));

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("pf_user")).toBeNull();
  });

  test("expired token: /auth/me 401 olursa login'e düşer", async () => {
    vi.spyOn(tokenLib, "getAccessToken").mockReturnValue("expired");
    vi.spyOn(tokenLib, "clearAccessToken").mockImplementation(() => {});

    vi.mocked(http.get).mockRejectedValueOnce({
      response: { status: 401 },
    } as never);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Route>
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("Login")).toBeInTheDocument());
  });
});
