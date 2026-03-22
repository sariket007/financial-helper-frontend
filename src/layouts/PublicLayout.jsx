// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer/Footer";

const PublicLayout = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* 1. The Global Storefront Header */}
      <Header />

      {/* 2. The Dynamic Page Content */}
      <main className="container pb-5 flex-grow-1 mt-4">
        <Outlet />
      </main>

      {/* 3. The Global Storefront Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
