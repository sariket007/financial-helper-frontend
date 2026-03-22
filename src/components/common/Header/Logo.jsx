// src/components/common/Header/Logo.jsx
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="text-white text-decoration-none fs-4 fw-bold">
      Financial Helper
    </Link>
  );
};

export default Logo;
