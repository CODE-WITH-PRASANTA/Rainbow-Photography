import React from "react";
import "./RSVPWedingHero.css";

/* IMPORT IMAGES */
import backgroundImage from "../../assets/Background-img.webp";
import leftFlower from "../../assets/cta-flowers.webp";
import topIcon from "../../assets/icon-heart-2.webp";

const RSVPWedingHero = () => {
  return (
    <section
      className="WeddingHero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="WeddingHero-overlay"></div>

      {/* Left Flower Decoration */}
      <img
        src={leftFlower}
        alt="Flower"
        className="WeddingHero-leftFlower"
      />

      <div className="WeddingHero-content">
        <img
          src={topIcon}
          alt="Wedding Rings"
          className="WeddingHero-icon"
        />

        <h1 className="WeddingHero-title">
          Happy Wedding Day!!! <br />
          Can’t Wait To Watch You Marry
        </h1>

        <p className="WeddingHero-subtitle">
          Please RSVP by November the 14th, let us know you're coming!
        </p>
      </div>
    </section>
  );
};

export default RSVPWedingHero;