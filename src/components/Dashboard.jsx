import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Fetch the user session securely from your OOP class
    const currentUser = authService.getCurrentUser();

    // 2. Protected Route Logic: If no token/user, kick them out
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    // 1. Destroy the session in localStorage
    authService.logout();
    // 2. Redirect to the login page
    navigate("/login");
  };

  // Prevent the UI from flashing before the redirect happens if not logged in
  if (!user) return null;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 text-center p-5">
            <h2 className="fw-bold mb-3">Hi, {user.name}! 👋</h2>
            <p className="text-muted mb-5 text-center">
              Authentication successful. Your secure session is active. <br />
              Tomorrow, we will connect this dashboard directly to the AI
              advisory engine.
            </p>

            <div>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger px-5 fw-bold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
