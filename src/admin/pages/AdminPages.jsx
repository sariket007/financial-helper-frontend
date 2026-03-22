import React, { useState, useEffect } from "react";
import axios from "axios";
import PageForm from "../components/PageForm"; // Adjust path if necessary

const AdminPages = () => {
  const [pages, setPages] = useState([]);
  const [editingPage, setEditingPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch all pages on load
  const fetchPages = async () => {
    try {
      setIsLoading(true);
      // Calls the Admin route we built (fetches both Drafts and Published)
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/pages`,
        {
          withCredentials: true,
        },
      );
      setPages(response.data.data);
    } catch (error) {
      console.error("Failed to fetch pages", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // 2. Handle Hard Delete
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "WARNING: This will permanently delete this page. Are you sure?",
      )
    )
      return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/pages/${id}`, {
        withCredentials: true,
      });
      fetchPages(); // Refresh the table
      if (editingPage?._id === id) setEditingPage(null); // Clear form if editing the deleted page
    } catch (error) {
      console.error("Failed to delete page", error);
      alert("Failed to delete page");
    }
  };

  // 3. Quick Toggle: Draft <-> Published
  const handleToggleStatus = async (page) => {
    const newStatus = page.status === "published" ? "draft" : "published";
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/pages/${page._id}`,
        { status: newStatus },
        { withCredentials: true },
      );
      fetchPages(); // Refresh the table
    } catch (error) {
      console.error("Failed to update page status", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Page Management (CMS)</h2>
      </div>

      <div className="row">
        {/* LEFT COLUMN: The Form */}
        <div className="col-lg-5 mb-4">
          <PageForm
            onPageSaved={fetchPages}
            editingPage={editingPage}
            clearEdit={() => setEditingPage(null)}
          />
        </div>

        {/* RIGHT COLUMN: The Data Table */}
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Existing Pages</div>
            <div className="card-body p-0 text-center">
              {isLoading ? (
                <div className="p-4 text-muted">Loading pages...</div>
              ) : pages.length === 0 ? (
                <div className="p-4 text-muted">
                  No pages found. Create your first one!
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-start px-4">Page Title</th>
                        <th>URL Slug</th>
                        <th>Status</th>
                        <th className="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.map((page) => (
                        <tr key={page._id}>
                          {/* Title */}
                          <td className="text-start px-4 fw-bold">
                            {page.title}
                          </td>

                          {/* Slug */}
                          <td className="text-muted small">/{page.slug}</td>

                          {/* Status Badge */}
                          <td>
                            <span
                              className={`badge ${page.status === "published" ? "bg-success" : "bg-secondary"}`}
                            >
                              {page.status.toUpperCase()}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="text-end px-4">
                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingPage(page)}
                              className="btn btn-sm btn-outline-primary fw-bold me-2"
                            >
                              Edit
                            </button>

                            {/* Status Toggle Button */}
                            <button
                              onClick={() => handleToggleStatus(page)}
                              className={`btn btn-sm fw-bold me-2 ${page.status === "published" ? "btn-outline-warning" : "btn-outline-success"}`}
                            >
                              {page.status === "published"
                                ? "Draft"
                                : "Publish"}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(page._id)}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete Page"
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

export default AdminPages;
