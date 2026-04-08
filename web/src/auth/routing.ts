import type { Role } from "./permissions";
import { hasPermission } from "./permissions";
import { NAV_ITEMS } from "../config/navigation";

export function getDefaultRouteForRole(role: Role): string {
  const firstAllowed = NAV_ITEMS.find((item) => hasPermission(role, item.permission));
  return firstAllowed?.to ?? "/dashboard";
}