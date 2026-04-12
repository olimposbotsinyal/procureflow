// FILE: web/src/test/auth-service.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { AxiosError } from "axios"

import { http } from "../lib/http"
import { loginRequest, logoutRequest, meRequest } from "../services/auth.service"

vi.mock("../lib/http", () => ({
  http: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

const mockedPost = vi.mocked(http.post)
const mockedGet = vi.mocked(http.get)

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("login başarı: /auth/login çağrılır ve access_token accessToken'a maplenir", async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        access_token: "acc-123",
        refresh_token: "ref-123",
        token_type: "bearer",
        user: { id: 1, email: "test@x.com", role: "admin" },
      },
    })

    const result = await loginRequest("test@x.com", "123456")

    expect(http.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@x.com",
      password: "123456",
    })
    expect(result).toEqual({
      accessToken: "acc-123",
      refreshToken: "ref-123",
      user: { id: 1, email: "test@x.com", role: "admin" },
    })
  })

  it("login: access_token yoksa anlamlı hata fırlatır", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { token_type: "bearer" },
    })

    await expect(loginRequest("test@x.com", "123456")).rejects.toThrow(
      "Giriş sırasında bir sorun oluştu.",
    )
  })

  it("login 401: 'E-posta veya şifre hatalı.' hatasına maplenir", async () => {
  mockedPost.mockRejectedValueOnce({
    isAxiosError: true,
    response: { status: 401 },
  } as unknown as AxiosError)

  await expect(loginRequest("wrong@x.com", "bad")).rejects.toThrow(
    "E-posta veya şifre hatalı.",
  )
})


  it("meRequest: /auth/me çağırır ve kullanıcıyı döner", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { id: 7, email: "me@x.com", role: "buyer" },
    })

    const me = await meRequest()

    expect(http.get).toHaveBeenCalledWith("/auth/me")
    expect(me.email).toBe("me@x.com")
  })

  it("logoutRequest: /auth/logout çağırır (hata olsa bile throw etmez)", async () => {
    sessionStorage.setItem("refresh_token", "refresh-xyz")
    mockedPost.mockRejectedValueOnce(new Error("network"))

    await expect(logoutRequest()).resolves.toBeUndefined()
    expect(http.post).toHaveBeenCalledWith("/auth/logout", {
      refresh_token: "refresh-xyz",
    })
  })
})
