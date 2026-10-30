import React from "react";
import "./GoogleMap.css";

const MAP_SRC =
  "https://maps.google.com/maps?q=Charampa,Bhadrak,Odisha%20756101&t=&z=14&ie=UTF8&iwloc=&output=embed";
const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Charampa,Bhadrak,Odisha+756101";

const PinIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z" />
    <circle cx="12" cy="9" r="2.6" />
  </svg>
);

const GoogleMap = () => {
  return (
    <section className="rm-section">
      <span className="rm-blob" />

      <div className="rm-wrap">
        <div className="rm-head">
          <span className="rm-eyebrow">FIND US</span>
          <div className="rm-divider">
            <i />
            <PinIcon />
            <i />
          </div>
          <h2 className="rm-title">
            Visit Our <span>Studio</span>
          </h2>
          <p className="rm-sub">
            Drop by for a coffee and a chat — we’d love to meet you and hear
            your love story.
          </p>
        </div>

        <div className="rm-map">
          <iframe
            title="Rainbow Photography Location"
            src={MAP_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <div className="rm-card">
            <span className="rm-ico">
              <PinIcon />
            </span>
            <div>
              <b>Rainbow Photography</b>
              <p>Charampa, Bhadrak, Odisha – 756101</p>
              <a href={MAP_LINK} target="_blank" rel="noreferrer">
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleMap;