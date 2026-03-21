// src/components/common/Header/MainNavBar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../../../api/axiosInstance";

const MainNavBar = () => {
  const [dynamicPages, setDynamicPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        // Fetch published pages using the public API (No cookies sent!)
        const response = await publicApi.get("/pages/public");

        // Adjust this depending on how your Node backend sends data (e.g., response.data.data)
        setDynamicPages(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch dynamic pages:", error);
      }
    };

    fetchPages();
  }, []);

  return (
    <nav className="navbar navbar-expand bg-light shadow-sm py-2 mb-4">
      <div className="container">
        <ul className="navbar-nav gap-4 fw-semibold d-flex align-items-center">
          {/* 1. The Hardcoded Default Home */}
          <li className="nav-item">
            <Link to="/" className="nav-link text-dark">
              Home
            </Link>
          </li>

          {/* (Optional) Keep these if they aren't CMS-driven yet */}
          {/* <li className="nav-item">
            <Link to="/about-us" className="nav-link text-dark">
              About Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link text-dark">
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/policies" className="nav-link text-dark">
              All Policies
            </Link>
          </li> */}

          {/* 2. The Dynamic Pages injected directly from the database */}
          {dynamicPages.map((page) => (
            <li className="nav-item" key={page._id || page.slug}>
              <Link to={`/p/${page.slug}`} className="nav-link text-dark">
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MainNavBar;
