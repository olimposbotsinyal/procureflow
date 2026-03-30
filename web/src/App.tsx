// FILE: web/src/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RequirePermission from "./components/RequirePermission";
import AppLayout from "./components/AppLayout";
import SmartFallbackRedirect from "./routes/SmartFallbackRedirect";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import ReportsPage from "./pages/ReportsPage";
import ForbiddenPage from "./pages/ForbiddenPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          <Route element={<RequirePermission permission="view:admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route element={<RequirePermission permission="view:reports" />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<SmartFallbackRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
