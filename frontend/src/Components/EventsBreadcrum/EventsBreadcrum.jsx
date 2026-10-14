import React from "react";
import "./EventsBreadcrum.css";
import bgImage from "../../assets/page-1.webp"; // ✅ import image

const EventsBreadcrum = () => {
  return (
    <section
      className="eventbread-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="eventbread-overlay">
        <h1 className="eventbread-title">EVENTS</h1>

        <div className="eventbread-path">
          <span>Home</span>
          <span>›</span>
          <span>Gallery</span>
        </div>
      </div>
    </section>
  );
};

export default EventsBreadcrum;