import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 1. New State for the Chat Input
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // 2. The function to handle the message before sending it to the backend
  const handleSendMessage = () => {
    if (!message.trim()) return; // Don't send empty messages

    // Tomorrow, this console.log will be replaced by an actual fetch() call to your AI route
    console.log("Preparing to send to AI:", message);

    // Clear the input field after hitting send
    setMessage("");
  };

  // 3. Allow pressing "Enter" to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <div className="d-flex" style={{ height: "calc(100vh - 76px)" }}>
      {/* --- LEFT SIDEBAR --- */}
      {isSidebarOpen && (
        <div
          className="bg-dark text-white p-3 d-flex flex-column shadow-sm"
          style={{
            width: "20%",
            minWidth: "220px",
            transition: "all 0.3s ease",
          }}
        >
          <span
            className="text-uppercase text-secondary fw-bold mb-3 mt-2"
            style={{ fontSize: "0.8rem" }}
          >
            Menu
          </span>
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <button className="nav-link active bg-primary text-white w-100 text-start fw-semibold shadow-sm">
                💬 Conversation
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* --- RIGHT MAIN CHAT AREA --- */}
      <div className="flex-grow-1 bg-white d-flex flex-column position-relative">
        <div className="border-bottom p-3 d-flex align-items-center bg-light shadow-sm z-1">
          <button
            className="btn btn-outline-secondary btn-sm me-3 fw-bold"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h5 className="mb-0 fw-bold text-dark">Financial Advisory AI</h5>
        </div>

        <div
          className="flex-grow-1 p-4 overflow-auto bg-light"
          style={{
            backgroundImage: "linear-gradient(to bottom, #f8f9fa, #ffffff)",
          }}
        >
          <div className="text-center text-muted mt-5">
            <h4 className="fw-bold text-dark mb-3">
              Welcome to your secure terminal, {user.name}.
            </h4>
            <div className="badge bg-success mb-2 px-3 py-2">
              Session Secure
            </div>
            <p className="mt-2 text-secondary">
              Your interface is ready. Type a message below to test the local
              state logic.
            </p>
          </div>
        </div>

        {/* --- UPDATED INTERACTIVE INPUT AREA --- */}
        <div className="p-3 border-top bg-white">
          <div className="input-group input-group-lg shadow-sm">
            <input
              type="text"
              className="form-control fs-6"
              placeholder="Ask me about your financial goals..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="btn btn-primary fw-bold px-4"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
