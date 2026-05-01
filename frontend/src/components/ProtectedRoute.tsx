import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/auth";

export function ProtectedRoute() {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <Outlet />;
}

