import React from "react";
import "./PricingBreadcrum.css";
import pricingBg from "../../assets/page-1.webp";

const PricingBreadcrum = () => {
  return (
    <section
      className="pricingBread-wrapper"
      style={{ backgroundImage: `url(${pricingBg})` }}
    >
      <div className="pricingBread-overlay">

        <h1 className="pricingBread-title">
          Pricing Table
        </h1>

        <div className="pricingBread-path">
          <span className="pricingBread-home">Home</span>
          <span className="pricingBread-arrow">›</span>
          <span className="pricingBread-current">Pricing</span>
        </div>

      </div>
    </section>
  );
};

export default PricingBreadcrum;