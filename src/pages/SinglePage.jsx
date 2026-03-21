import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/axiosInstance";
import DOMPurify from "dompurify";

const SinglePage = () => {
  // Extract the dynamic slug from the URL (e.g., /pages/about-us)
  const { slug } = useParams();

  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setIsLoading(true);
        // Hit the strictly PUBLIC route we built in the backend
        const response = await publicApi.get(`/pages/public/${slug}`);
        setPage(response.data.data);
      } catch (err) {
        setError("Page not found or is currently unavailable.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug]); // Re-run if the URL slug changes

  if (isLoading) {
    return (
      <div className="container mt-5 text-center text-muted">
        Loading content...
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">404</h2>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  // THE SENIOR SECURITY MOVE: Sanitize the HTML before React touches it
  const cleanHTML = DOMPurify.sanitize(page.content);

  return (
    <div className="container mt-5 mb-5">
      {/* Optional: You can map the page.title to the <title> tag here for SEO later! */}
      <h1 className="mb-4 fw-bold">{page.title}</h1>

      {/* This is where the magic happens. 
        We inject the sanitized HTML directly into the DOM. 
      */}
      <div
        className="page-content bg-white p-4 shadow-sm rounded"
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
    </div>
  );
};

export default SinglePage;
