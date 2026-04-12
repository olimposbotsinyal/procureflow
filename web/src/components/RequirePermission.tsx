import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hasPermission, type Permission } from "../auth/permissions";
import { getDefaultRouteForRole } from "../auth/routing";

type Props = {
  permission: Permission;
  redirectTo?: string;
};

export default function RequirePermission({
  permission,
  redirectTo = "/403",
}: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: 24 }}>Yetki kontrol ediliyor...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const ok = hasPermission(user.role, permission);
  if (!ok) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          deniedFrom: location.pathname,
          fallbackTo: getDefaultRouteForRole(user.role),
        }}
      />
    );
  }

  return <Outlet />;
}
