import React from "react";
import Policy from "../components/Policy";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="p-5 text-center bg-primary text-white rounded-3 mb-5 shadow-sm">
        <h1 className="display-4 fw-bold mb-3">Secure Your Financial Future</h1>
        <p className="lead mb-0">
          Expert advisory plans tailored to your personal goals.
        </p>
      </div>

      {/* Policies Mounting Point */}
      <div className="mb-5">
        <h2 className="text-center fw-bold mb-4">Top Trending Plans</h2>
        <Policy />
      </div>
    </div>
  );
};

export default Home;
