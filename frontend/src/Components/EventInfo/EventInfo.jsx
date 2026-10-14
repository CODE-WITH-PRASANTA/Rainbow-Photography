import React from "react";
import "./EventInfo.css";

const EventInfo = () => {
  return (
    <section className="eventInfo-section">
      <div className="eventInfo-container">

        <div className="eventInfo-box">

          <div className="eventInfo-item">
            <p className="eventInfo-label">Date</p>
            <h4 className="eventInfo-value">10 January, 2023</h4>
          </div>

          <div className="eventInfo-item">
            <p className="eventInfo-label">Client</p>
            <h4 className="eventInfo-value">Kodesolution LTD</h4>
          </div>

          <div className="eventInfo-item">
            <p className="eventInfo-label">Website</p>
            <h4 className="eventInfo-value">www.domain.com</h4>
          </div>

          <div className="eventInfo-item">
            <p className="eventInfo-label">Location</p>
            <h4 className="eventInfo-value">New York, USA</h4>
          </div>

        </div>

      </div>
    </section>
  );
};

export default EventInfo;