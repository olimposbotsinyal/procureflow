// FILE: web/src/test/use-auth.test.tsx
import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { useAuth } from "../hooks/useAuth"

describe("useAuth", () => {
  it("AuthProvider dışında çağrılırsa hata fırlatır", () => {
    expect(() => renderHook(() => useAuth())).toThrow()
  })
})
