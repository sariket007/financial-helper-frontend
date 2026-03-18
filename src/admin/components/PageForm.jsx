import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

const PageForm = ({ onPageSaved, editingPage, clearEdit }) => {
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Initialize the form
  const {
    register,
    handleSubmit,
    control, // We need this to bridge React-Quill
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  // 2. Populate form if editing
  useEffect(() => {
    if (editingPage) {
      reset({
        title: editingPage.title,
        content: editingPage.content,
        status: editingPage.status,
      });
    } else {
      reset({ title: "", content: "", status: "draft" });
    }
  }, [editingPage, reset]);

  // 3. Handle Submit (POST or PUT)
  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");

    try {
      const url = editingPage
        ? `${import.meta.env.VITE_API_BASE_URL}/pages/${editingPage._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/pages`;

      const method = editingPage ? "put" : "post";

      await axios({
        method,
        url,
        data,
        withCredentials: true, // Sends your JWT cookie
      });

      setSuccessMsg(editingPage ? "Page updated!" : "Page created!");

      if (!editingPage) reset(); // Clear form if it was a new creation
      if (onPageSaved) onPageSaved(); // Refresh the parent table
      if (editingPage) clearEdit(); // Close edit mode

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setServerError(error.response?.data?.error || "Failed to save the page");
    }
  };

  // Custom Toolbar Options for React-Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"], // "clean" removes formatting
    ],
  };

  return (
    <div className="card shadow-sm p-4">
      <h4 className="mb-4">{editingPage ? "Edit Page" : "Create New Page"}</h4>

      {serverError && <div className="alert alert-danger">{serverError}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* TITLE INPUT */}
        <div className="mb-3">
          <label className="form-label fw-bold">Page Title</label>
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            {...register("title", { required: "Title is required" })}
            placeholder="e.g., About Our Financial Team"
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title.message}</div>
          )}
        </div>

        {/* STATUS DROPDOWN */}
        <div className="mb-3">
          <label className="form-label fw-bold">Status</label>
          <select className="form-select" {...register("status")}>
            <option value="draft">Draft (Hidden)</option>
            <option value="published">Published (Live)</option>
          </select>
        </div>

        {/* RICH TEXT EDITOR (The Controller Bridge) */}
        <div className="mb-4">
          <label className="form-label fw-bold">Page Content</label>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content cannot be empty" }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                modules={modules}
                value={field.value}
                onChange={field.onChange}
                className="bg-white"
                style={{ height: "200px", marginBottom: "50px" }}
              />
            )}
          />
          {errors.content && (
            <div className="text-danger mt-1 small">
              {errors.content.message}
            </div>
          )}
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          {editingPage ? (
            <button
              type="button"
              className="btn btn-outline-secondary fw-bold"
              onClick={clearEdit}
            >
              Cancel Edit
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            className="btn btn-primary fw-bold px-4"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editingPage
                ? "Update Page"
                : "Save Page"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageForm;
