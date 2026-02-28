import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { userData, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!userData) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
