import React from "react";
import authService from "../../services/authService";

const AdminDashboard = () => {
  const user = authService.getCurrentUser();
  console.log("Admin Dashboard - Current User:", user); // Debugging line

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-5 text-center">
        <h2 className="fw-bold text-primary mb-3">System Overview</h2>
        <h4 className="text-muted">
          Welcome back to the control panel, {user?.name}.
        </h4>
        <p>{user.role}</p>
        <p className="mt-4 text-secondary">
          Use the left navigation menu to manage the storefront CMS, adjust
          pricing policies, and control user access.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
