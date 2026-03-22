// src/components/common/Header/TopNavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const TopNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Replace your existing handleLogout in AdminLayout.jsx with this:
  const handleLogout = async () => {
    await logout().finally(() => {
      // replace: true wipes the forward history so they can't click the browser "Back" button to return!
      navigate("/login", { replace: true });
    });
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <div className="user-menu">
        {user ? (
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">Welcome, {user.name}</span>
            {user.role === "admin" || user.role === "superadmin" ? (
              <Link
                to="/fintech-admin"
                className="btn btn-sm btn-primary fw-bold"
              >
                Admin Panel
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-sm btn-outline-primary">
                My Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="btn btn-sm btn-danger">
              Logout
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-sm btn-outline-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavBar;
