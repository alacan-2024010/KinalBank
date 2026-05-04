// front/src/app/router/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../layouts/DashboardPage.jsx";
import { AccountsPage } from "../../features/admin-general/pages/AccountsPage.jsx";
import { ClientDashboardPage } from "../../features/client/pages/ClientDashboardPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { RoleRedirect } from "./RoleRedirect.jsx";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Login / Registro */}
      <Route path="/" element={<AuthPage />} />

      {/* Dashboard compartido con layout */}
      <Route path="/dashboard" element={<DashboardPage />}>

        {/* Redirige /dashboard → al dashboard correcto según rol */}
        <Route index element={<RoleRedirect />} />

        {/* ── ADMIN ── */}
        <Route
          path="accounts"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AccountsPage />
            </ProtectedRoute>
          }
        />

        {/* ── CLIENT ── */}
        <Route
          path="client"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <ClientDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<RoleRedirect />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
