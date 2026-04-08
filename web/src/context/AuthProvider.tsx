import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./auth-context";
import type { AuthUser } from "./auth-types";
import {
  clearAccessToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../lib/token";
import { getSupplierAccessToken } from "../lib/session";
import { loginRequest, logoutRequest, meRequest, refreshRequest } from "../services/auth.service";

type Props = { children: ReactNode };

const USER_KEY = "pf_user";
const SUPPLIER_TOKEN_KEY = "supplier_access_token";

function readStoredUser(): AuthUser | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function shouldSkipAdminAuth(pathname: string): boolean {
  const isSupplierPage = pathname.includes("/supplier/");
  if (isSupplierPage) return true;

  if (pathname.includes("/supplier/register") || pathname.includes("/supplier/login")) {
    return true;
  }

  const supplierToken = getSupplierAccessToken();
  return Boolean(supplierToken);
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const currentPath = window.location.pathname;
        if (shouldSkipAdminAuth(currentPath)) {
          if (!isMounted) return;
          setUser(null);
          return;
        }

        const token = getAccessToken();
        if (!token) {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            if (!isMounted) return;
            setUser(null);
            return;
          }

          // Access token yoksa sessizce refresh dene.
          const refreshed = await refreshRequest(refreshToken);
          setAccessToken(refreshed.accessToken);
          setRefreshToken(refreshed.refreshToken);
        }

        // Hızlı UI için önce local cache'i yükle, sonra /me ile doğrula.
        const cachedUser = readStoredUser();
        if (cachedUser && isMounted) {
          setUser(cachedUser);
        }

        const me = await meRequest();
        if (!isMounted) return;

        setUser(me);
        sessionStorage.setItem(USER_KEY, JSON.stringify(me));
      } catch {
        if (!isMounted) return;

        clearAccessToken();
        sessionStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback<AuthContextType["login"]>(async (email, password) => {
    try {
      // Eski supplier tokeni sil - supplier session'dan geçişte pf_access_token'ı kullan
      sessionStorage.removeItem(SUPPLIER_TOKEN_KEY);
      localStorage.removeItem(SUPPLIER_TOKEN_KEY);

      const data = await loginRequest(email, password);

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      const me = await meRequest();
      setUser(me);
      sessionStorage.setItem(USER_KEY, JSON.stringify(me));
    } catch (err) {
      console.error("[AuthProvider] Login hatası:", err);
      throw err;
    }
  }, []);

  const logout = useCallback<AuthContextType["logout"]>(() => {
    logoutRequest(); // fire-and-forget
    clearAccessToken();
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    window.location.assign("/login");
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
