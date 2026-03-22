// src/user/components/UserLayout.jsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Replace your existing handleLogout in AdminLayout.jsx with this:
  const handleLogout = async () => {
    await logout().finally(() => {
      // replace: true wipes the forward history so they can't click the browser "Back" button to return!
      navigate("/login", { replace: true });
    });
  };

  // The ProtectedRoute guarantees `user` exists, so we don't need a null check here
  return (
    <div className="d-flex vh-100 bg-light">
      {/* --- LEFT SIDEBAR --- */}
      {isSidebarOpen && (
        <div
          className="bg-dark text-white p-3 d-flex flex-column shadow-sm"
          style={{ width: "250px", transition: "all 0.3s ease" }}
        >
          <span
            className="text-uppercase text-secondary fw-bold mb-3 mt-2"
            style={{ fontSize: "0.8rem" }}
          >
            Menu
          </span>
          <ul className="nav nav-pills flex-column mb-auto gap-2">
            <li className="nav-item">
              <button className="nav-link active bg-primary text-white w-100 text-start fw-semibold shadow-sm">
                💬 Conversation
              </button>
            </li>
          </ul>

          <div className="mt-auto border-top border-secondary pt-3 text-center">
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 fw-bold"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* --- RIGHT MAIN CONTENT AREA --- */}
      <div className="flex-grow-1 bg-white d-flex flex-column position-relative">
        {/* Top Navbar */}
        <div className="border-bottom p-3 d-flex justify-content-between align-items-center bg-light shadow-sm z-1">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary btn-sm me-3 fw-bold"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <h5 className="mb-0 fw-bold text-dark">Financial Advisory AI</h5>
          </div>
          <span className="fw-bold text-dark text-capitalize">
            {user.role} Portal
          </span>
        </div>

        {/* The Magic Window for UserPages (like the Chat) */}
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
