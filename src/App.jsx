import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from './components/Dashboard';

// // A temporary placeholder for tomorrow's work
// const DashboardPlaceholder = () => (
//   <div className="container mt-5 text-center">
//     <h2>Secure Dashboard</h2>
//     <p className="text-muted">
//       Authentication successful. The AI interface will be built here tomorrow.
//     </p>
//   </div>
// );

function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5 shadow-sm">
          <div className="container">
            <span className="navbar-brand fw-bold">Financial Helper</span>
            <div className="d-flex gap-3">
              <Link to="/login" className="btn btn-outline-light btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          </div>
        </nav>

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
