import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// 1. THE ZOD SCHEMA (The Blueprint)
// This strictly defines what valid data looks like.
const policySchema = z.object({
  name: z.string().min(3, "Policy name must be at least 3 characters"),
  price: z.coerce.number().min(1, "Price must be greater than 0"), // coerce automatically turns the string input into a number!
  description: z.string().min(10, "Description needs to be a bit longer"),
  // useFieldArray requires an array of objects to track unique IDs
  features: z
    .array(z.object({ value: z.string().min(1, "Feature cannot be empty") }))
    .min(1, "You must add at least one feature"),
});

const PolicyForm = ({ onPolicyCreated, editingPolicy, clearEdit }) => {
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 2. INITIALIZING REACT HOOK FORM
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      features: [{ value: "" }],
      isActive: true, // Start with one empty feature box
    },
  });

  // 3. THE DYNAMIC ARRAY HOOK (Senior Level)
  // This completely replaces our messy [...features] array cloning from yesterday
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  // Watch for the user clicking "Edit" on the table
  useEffect(() => {
    if (editingPolicy) {
      // We must transform the MongoDB array ["A", "B"] back into the
      // array of objects [{value: "A"}, {value: "B"}] that useFieldArray requires!
      const formattedFeatures = editingPolicy.features.map((f) => ({
        value: f,
      }));

      // reset() instantly fills all the inputs
      reset({
        name: editingPolicy.name,
        price: editingPolicy.price,
        description: editingPolicy.description,
        features: formattedFeatures,
      });
    } else {
      // If we clear the edit, wipe the form back to default
      reset({
        name: "",
        price: "",
        description: "",
        features: [{ value: "" }],
      });
    }
  }, [editingPolicy, reset]);
  // 4. THE SUBMIT HANDLER
  // This ONLY runs if Zod approves the data perfectly. No manual IF statements needed!
  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");

    const formattedPayload = {
      ...data,
      features: data.features.map((f) => f.value),
    };

    try {
      if (editingPolicy) {
        // UPDATE MODE (PATCH)
        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/policies/${editingPolicy._id}`,
          formattedPayload,
          {
            withCredentials: true,
          },
        );
        setSuccessMsg("Policy updated successfully!");
        clearEdit(); // Wipe form and exit edit mode
      } else {
        // CREATE MODE (POST)
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/policies`,
          formattedPayload,
          {
            withCredentials: true,
          },
        );
        setSuccessMsg("Policy published successfully!");
        reset();
      }

      if (onPolicyCreated) onPolicyCreated(); // Refreshes the table
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Failed to connect to server",
      );
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white border-bottom py-3">
        <h5 className="mb-0 fw-bold text-primary">Create New Policy</h5>
      </div>
      <div className="card-body p-4">
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mb-3">
            {/* NAME FIELD */}
            <div className="col-md-8">
              <label className="form-label fw-semibold">Policy Name</label>
              {/* Notice there is no value={} or onChange={}. 'register' handles it all invisibly! */}
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                {...register("name")}
                placeholder="e.g., Gold Retirement Plan"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            {/* PRICE FIELD */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Price ($)</label>
              <input
                type="number"
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                {...register("price")}
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price.message}</div>
              )}
            </div>
          </div>

          {/* DESCRIPTION FIELD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              {...register("description")}
              rows="2"
            />
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>

          {/* DYNAMIC FEATURES ARRAY */}
          <div className="mb-4 p-3 bg-light rounded border">
            <label className="form-label fw-semibold mb-3">
              Policy Features
            </label>

            {fields.map((field, index) => (
              <div key={field.id} className="d-flex mb-2 gap-2">
                <div className="flex-grow-1">
                  <input
                    type="text"
                    className={`form-control ${errors.features?.[index]?.value ? "is-invalid" : ""}`}
                    {...register(`features.${index}.value`)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {errors.features?.[index]?.value && (
                    <div className="invalid-feedback">
                      {errors.features[index].value.message}
                    </div>
                  )}
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            {errors.features?.root && (
              <div className="text-danger small mb-2">
                {errors.features.root.message}
              </div>
            )}

            <button
              type="button"
              className="btn btn-sm btn-outline-primary mt-2 fw-bold"
              onClick={() => append({ value: "" })}
            >
              + Add Another Feature
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-success fw-bold px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PolicyForm;
