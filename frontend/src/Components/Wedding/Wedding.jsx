import React from "react";
import "./Wedding.css";
import WeddingHero from "../../assets/news-details.webp";

const Wedding = () => {
  return (
    <div className="wedding-container">

      {/* HERO IMAGE */}
      <div className="wedding-hero-section">
        <img 
          src={WeddingHero} 
          alt="Wedding Couple" 
          className="wedding-hero-img" 
        />

        {/* DATE BADGE */}
        <div className="wedding-date">
          <h2>28</h2>
          <span>AUG</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="wedding-content">
        
        {/* META INFO */}
        <div className="wedding-meta">
          <span><i className="fas fa-user"></i> Admin</span>
          <span><i className="fas fa-comments"></i> 02 Comments</span>
        </div>

        {/* TITLE */}
        <h1 className="wedding-title">
          COUPLE'S WEDDING TURNS EMOTIONAL
        </h1>

        {/* PARAGRAPHS */}
        <p>
          Mauris non dignissim purus, ac commodo diam. Donec sit amet
          lacinia nulla. Aliquam quis purus in justo pulvinar tempor.
          Aliquam tellus nulla, sollicitudin at euismod nec, feugiat at nisi. 
          Quisque vitae odio nec lacus interdum tempus.
        </p>

        <p>
          Mauris non dignissim purus, ac commodo diam. Donec sit amet
          lacinia nulla. Aliquam quis purus in justo pulvinar tempor.
          Aliquam tellus nulla, sollicitudin at euismod nec.
        </p>

        <p>
          Mauris non dignissim purus, ac commodo diam. Donec sit amet
          lacinia nulla. Aliquam quis purus in justo pulvinar tempor.
          Aliquam tellus nulla, sollicitudin at euismod nec.
        </p>

      </div>
    </div>
  );
};

export default Wedding;