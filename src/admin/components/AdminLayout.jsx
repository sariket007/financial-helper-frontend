import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    // Security check: If not logged in, or NOT an admin/superadmin, kick them out
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "superadmin")
    ) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  // Helper function to highlight the active menu item
  const isActive = (path) =>
    location.pathname.includes(path) ? "bg-primary text-white" : "text-light";

  if (!user) return null; // Prevent UI flash before redirect

  return (
    <div className="d-flex vh-100 bg-light">
      {/* === LEFT SIDEBAR === */}
      <div
        className="bg-dark text-white d-flex flex-column"
        style={{ width: "250px", transition: "all 0.3s" }}
      >
        <div className="p-3 border-bottom border-secondary text-center">
          <h4 className="fw-bold m-0 text-white">Fintech Admin</h4>
          <small className="text-muted">Superadmin Portal</small>
        </div>

        <ul className="nav nav-pills flex-column mb-auto p-3 gap-2">
          <li className="nav-item">
            <Link
              to="/fintech-admin"
              className={`nav-link ${location.pathname === "/fintech-admin" ? "bg-primary text-white" : "text-light"}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/fintech-admin/pages"
              className={`nav-link ${isActive("/fintech-admin/pages")}`}
            >
              Pages
            </Link>
          </li>
          {/* Add this near your Dashboard link */}
          <li className="nav-item">
            <Link
              to="/fintech-admin/policies"
              className={`nav-link ${location.pathname === "/fintech-admin/policies" ? "bg-primary text-white" : "text-light"}`}
            >
              Policy Management
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/fintech-admin/users"
              className={`nav-link ${isActive("/fintech-admin/users")}`}
            >
              Users
            </Link>
          </li>
        </ul>

        <div className="p-3 border-top border-secondary text-center">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 fw-bold"
          >
            Logout Admin
          </button>
        </div>
      </div>

      {/* === RIGHT MAIN CONTENT AREA === */}
      <div className="flex-grow-1 overflow-auto">
        {/* The Top Navbar for the Admin Area */}
        <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3 mb-4">
          <div className="container-fluid justify-content-end">
            <span className="fw-bold text-dark">
              Welcome, {user.name} ({user.role})
            </span>
          </div>
        </nav>

        {/* This <Outlet /> is the magic window where the child pages render */}
        <div className="container-fluid px-4 pb-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
