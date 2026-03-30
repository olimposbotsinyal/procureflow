// FILE: web/src/test/forbidden-page.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import ForbiddenPage from "../pages/ForbiddenPage"

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe("ForbiddenPage", () => {
  it("sayfayı render eder", () => {
    render(
      <MemoryRouter>
        <ForbiddenPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/yetkiniz yok|forbidden|403/i)).toBeInTheDocument()
  })

  it("geri dön aksiyonu navigate çağırır", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ForbiddenPage />
      </MemoryRouter>,
    )

    const btn = screen.getByRole("button")
    await user.click(btn)

    expect(mockNavigate).toHaveBeenCalled()
  })
})
