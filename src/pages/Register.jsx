import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. Import Context

const Register = () => {
  const navigate = useNavigate();

  // Inside Register.jsx, right above your state declarations:
  const { register, user } = useAuth(); // (You already have this)

  // ADD THIS REVERSE BOUNCER:
  if (user) {
    if (user.role === "admin" || user.role === "superadmin") {
      return <Navigate to="/fintech-admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // New role field for testing
    annualIncome: "",
    riskTolerance: "Medium",
    primaryGoal: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    name,
    email,
    password,
    role,
    annualIncome,
    riskTolerance,
    primaryGoal,
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const payload = {
      name,
      email,
      password,
      role,
      financialProfile: {
        annualIncome: Number(annualIncome),
        riskTolerance,
        primaryGoal,
      },
    };

    try {
      // 3. Call the Context register function (Instantly updates global state)
      const newUser = await register(payload);

      // 4. Safely Navigate (The ProtectedRoute will handle the rest)
      if (
        newUser &&
        (newUser.role === "admin" || newUser.role === "superadmin")
      ) {
        navigate("/fintech-admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold">Create Your Account</h2>
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <h5 className="mb-3 text-muted border-bottom pb-2">
                  Account Details
                </h5>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    minLength="6"
                    required
                  />
                </div>

                {/* NEW ROLE SELECTOR FOR TESTING */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-primary">
                    Account Role (Dev Only)
                  </label>
                  <select
                    className="form-select border-primary"
                    name="role"
                    value={role}
                    onChange={handleChange}
                  >
                    <option value="customer">Standard Customer</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <h5 className="mb-3 text-muted border-bottom pb-2 mt-4">
                  Financial Profile
                </h5>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Annual Income ($)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="annualIncome"
                    value={annualIncome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Risk Tolerance
                  </label>
                  <select
                    className="form-select"
                    name="riskTolerance"
                    value={riskTolerance}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Primary Financial Goal
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="primaryGoal"
                    value={primaryGoal}
                    onChange={handleChange}
                    placeholder="e.g., Buying a house"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Register Securely"}
                </button>

                <div className="text-center mt-3">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-decoration-none">
                    Log in here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
