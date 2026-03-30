// FILE: web\src\auth\permissions.ts
export type Role = "admin" | "user" | "manager" | "buyer";

export type Permission =
  | "view:dashboard"
  | "view:admin"
  | "view:reports"
  | "manage:users";

const rolePermissions: Record<Role, Permission[]> = {
  admin: ["view:dashboard", "view:admin", "view:reports", "manage:users"],
  manager: ["view:dashboard", "view:reports"],
  buyer: ["view:dashboard"],
  user: ["view:dashboard"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}
