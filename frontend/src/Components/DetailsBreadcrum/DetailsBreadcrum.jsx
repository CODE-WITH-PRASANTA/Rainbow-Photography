import React from "react";
import "./DetailsBreadcrum.css";
import bgImage from "../../assets/page-1.webp"; // ✅ import image

const DetailsBreadcrum = () => {
  return (
    <section
      className="details-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="details-overlay">
        <h1 className="details-title">EVENT DETAILS</h1>

        <div className="details-path">
          <span>Home</span>
          <span>›</span>
          <span>Gallery</span>
        </div>
      </div>
    </section>
  );
};

export default DetailsBreadcrum;