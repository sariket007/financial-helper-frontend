import { useState, useEffect } from "react";
import axios from "axios";

const Policy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/policies/public`,
        );
        setPolicies(response.data.data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <h4>Loading plans...</h4>
      </div>
    );
  if (policies.length === 0)
    return (
      <div className="text-center py-5 text-muted">
        <h4>No active plans available.</h4>
      </div>
    );

  return (
    <div className="row g-4">
      {policies.map((policy) => (
        <div key={policy._id} className="col-12 col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <h4 className="card-title fw-bold text-primary">{policy.name}</h4>
              <p
                className="card-text text-muted mb-4"
                style={{ minHeight: "48px" }}
              >
                {policy.description}
              </p>
              <h2 className="fw-bolder mb-4">${policy.price}</h2>

              <ul className="list-unstyled mb-4 flex-grow-1">
                {policy.features.map((feature, index) => (
                  <li key={index} className="mb-2">
                    <span className="text-success fw-bold me-2">✓</span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="btn btn-primary w-100 fw-bold mt-auto">
                Select Plan
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Policy;
