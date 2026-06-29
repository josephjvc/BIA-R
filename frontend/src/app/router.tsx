import { Routes, Route, Navigate, Outlet } from "react-router";
import { useAuthStore } from "../shared/store/auth.store";
import { Login } from "./components/Login";
import WorkspaceLayout from "./Workspace";
import { InstancesPage } from "./components/InstancesPage";
import { SettingsPage } from "./components/SettingsPage";
import { Dashboard } from "./components/Dashboard";
import { OrgContext } from "./components/OrgContext";
import { BIA } from "./components/BIA";
import { Risks } from "./components/Risks";
import { Integrated } from "./components/Integrated";
import { Reports } from "./components/Reports";

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/instances" replace />} />
        <Route path="/instances" element={<InstancesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/instances/:instanceId" element={<WorkspaceLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="context" element={<OrgContext />} />
          <Route path="bia" element={<BIA />} />
          <Route path="risks" element={<Risks />} />
          <Route path="integrated" element={<Integrated />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/instances" replace />} />
    </Routes>
  );
}
