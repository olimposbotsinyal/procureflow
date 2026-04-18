// FILE: web\src\config\navigation.ts
import { hasAdminWorkspaceHome, type Permission } from "../auth/permissions";
import type { AuthUser } from "../context/auth-types";

export type NavItem = {
  label: string;
  to: string;
  permission: Permission;
  visibleFor?: (user: AuthUser) => boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", permission: "view:dashboard" },
  { label: "Teklifler", to: "/quotes", permission: "view:dashboard" },
  {
    label: "Admin",
    to: "/admin",
    permission: "view:admin",
    visibleFor: (user) => hasAdminWorkspaceHome(user),
  },
  { 
    label: "AI Keşif Lab", // Menüde görünecek isim
    to: "/discovery-lab", 
    permission: "view:admin" // Sadece admin yetkisi olanlar (Mimarlar dahil) görsün
  },
  { label: "Raporlar", to: "/reports", permission: "view:reports" },
];

export function getVisibleNavItems(user: AuthUser): NavItem[] {
  return NAV_ITEMS.filter((item) => (item.visibleFor ? item.visibleFor(user) : true));
}