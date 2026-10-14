import React, { useState } from "react";
import "./PhotoSection.css";

import img1 from "../../assets/gallery3-1.webp";
import img2 from "../../assets/gallery3-3.webp";
import img3 from "../../assets/gallery3-4.webp";
import img4 from "../../assets/gallery3-5.webp";
import img5 from "../../assets/gallery3-6.webp";
import img6 from "../../assets/gallery3-7.webp";

const PhotoSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const photos = [
    { id: 1, src: img1, type: "tall" },
    { id: 2, src: img2, type: "small" },
    { id: 3, src: img3, type: "wide" },
    { id: 4, src: img4, type: "wide" },
    { id: 5, src: img5, type: "tall" },
    { id: 6, src: img6, type: "small" },
  ];

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  return (
    <section className="gallery-wrapper">
      <header className="gallery-header">
        <h2 className="gallery-title">Wedding Photography</h2>
        <p className="gallery-subtitle">
          Capturing the most beautiful moments with elegance & emotion.
        </p>
      </header>

      <div className="gallery-grid" onScroll={handleScroll}>
        {photos.map((photo) => (
          <div key={photo.id} className={`gallery-item ${photo.type}`}>
            <div className="image-container">
              <img src={photo.src} alt="Wedding Gallery" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (Mobile Only via CSS) */}
      <div className="pagination-dots">
        {photos.map((_, index) => (
          <span
            key={index}
            className={`dot ${activeIndex === index ? "active" : ""}`}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default PhotoSection;