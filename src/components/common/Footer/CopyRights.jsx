// src/components/common/Footer/CopyRights.jsx

const CopyRights = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-dark text-white text-center py-3">
      <div className="container">
        <p className="mb-0 text-muted">
          &copy; {currentYear} Financial Helper. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default CopyRights;
