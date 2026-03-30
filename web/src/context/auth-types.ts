// FILE: web\src\context\auth-types.ts
import type { Role } from "../auth/permissions";

export type AuthUser = {
  id: number;
  email: string;
  role: Role;
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
