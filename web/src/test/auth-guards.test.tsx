// FILE: web/src/test/auth-guards.test.tsx
import { describe, it, expect } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import ProtectedRoute from "../components/ProtectedRoute";
import RequirePermission from "../components/RequirePermission";
import { AuthContext } from "../context/auth-context";
import type { AuthContextType, AuthUser } from "../context/auth-types";

function renderWithAuth(
  ui: ReactNode,
  {
    route = "/dashboard",
    user = null,
    loading = false,
  }: {
    route?: string;
    user?: AuthUser | null;
    loading?: boolean;
  } = {}
) {
  const value: AuthContextType = {
    user,
    loading,
    login: async () => {},
    logout: async () => {},
  };

  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("Route Guards", () => {
  it("anon kullanıcıyı /login'e yönlendirir (ProtectedRoute)", async () => {
    renderWithAuth(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { route: "/dashboard", user: null, loading: false }
    );

    expect(await screen.findByText("Login Page")).toBeInTheDocument();
  });

  it("login kullanıcı dashboard'a erişir", async () => {
    renderWithAuth(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
      </Routes>,
      {
        route: "/dashboard",
        user: { id: 1, email: "u@test.com", role: "user" },
        loading: false,
      }
    );

    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  it("yetkisiz kullanıcıyı /403'e yönlendirir (RequirePermission)", async () => {
    renderWithAuth(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<RequirePermission permission="view:admin" />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Route>
        <Route path="/403" element={<div>Forbidden</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      {
        route: "/admin",
        user: { id: 2, email: "buyer@test.com", role: "buyer" },
        loading: false,
      }
    );

    expect(await screen.findByText("Forbidden")).toBeInTheDocument();
  });

  it("admin kullanıcı /admin'e erişir", async () => {
    renderWithAuth(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<RequirePermission permission="view:admin" />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Route>
      </Routes>,
      {
        route: "/admin",
        user: { id: 3, email: "admin@test.com", role: "admin" },
        loading: false,
      }
    );

    expect(await screen.findByText("Admin Page")).toBeInTheDocument();
  });

  it("loading durumunda bekleme metni gösterir", () => {
    renderWithAuth(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
      </Routes>,
      {
        route: "/dashboard",
        user: null,
        loading: true,
      }
    );

    expect(screen.getByText("Yükleniyor...")).toBeInTheDocument();
  });
});
