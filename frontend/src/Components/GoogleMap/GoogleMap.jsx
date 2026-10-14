import React from "react";
import "./GoogleMap.css";

const GoogleMap = () => {
  return (
    <section className="map-section">
      <div className="map-title-wrapper">
        <h2 className="map-title">Find Us On Map</h2>
        <p className="map-subtitle">
          Locate our office easily — we are always ready to welcome you.
        </p>
      </div>

      <div className="map-container">
        <iframe
          title="google-map"
          src="https://maps.google.com/maps?q=dublin&t=&z=13&ie=UTF8&iwloc=&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
};

export default GoogleMap;