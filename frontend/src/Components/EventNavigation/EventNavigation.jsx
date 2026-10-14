import React from "react";
import "./EventNavigation.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const EventNavigation = () => {

  /* Scroll page to top */
  const handleNavigation = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="eventNav-section">
      <div className="eventNav-container">

        {/* Previous */}
        <button
          className="eventNav-item eventNav-prev"
          onClick={handleNavigation}
        >
          <span className="eventNav-circle">
            <FaArrowLeft />
          </span>
          <span className="eventNav-text">Previous</span>
        </button>

        {/* Next */}
        <button
          className="eventNav-item eventNav-next"
          onClick={handleNavigation}
        >
          <span className="eventNav-text">Next</span>
          <span className="eventNav-circle">
            <FaArrowRight />
          </span>
        </button>

      </div>
    </section>
  );
};

export default EventNavigation;