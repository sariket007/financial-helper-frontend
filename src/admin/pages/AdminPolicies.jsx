import { useState, useEffect } from "react";
import axios from "axios";
import PolicyForm from "../components/PolicyForm";

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch all policies from the database
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching policies from:",
        `${import.meta.env.VITE_API_BASE_URL}/policies`,
      );
      //console.log(`${import.meta.env.VITE_API_BASE_URL}/policies`);
      //const currentUser = authService.getCurrentUser();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/policies`,
        {
          withCredentials: true,
        },
      );

      const fetchedData = response.data.data || response.data;

      // THE FIX: Strictly check if it is an array. If not, force it to be an empty array [].
      setPolicies(Array.isArray(fetchedData) ? fetchedData : []);
      setError("");
    } catch (err) {
      setError("Failed to load policies. Please check your server.");
      console.error(err);
      setPolicies([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Run once when the page loads
  useEffect(() => {
    fetchPolicies();
  }, []);

  // 2. Delete a policy
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/policies/${id}`, {
        withCredentials: true, // Admin routes must be protected!
      });
      // Refresh the table immediately after deleting
      fetchPolicies();
    } catch (err) {
      alert("Failed to delete policy.");
    }
  };
  {
    /* Add the toggle function inside AdminPolicies component */
  }
  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/policies/${id}/toggle`,
        {},
        {
          withCredentials: true,
        },
      );
      fetchPolicies(); // Refresh table to show new status
    } catch (err) {
      alert("Failed to update status");
    }
  };

  {
    /* Down in your return() statement inside the <tbody>... */
  }

  {
    policies.map((policy) => (
      <tr key={policy._id}>
        <td className="px-4 fw-semibold">{policy.name}</td>
        <td>${policy.price}</td>

        {/* NEW STATUS BADGE */}
        <td>
          <span
            className={`badge ${policy.isActive !== false ? "bg-success" : "bg-secondary"}`}
          >
            {policy.isActive !== false ? "Active" : "Inactive"}
          </span>
        </td>

        <td>
          <span className="badge bg-light text-dark border">
            {policy.features?.length || 0} features
          </span>
        </td>

        <td className="px-4 text-end">
          {/* SAFE TOGGLE BUTTON INSTEAD OF DELETE */}
          <button
            onClick={() => handleToggleStatus(policy._id)}
            className={`btn btn-sm fw-bold ${policy.isActive !== false ? "btn-outline-warning" : "btn-outline-success"}`}
          >
            {policy.isActive !== false ? "Deactivate" : "Activate"}
          </button>
        </td>
      </tr>
    ));
  }
  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-dark">Policy Management</h2>
          <p className="text-muted">
            Create, view, and manage financial packages.
          </p>
        </div>
      </div>

      <div className="row">
        {/* LEFT COLUMN: THE FORM */}
        <div className="col-lg-5 mb-4">
          {/* We pass fetchPolicies as a prop so the form can trigger a table refresh! */}
          <PolicyForm onPolicyCreated={fetchPolicies} />
        </div>

        {/* RIGHT COLUMN: THE DATA TABLE */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold text-primary">Active Policies</h5>
            </div>
            <div className="card-body p-0">
              {loading && (
                <div className="p-4 text-center text-muted">
                  Loading policies...
                </div>
              )}
              {error && (
                <div className="p-4 alert alert-danger m-3">{error}</div>
              )}

              {/* Change policies.length to policies?.length */}
              {!loading && !error && policies?.length === 0 && (
                <div className="p-4 text-center text-muted">
                  No policies found. Create one to get started.
                </div>
              )}

              {!loading && policies?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="py-3">Price</th>
                        <th className="py-3">Features</th>
                        <th className="py-3 text-end">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policies.map((policy) => (
                        <tr key={policy._id}>
                          <td className="px-4 fw-semibold">{policy.name}</td>
                          <td>${policy.price}</td>
                          <td>
                            <span className="badge bg-secondary rounded-pill">
                              {policy.features?.length || 0} features
                            </span>
                          </td>
                          <td className="px-4 text-end">
                            {/* SAFE TOGGLE BUTTON INSTEAD OF DELETE */}
                            <button
                              onClick={() => handleToggleStatus(policy._id)}
                              className={`btn btn-sm fw-bold ${policy.isActive !== false ? "btn-outline-warning" : "btn-outline-success"}`}
                            >
                              {policy.isActive !== false
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPolicies;
