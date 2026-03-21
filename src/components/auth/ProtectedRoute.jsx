// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Wait for Context to figure out if someone is logged in
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        Loading...
      </div>
    );
  }

  // 2. Not logged in at all? Kick to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in, but wrong role? Bounce them to their proper home.
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin" || user.role === "superadmin") {
      return <Navigate to="/fintech-admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Passed all checks? Let them through to the layout!
  return <Outlet />;
};

export default ProtectedRoute;
