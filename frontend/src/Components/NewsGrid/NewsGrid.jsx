import React from "react";
import "./NewsGrid.css";
import flowerBg from "../../assets/page-1.webp"; // 👈 Use your flower image here

const NewsGrid = () => {
  return (
    <section
      className="news-hero"
      style={{ backgroundImage: `url(${flowerBg})` }}
    >
      <div className="news-hero-overlay"></div>

      <div className="news-hero-content">
        <h1>News Grid</h1>

        <div className="breadcrumb">
          <span>Home</span>
          <span className="breadcrumb-arrow">›</span>
          <span className="active">News</span>
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;