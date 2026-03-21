import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Pull directly from Context

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Replace your existing handleLogout in AdminLayout.jsx with this:
  const handleLogout = async () => {
    await logout().finally(() => {
      // replace: true wipes the forward history so they can't click the browser "Back" button to return!
      navigate("/login", { replace: true });
    });
  };
  const isActive = (path) =>
    location.pathname.includes(path) ? "bg-primary text-white" : "text-light";

  // Safe fallback just in case, but ProtectedRoute should handle this
  if (!user) return null;

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
          <li className="nav-item">
            <Link
              to="/fintech-admin/policies"
              className={`nav-link ${isActive("/fintech-admin/policies")}`}
            >
              Policy Management
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
      <div className="flex-grow-1 overflow-auto d-flex flex-column">
        {/* The Top Navbar for the Admin Area */}
        <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3 mb-4">
          <div className="container-fluid justify-content-end">
            <span className="fw-bold text-dark">
              Welcome, {user.name} ({user.role})
            </span>
          </div>
        </nav>

        {/* This <Outlet /> is the magic window where the child pages render */}
        <div className="container-fluid px-4 pb-5 flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
