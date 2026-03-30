// FILE: web/src/test/auth-routing.test.tsx
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthContext, type AuthContextType } from "../context/auth-context";

type Role = "admin" | "user" | "manager" | "buyer";

function renderWithAuth(initialPath: string, role: Role | null) {
  const value: AuthContextType = {
    user: role ? { id: 1, email: `${role}@example.com`, role } : null,
    loading: false,
    login: async () => {},
    logout: () => {},
  };

  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("Auth + Permission routing", () => {
  test("user /admin -> 403", async () => {
    renderWithAuth("/admin", "user");
    expect(await screen.findByRole("heading", { name: /403 - Yetkisiz Erişim/i })).toBeInTheDocument();
  });

  test("admin /admin -> admin panel", async () => {
    renderWithAuth("/admin", "admin");
    expect(await screen.findByRole("heading", { name: /Admin Panel/i })).toBeInTheDocument();
  });

  test("user menüde Admin linki görmez", async () => {
    renderWithAuth("/dashboard", "user");

    // Sayfanın yüklendiğini benzersiz bir metinle doğrula
    expect(await screen.findByText(/Kullanıcı Paneli:/i)).toBeInTheDocument();

    // Navbar'daki tam adı "Admin" olan link olmamalı
    expect(
      screen.queryByRole("link", { name: /^Admin$/i })
    ).not.toBeInTheDocument();
  });

  test("admin menüde Admin linki görür", async () => {
    renderWithAuth("/dashboard", "admin");

    // Sayfanın yüklendiğini doğrula
    expect(await screen.findByText(/Admin Panel:/i)).toBeInTheDocument();

    // Navbar'daki tam adı "Admin" olan link olmalı
    expect(
      screen.getByRole("link", { name: /^Admin$/i })
    ).toBeInTheDocument();
  });
});
