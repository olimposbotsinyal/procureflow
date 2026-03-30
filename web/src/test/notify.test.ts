// FILE: web/src/test/notify.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest"
import { notify } from "../lib/notify"
import toast from "react-hot-toast"

vi.mock("react-hot-toast", () => ({
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

describe("notify", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("success: toast.success çağırır", () => {
    notify.success("Kaydedildi")
    expect(toast.success).toHaveBeenCalledWith("Kaydedildi")
  })

  it("error: toast.error çağırır", () => {
    notify.error("Hata oluştu")
    expect(toast.error).toHaveBeenCalledWith("Hata oluştu")
  })

  it("info: toast(message) çağırır", () => {
    notify.info("Bilgi mesajı")
    expect(toast).toHaveBeenCalledWith("Bilgi mesajı")
  })
})
