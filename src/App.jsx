// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ==========================================
// GUARDS & LAYOUTS
// ==========================================
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./admin/components/AdminLayout";
import UserLayout from "./user/components/UserLayout";

// ==========================================
// PUBLIC PAGES
// ==========================================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Policy from "./components/Policy";
import SinglePage from "./pages/SinglePage";

// ==========================================
// USER PAGES
// ==========================================
import UserDashboard from "./user/pages/UserDashboard";

// ==========================================
// ADMIN PAGES
// ==========================================
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminPolicies from "./admin/pages/AdminPolicies";
import AdminPages from "./admin/pages/AdminPages";

function App() {
  return (
    <Router>
      <Routes>
        {/* ========================================== */}
        {/* PUBLIC STOREFRONT (Header/Footer)          */}
        {/* ========================================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/policies" element={<Policy />} />
          <Route path="/page/:slug" element={<SinglePage />} />
          <Route path="/p/:slug" element={<SinglePage />} />
        </Route>

        {/* ========================================== */}
        {/* STANDARD USER PORTAL (Protected)           */}
        {/* ========================================== */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            {/* Future user pages go here */}
          </Route>
        </Route>

        {/* ========================================== */}
        {/* ADMIN PORTAL (Protected)                   */}
        {/* ========================================== */}
        <Route
          element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}
        >
          <Route path="/fintech-admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="policies" element={<AdminPolicies />} />
            <Route path="pages" element={<AdminPages />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
