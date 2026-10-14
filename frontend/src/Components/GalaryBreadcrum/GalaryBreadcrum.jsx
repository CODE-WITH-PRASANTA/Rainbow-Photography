import React from "react";
import "./GalaryBreadcrum.css";
import bgImage from "../../assets/page-1.webp"; // ✅ import image

const GalaryBreadcrum = () => {
  return (
    <section
      className="gbread-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="gbread-overlay">
        <h1 className="gbread-title">OUR GALLERY</h1>

        <div className="gbread-path">
          <span>Home</span>
          <span>›</span>
          <span>Gallery</span>
        </div>
      </div>
    </section>
  );
};

export default GalaryBreadcrum;