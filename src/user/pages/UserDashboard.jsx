// src/user/pages/UserDashboard.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log("Preparing to send to AI:", message);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Chat History Area */}
      <div
        className="flex-grow-1 p-4 overflow-auto bg-light"
        style={{
          backgroundImage: "linear-gradient(to bottom, #f8f9fa, #ffffff)",
        }}
      >
        <div className="text-center text-muted mt-5">
          <h4 className="fw-bold text-dark mb-3">
            Welcome to your secure terminal, {user?.name}.
          </h4>
          <div className="badge bg-success mb-2 px-3 py-2">Session Secure</div>
          <p className="mt-2 text-secondary">
            Your interface is ready. Type a message below to test the local
            state logic.
          </p>
        </div>
      </div>

      {/* Interactive Input Area */}
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
  );
};

export default UserDashboard;
