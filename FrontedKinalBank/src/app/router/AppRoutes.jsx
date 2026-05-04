import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { AdminGeneralLayout } from "../../features/admin-general/layout/AdminGeneralLayout.jsx";
import { AccountsPage } from "../../features/admin-general/pages/AccountsPage.jsx";
import { UsersPage } from "../../features/admin-general/pages/UserPage.jsx";
import { ClientDashboardPage } from "../../features/client/pages/ClientDashboardPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { RoleRedirect } from "./RoleRedirect.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Login */}
            <Route path="/" element={<AuthPage />} />

            {/* ── ADMIN ── */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminGeneralLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<RoleRedirect />} />
                <Route path="users"    element={<UsersPage />} />
                <Route path="accounts" element={<AccountsPage />} />
            </Route>

            {/* ── CLIENT ── */}
            <Route
                path="/dashboard/client"
                element={
                    <ProtectedRoute allowedRoles={["CLIENT"]}>
                        <ClientDashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};