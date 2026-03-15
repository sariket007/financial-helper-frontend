import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService from "../services/authService";

const AdminDashboard = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdminPolicies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/policies", {
        withCredentials: true,
      });
      setPolicies(response.data.data);
    } catch (error) {
      console.error("Admin fetch error:", error);
      if (error.response?.status === 401) {
        authService.logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.getCurrentUser()) {
      navigate("/login");
      return;
    }
    fetchAdminPolicies();
  }, [navigate]);

  const handleToggle = async (policyId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/policies/${policyId}/toggle`,
        {},
        {
          withCredentials: true,
        },
      );
      fetchAdminPolicies(); // Refresh data
    } catch (error) {
      alert("Failed to toggle policy status.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <h4>Loading Admin Panel...</h4>
      </div>
    );

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Fintech Admin Portal</h2>
        <button className="btn btn-success fw-bold">+ Create Policy</button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Policy Name</th>
              <th>Price</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy._id}>
                <td className="fw-bold">{policy.name}</td>
                <td>${policy.price}</td>
                <td>
                  <span
                    className={`badge ${policy.isActive ? "bg-success" : "bg-danger"}`}
                  >
                    {policy.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2">
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggle(policy._id)}
                    className="btn btn-sm btn-outline-warning text-dark fw-bold"
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
