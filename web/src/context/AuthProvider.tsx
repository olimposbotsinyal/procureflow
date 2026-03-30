import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./auth-context";
import type { AuthUser } from "./auth-types";
import { clearAccessToken, getAccessToken, setAccessToken } from "../lib/token";
import { loginRequest, logoutRequest, meRequest } from "../services/auth.service";

type Props = { children: ReactNode };

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const token = getAccessToken();

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const me = await meRequest();
        setUser(me);
        localStorage.setItem("pf_user", JSON.stringify(me));
      } catch {
        clearAccessToken();
        localStorage.removeItem("pf_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const login = useCallback<AuthContextType["login"]>(async (email, password) => {
    const data = await loginRequest(email, password);

    setAccessToken(data.accessToken);

    const me = await meRequest();
    setUser(me);
    localStorage.setItem("pf_user", JSON.stringify(me));
  }, []);

  const logout = useCallback<AuthContextType["logout"]>(() => {
    logoutRequest(); // fire-and-forget
    clearAccessToken();
    localStorage.removeItem("pf_user");
    setUser(null);
    window.location.assign("/login");
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
