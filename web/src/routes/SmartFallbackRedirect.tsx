// FILE: web/src/routes/SmartFallbackRedirect.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SmartFallbackRedirect() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // Login değilse login'e gönder
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Login ise role göre yönlendir
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
