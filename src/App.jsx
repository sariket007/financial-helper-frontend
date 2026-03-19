import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"; // Customer Dashboard
import authService from "./services/authService";
import Home from "./pages/Home";
import Policy from "./components/Policy";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminPolicies from "./admin/pages/AdminPolicies";
import AdminPages from "./admin/pages/AdminPages"; // NEW: Admin page management
import SinglePage from "./pages/SinglePage"; // Or wherever you saved it

// triggering vercel staging deployment
// ... inside your <Routes> block:
<Route path="/p/:slug" element={<SinglePage />} />;
const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <header>
      {/* === TOP TIER: Logo & Auth (Dark Background) === */}
      <div className="bg-dark text-white py-2">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="text-white text-decoration-none fs-4 fw-bold">
            Financial Helper
          </Link>

          <div className="d-flex align-items-center gap-3">
            <div className="user-menu">
              {user ? (
                // USER IS LOGGED IN
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted">Welcome, {user.name}</span>

                  {/* THE MAGIC: Check the role and render the correct link */}
                  {user.role === "admin" || user.role === "superadmin" ? (
                    <Link
                      to="/fintech-admin"
                      className="btn btn-sm btn-primary fw-bold"
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="btn btn-sm btn-outline-primary"
                    >
                      My Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-danger"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // USER IS NOT LOGGED IN
                <div className="d-flex gap-2">
                  <Link
                    to="/login"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-sm btn-primary">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === BOTTOM TIER: Storefront Menus (Light Background) === */}
      <nav className="navbar navbar-expand bg-light shadow-sm py-2 mb-4">
        <div className="container">
          <ul className="navbar-nav gap-4 fw-semibold">
            <li className="nav-item">
              <Link to="/" className="nav-link text-dark">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about-us" className="nav-link text-dark">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link text-dark">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/policies" className="nav-link text-dark">
                All Policies
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ========================================== */}
        {/* PUBLIC STOREFRONT ROUTES (Customer Layout) */}
        {/* ========================================== */}
        <Route
          path="/"
          element={
            <div className="bg-light min-vh-100">
              <Navigation /> {/* Customer Header */}
              <main className="container pb-5">
                <Home /> {/* Or whatever component you want here */}
              </main>
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navigation />
              <div className="container">
                <Login />
              </div>
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navigation />
              <div className="container">
                <Register />
              </div>
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <Navigation />
              <div className="container">
                <Dashboard />
              </div>
            </>
          }
        />
        <Route
          path="/policies"
          element={
            <>
              <Navigation />
              <div className="container">
                <Policy />
              </div>
            </>
          }
        />
        <Route path="/page/:slug" element={<SinglePage />} />

        {/* ========================================== */}
        {/* ADMIN PORTAL ROUTES (Isolated Layout)      */}
        {/* ========================================== */}
        <Route path="/fintech-admin" element={<AdminLayout />}>
          {/* Default view when hitting /fintech-admin */}
          <Route index element={<AdminDashboard />} />
          <Route path="/fintech-admin/policies" element={<AdminPolicies />} />
          <Route path="/fintech-admin/pages" element={<AdminPages />} />
          {/* We will build these next! */}

          {/* <Route path="policies" element={<AdminPolicies />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
