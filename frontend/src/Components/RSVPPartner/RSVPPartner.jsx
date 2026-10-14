import React from "react";
import "./RSVPPartner.css";

/* BACKGROUND FLOWER */
import bgFlowers from "../../assets/pattern-8.webp";

/* PARTNER LOGOS */
import partner1 from "../../assets/L-1.webp";
import partner2 from "../../assets/L-2.webp";
import partner3 from "../../assets/L-3.webp";
import partner4 from "../../assets/L-4.webp";
import partner5 from "../../assets/L-5.webp";
import partner6 from "../../assets/L-6.webp";

const RSVPPartner = () => {
  return (
    <section
      className="RSVPPartner"
      style={{ backgroundImage: `url(${bgFlowers})` }}
    >
      <div className="RSVPPartner-container">
        
        {/* LEFT CONTENT */}
        <div className="RSVPPartner-left">
          <p className="RSVPPartner-subtitle">
            Thank you for giving
          </p>

          <h2 className="RSVPPartner-title">
            Valuable <br /> Partners
          </h2>

          <p className="RSVPPartner-description">
            From the vibrant flowers and trees to the gently flowing streams,
            this park provides the perfect backdrop.
          </p>
        </div>

        {/* RIGHT GRID */}
        <div className="RSVPPartner-grid">
          <div className="RSVPPartner-card">
            <img src={partner1} alt="partner1" />
          </div>
          <div className="RSVPPartner-card">
            <img src={partner2} alt="partner2" />
          </div>
          <div className="RSVPPartner-card">
            <img src={partner3} alt="partner3" />
          </div>
          <div className="RSVPPartner-card">
            <img src={partner4} alt="partner4" />
          </div>
          <div className="RSVPPartner-card">
            <img src={partner5} alt="partner5" />
          </div>
          <div className="RSVPPartner-card">
            <img src={partner6} alt="partner6" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default RSVPPartner;