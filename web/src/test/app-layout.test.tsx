import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import AppLayout from "../components/AppLayout"

const mockLogout = vi.fn()
const mockNavigate = vi.fn()

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: { email: "admin@pf.com", role: "admin" },
    logout: mockLogout,
  }),
}))

vi.mock("../lib/notify", () => ({
  notify: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe("AppLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("Outlet içeriğini render eder", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<div>İçerik</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText("İçerik")).toBeInTheDocument()
    expect(screen.getByText(/ProcureFlow/i)).toBeInTheDocument()
  })

  it("Çıkış Yap tıklanınca logout + navigate çalışır", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole("button", { name: /admin@pf.com/i }))
    await user.click(screen.getByRole("button", { name: /çıkış yap/i }))

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true })
  })
})
