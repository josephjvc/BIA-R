import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "../shared/store/auth.store";
import { Login } from "./components/Login";
import Workspace from "./Workspace";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
