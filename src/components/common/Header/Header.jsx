// src/components/common/Header/Header.jsx
import Logo from "./Logo";
import TopNavBar from "./TopNavBar";
import MainNavBar from "./MainNavBar";

const Header = () => {
  return (
    <header>
      {/* === TOP TIER: Logo & Auth (Dark Background) === */}
      <div className="bg-dark text-white py-2">
        <div className="container d-flex justify-content-between align-items-center">
          <Logo />
          <TopNavBar />
        </div>
      </div>

      {/* === BOTTOM TIER: Storefront Menus (Light Background) === */}
      <MainNavBar />
    </header>
  );
};

export default Header;
