// FILE: web/src/test/token.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { getAccessToken, setAccessToken, clearAccessToken } from "../lib/token";

describe("token lib", () => {
  beforeEach(() => localStorage.clear());

  it("set/get access token çalışır", () => {
    setAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
  });

  it("clear access token temizler", () => {
    setAccessToken("abc");
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});
