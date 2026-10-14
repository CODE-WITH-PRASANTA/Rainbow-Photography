import React from "react";
import "./RSVPBreadcrum.css";
import bgImage from "../../assets/page-1.webp";

const RSVPBreadcrum = () => {
  return (
    <section
      className="RSVPBreadcrum"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="RSVPBreadcrum__overlay">
        <h1 className="RSVPBreadcrum__title">RSVP</h1>

        <div className="RSVPBreadcrum__path">
          <span>Home</span>
          <span>›</span>
          <span>RSVP</span>
        </div>
      </div>
    </section>
  );
};

export default RSVPBreadcrum;