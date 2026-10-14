import React from "react";
import "./ImageFrame.css";

import weddingImg from "../../assets/event-details-1.webp";

const ImageFrame = () => {
  return (
    <section className="imageFrame-section">
      <div className="imageFrame-container">
        <div className="imageFrame-box">
          <img
            src={weddingImg}
            alt="Wedding Decoration"
            className="imageFrame-img"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageFrame;