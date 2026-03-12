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
import Dashboard from "./components/Dashboard";
import authService from "./services/authService"; // Import the OOP class

// 1. Extracting the Navbar into a "Smart Component"
const Navigation = () => {
  const location = useLocation(); // Tracks the current URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 2. This hook fires every time the URL changes, keeping the Navbar perfectly synced
  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location]);

  // 3. Centralized Logout Handler
  const handleLogout = async () => {
    await authService.logout(); // Destroys the HttpOnly cookie on the backend
    setUser(null); // Clears the local UI state
    navigate("/login"); // Kicks the user back to the login screen
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5 shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold">Financial Helper</span>

        <div className="d-flex gap-3 align-items-center">
          {/* Conditional Rendering based on Auth State */}
          {user ? (
            <>
              <span className="text-light fw-semibold me-3">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm fw-bold"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline-light btn-sm fw-bold"
              >
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm fw-bold">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100">
        {/* 4. Inject the Smart Navigation inside the Router */}
        <Navigation />

        {/* The Routing Switchboard */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
