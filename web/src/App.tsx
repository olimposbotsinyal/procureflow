// FILE: web/src/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute, { SupplierRoute } from "./components/ProtectedRoute";
import RequirePermission from "./components/RequirePermission";
import AppLayout from "./components/AppLayout";
import SmartFallbackRedirect from "./routes/SmartFallbackRedirect";

import LoginPage from "./pages/LoginPage";
import InternalUserActivationPage from "./pages/InternalUserActivationPage";
import SupplierLoginPage from "./pages/SupplierLoginPage";
import SupplierRegisterPage from "./pages/SupplierRegisterPage";
import SupplierDashboard from "./pages/SupplierDashboard";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import ReportsPage from "./pages/ReportsPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import SupplierProfilePage from "./pages/SupplierProfilePage";
import SupplierFinancePage from "./pages/SupplierFinancePage";
import SupplierWorkspacePage from "./pages/SupplierWorkspacePage";
import SupplierEmailChangeConfirmPage from "./pages/SupplierEmailChangeConfirmPage";
import AdminSupplierDetailPage from "./pages/AdminSupplierDetailPage";
import AdminSupplierFinancePage from "./pages/AdminSupplierFinancePage";
import AdminSupplierWorkspacePage from "./pages/AdminSupplierWorkspacePage";
import AdminQuoteManagementPage from "./pages/AdminQuoteManagementPage";
import PersonnelDetailPage from "./pages/PersonnelDetailPage";
import DepartmentDetailPage from "./pages/DepartmentDetailPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectFilesPage from "./pages/ProjectFilesPage";
import QuoteListPage from "./pages/QuoteListPage";
import QuoteCreatePage from "./pages/QuoteCreatePage";
import QuoteDetailPage from "./pages/QuoteDetailPage";
import QuoteComparisonReportPage from "./pages/QuoteComparisonReportPage";
import DiscoveryLab from './pages/DiscoveryLab';
import OnboardingPage from './pages/OnboardingPage';
import PublicHomePage from "./pages/PublicHomePage";
import SolutionsPage from "./pages/SolutionsPage";
import PricingPlansPage from "./pages/PricingPlansPage";
import DemoRequestPage from "./pages/DemoRequestPage";
import StrategicPartnerProgramPage from "./pages/StrategicPartnerProgramPage";
import SupplierProgramPage from "./pages/SupplierProgramPage";
import ChannelPartnerProgramPage from "./pages/ChannelPartnerProgramPage";
import ChannelPartnerRegisterPage from "./pages/ChannelPartnerRegisterPage";
import PublicPricingAdminPage from "./pages/PublicPricingAdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/cozumler" element={<SolutionsPage />} />
      <Route path="/fiyatlandirma" element={<PricingPlansPage />} />
      <Route path="/demo" element={<DemoRequestPage />} />
      <Route path="/stratejik-ortaklik" element={<StrategicPartnerProgramPage />} />
      <Route path="/tedarikci-ol" element={<SupplierProgramPage />} />
      <Route path="/is-ortagi-programi" element={<ChannelPartnerProgramPage />} />
      <Route path="/is-ortagi-basvuru" element={<ChannelPartnerRegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/activate-account" element={<InternalUserActivationPage />} />
      <Route path="/supplier/login" element={<SupplierLoginPage />} />
      <Route path="/supplier/register" element={<SupplierRegisterPage />} />
      <Route path="/supplier/email-change-confirm" element={<SupplierEmailChangeConfirmPage />} />

      <Route element={<SupplierRoute />}>
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/profile" element={<SupplierProfilePage />} />
        <Route path="/supplier/finance" element={<SupplierFinancePage />} />
        <Route path="/supplier/workspace" element={<SupplierWorkspacePage />} />
        <Route path="/supplier/portal" element={<Navigate to="/supplier/workspace?tab=offers" replace />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quotes" element={<QuoteListPage />} />
          <Route path="/quotes/create" element={<QuoteCreatePage />} />
          <Route path="/quotes/:id" element={<QuoteDetailPage />} />
          <Route path="/quotes/:id/comparison" element={<QuoteComparisonReportPage />} />
          <Route path="/quotes/:id/edit" element={<QuoteDetailPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          <Route element={<RequirePermission permission="view:admin" />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/quotes" element={<AdminQuoteManagementPage />} />
            <Route path="/admin/personnel/:id" element={<PersonnelDetailPage />} />
            <Route path="/admin/departments/:id" element={<DepartmentDetailPage />} />
            <Route path="/admin/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/admin/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/admin/project-files/:projectId" element={<ProjectFilesPage />} />
            <Route path="/admin/suppliers/:id" element={<AdminSupplierDetailPage />} />
            <Route path="/admin/suppliers/:id/finance" element={<AdminSupplierFinancePage />} />
            <Route path="/admin/suppliers/:id/workspace" element={<AdminSupplierWorkspacePage />} />
            <Route path="/discovery-lab" element={<DiscoveryLab />} />
            <Route path="/admin/public-pricing" element={<PublicPricingAdminPage />} />
          </Route>

          <Route element={<RequirePermission permission="view:reports" />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/app" element={<SmartFallbackRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
