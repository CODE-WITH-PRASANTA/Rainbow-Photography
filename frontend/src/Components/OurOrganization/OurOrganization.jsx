import React, { useState } from "react";
import "./OurOrganization.css";

import team1 from "../../assets/team4-1.webp";
import team2 from "../../assets/team4-2.webp";
import team3 from "../../assets/team4-3.webp";

const OurOrganization = () => {
  const teamMembers = [
    { name: "PETAR WALKER", role: "Lead Assistant", image: team1 },
    { name: "QARLOS ROBIN", role: "Planner", image: team2 },
    { name: "ROKKI ILUES", role: "Executive", image: team3 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? teamMembers.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === teamMembers.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="organizers-section">

      {/* Premium Floating Luxury Bubbles */}
      <div className="bubbles">
        <span className="bubble b1"></span>
        <span className="bubble b2"></span>
        <span className="bubble b3"></span>
        <span className="bubble b4"></span>
        <span className="bubble b5"></span>
        <span className="bubble b6"></span>
        <span className="bubble b7"></span>
      </div>

      <div className="organizers-container">
        <div className="organizers-header">
          <p className="organizers-subtitle">ORGANIZERS</p>
          <h2 className="organizers-title">Our Lovely Team</h2>
        </div>

        {/* Desktop Grid */}
        <div className="organizers-grid">
          {teamMembers.map((member, index) => (
            <div className="organizer-card" key={index}>
              <div className="diamond-wrapper">
                <div className="diamond-flip">
                  <div className="diamond-face front">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="diamond-face back">
                    <p>{member.name}</p>
                  </div>
                </div>
              </div>

              <div className="member-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="mobile-slider">
          <button className="mobile-nav-btn left" onClick={handlePrev}>‹</button>

          <div
            className="mobile-slider-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {teamMembers.map((member, index) => (
              <div className="organizer-card mobile-card" key={index}>
                <div className="diamond-wrapper">
                  <div className="diamond-flip">
                    <div className="diamond-face front">
                      <img src={member.image} alt={member.name} />
                    </div>
                    <div className="diamond-face back">
                      <p>{member.name}</p>
                    </div>
                  </div>
                </div>

                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="mobile-nav-btn right" onClick={handleNext}>›</button>

          <div className="pagination">
            {teamMembers.map((_, index) => (
              <div
                key={index}
                className={`pagination-item ${
                  currentIndex === index ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurOrganization;