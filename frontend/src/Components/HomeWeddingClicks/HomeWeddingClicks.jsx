import React from "react";
import "./HomeWeddingClicks.css";
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap" rel="stylesheet"></link>

/* ===== IMPORT IMAGES ===== */
import img1 from "../../assets/Gal-1.webp";
import img2 from "../../assets/Gal-2.webp";
import img3 from "../../assets/Gal-3.webp";
import img4 from "../../assets/Gal-4.webp";
import img5 from "../../assets/Gal-5.webp";
import img6 from "../../assets/Gal-6.webp";

/* decorative left image */
import decorLeft from "../../assets/Flower-18.webp";

const HomeWedingClicks = () => {
  return (
    <section className="HomeWedingClicks">

      {/* background split */}
      <div className="HomeWedingClicks__bg"></div>

      {/* decorative floating image */}
      <img
        src={decorLeft}
        alt=""
        className="HomeWedingClicks__decor"
      />

      <div className="HomeWedingClicks__container">

        <div className="HomeWedingClicks__header">
          <span className="HomeWedingClicks__label">
            SOME BEAUTIFUL MEMORIES
          </span>

          <h2 className="HomeWedingClicks__title">
            Beautiful Wedding Clicks
          </h2>
        </div>

        {/* grid */}
        <div className="HomeWedingClicks__grid">

          <div className="HomeWedingClicks__item"><img src={img1} /></div>
          <div className="HomeWedingClicks__item HomeWedingClicks__wide"><img src={img2} /></div>
          <div className="HomeWedingClicks__item"><img src={img3} /></div>

          <div className="HomeWedingClicks__item HomeWedingClicks__wide"><img src={img4} /></div>
          <div className="HomeWedingClicks__item"><img src={img5} /></div>
          <div className="HomeWedingClicks__item"><img src={img6} /></div>

        </div>
      </div>
    </section>
  );
};

export default HomeWedingClicks;