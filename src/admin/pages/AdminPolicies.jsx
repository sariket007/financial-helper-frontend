import { useState, useEffect } from "react";
import axios from "axios";
import PolicyForm from "../components/PolicyForm";

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Add this under your other useState declarations
  const [editingPolicy, setEditingPolicy] = useState(null);
  // 1. Fetch all policies from the database
  const fetchPolicies = async () => {
    try {
      setLoading(true);
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
  const handleHardDelete = async (id) => {
    if (
      !window.confirm(
        "WARNING: This will permanently delete the policy. Are you sure?",
      )
    )
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/policies/${id}`,
        {
          withCredentials: true,
        },
      );
      fetchPolicies(); // Refresh the table
      // If they delete the policy they are currently editing, clear the form
      if (editingPolicy?._id === id) setEditingPolicy(null);
    } catch (err) {
      alert("Failed to delete policy");
    }
  };

  // Add the toggle function inside AdminPolicies component 
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
        {/* LEFT COLUMN: Update the Form Component */}
        <div className="col-lg-5 mb-4">
          <PolicyForm
            onPolicyCreated={fetchPolicies}
            editingPolicy={editingPolicy}
            clearEdit={() => setEditingPolicy(null)}
          />
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
                        <th className="py-2">Status</th>
                        <th className="py-3 text-center">Action</th>
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
                          <td>{policy.isActive ? "Active" : "Inactive"}</td>
                          <td className="px-4 text-end">
                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingPolicy(policy)}
                              className="btn btn-sm btn-outline-primary fw-bold me-2"
                            >
                              Edit
                            </button>

                            {/* Existing Toggle Button */}
                            <button
                              onClick={() => handleToggleStatus(policy._id)}
                              className={`btn btn-sm fw-bold me-2 ${policy.isActive !== false ? "btn-outline-warning" : "btn-outline-success"}`}
                            >
                              {policy.isActive !== false
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            {/* Hard Delete Button */}
                            <button
                              onClick={() => handleHardDelete(policy._id)}
                              className="btn btn-sm btn-outline-danger fw-bold"
                            >
                              <i className="bi bi-trash"></i> Delete
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
