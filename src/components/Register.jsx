import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService"; // The strict OOP Singleton

const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [navigate]);
  // State Management (Inputs)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    annualIncome: "",
    riskTolerance: "Medium", // Defaulting to your schema's enum
    primaryGoal: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Destructure for cleaner JSX
  const { name, email, password, annualIncome, riskTolerance, primaryGoal } =
    formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // The Output/Behavior
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Architecting the exact nested payload your Node.js backend expects
    const payload = {
      name,
      email,
      password,
      financialProfile: {
        annualIncome: Number(annualIncome), // Ensure it passes as a number
        riskTolerance,
        primaryGoal,
      },
    };

    try {
      // Delegating entirely to the Service layer
      await authService.register(payload);

      // On success, snap the user straight to the secure dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
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

              {/* Error Display */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

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
                <div className="mb-4">
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

                <h5 className="mb-3 text-muted border-bottom pb-2 mt-4">
                  Financial Profile
                </h5>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Annual Income (₹)
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
                    placeholder="e.g., Buying a house, Retirement"
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
