// FILE: web\src\config\navigation.ts
import type { Permission } from "../auth/permissions";

export type NavItem = {
  label: string;
  to: string;
  permission: Permission;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", permission: "view:dashboard" },
  { label: "Teklifler", to: "/quotes", permission: "view:dashboard" },
  { label: "Admin", to: "/admin", permission: "view:admin" },
  { label: "Raporlar", to: "/reports", permission: "view:reports" },
];
