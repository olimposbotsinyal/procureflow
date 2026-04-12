// FILE: web/src/routes/SmartFallbackRedirect.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteForRole } from "../auth/routing";
import { isSupplierLoggedIn } from "../lib/session";

export default function SmartFallbackRedirect() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (isSupplierLoggedIn()) {
    return <Navigate to="/supplier/dashboard" replace />;
  }

  // Login değilse login'e gönder
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const nextPath = getDefaultRouteForRole(user.role);
  return <Navigate to={nextPath} replace />;
}
