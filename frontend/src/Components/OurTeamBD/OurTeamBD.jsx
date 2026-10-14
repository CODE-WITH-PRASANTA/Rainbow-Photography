import React from "react";
import "./OurTeamBD.css";
import bgImage from "../../assets/page-1.webp"; // ✅ import image

const OurTeamBD = () => {
  return (
    <section
      className="OurTeamBD-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="OurTeamBD-overlay">
        <h1 className="OurTeamBD-title">OUR TEAM</h1>

        <div className="OurTeamBD-path">
          <span>Home</span>
          <span>›</span>
          <span>Our Team</span>
        </div>
      </div>
    </section>
  );
};

export default OurTeamBD;