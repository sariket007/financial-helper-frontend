// src/components/common/Footer/Footer.jsx
import CopyRights from "./CopyRights";

const Footer = () => {
  return (
    <footer className="mt-auto">
      {/* Future components like <FooterWidgets /> can be stacked here */}
      <CopyRights />
    </footer>
  );
};

export default Footer;
