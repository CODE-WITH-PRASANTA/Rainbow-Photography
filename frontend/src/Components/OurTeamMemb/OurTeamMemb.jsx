import React, { useEffect, useState } from "react";
import "./OurTeamMemb.css";

import team1 from "../../assets/team4-1.webp";
import team2 from "../../assets/team4-2.webp";
import team3 from "../../assets/team4-3.webp";

import blueFlower from "../../assets/OTicon-leaves-18.webp";
import whiteFlower from "../../assets/OTicon-leaves-17.webp";

const OurTeamMemb = () => {
  const [index, setIndex] = useState(0);

  const teamData = [
    { id: 1, name: "Petar Walker", role: "Groomsmen", img: team1 },
    { id: 2, name: "Qarlos Robin", role: "Groomsmen", img: team2 },
    { id: 3, name: "Rokki Ilues", role: "Groomsmen", img: team3 },
    { id: 4, name: "Petar Walker", role: "Groomsmen", img: team1 },
    { id: 5, name: "Qarlos Robin", role: "Groomsmen", img: team2 },
    { id: 6, name: "Rokki Ilues", role: "Groomsmen", img: team3 },
  ];

  // Auto Slide (only for mobile)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % teamData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % teamData.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + teamData.length) % teamData.length);
  };

  return (
    <section className="otm-wrapper">
      <div className="otm-container">

        {/* Desktop Grid */}
        <div className="otm-grid">
          {teamData.map((member) => (
            <div key={member.id} className="otm-card">
              <div className="otm-imageBox">

                <img
                  src={whiteFlower}
                  alt=""
                  className="otm-flower-white"
                />

                <div className="otm-diamond">
                  <img src={member.img} alt={member.name} />
                </div>

                <img
                  src={blueFlower}
                  alt=""
                  className="otm-flower-blue"
                />
              </div>

              <h3>{member.name}</h3>
              <span>{member.role}</span>
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="otm-slider">
          <div
            className="otm-slider-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {teamData.map((member) => (
              <div key={member.id} className="otm-slide">
                <div className="otm-card">
                  <div className="otm-imageBox">

                    <img
                      src={whiteFlower}
                      alt=""
                      className="otm-flower-white"
                    />

                    <div className="otm-diamond">
                      <img src={member.img} alt={member.name} />
                    </div>

                    <img
                      src={blueFlower}
                      alt=""
                      className="otm-flower-blue"
                    />
                  </div>

                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="otm-arrow left" onClick={handlePrev}>
            &#10094;
          </button>
          <button className="otm-arrow right" onClick={handleNext}>
            &#10095;
          </button>
        </div>

      </div>
    </section>
  );
};

export default OurTeamMemb;