import React from "react";
import "./HomeServiceSection.css";

import {
  FiCamera,
  FiHeart,
  FiUserCheck,
  FiVideo
} from "react-icons/fi";

/* decorative */
import leafLeft from "../../assets/Leave-1.webp";       // left floating leaf
import leafRight from "../../assets/Leave-2.webp";      // right bottom floating leaf
import leafTopRight from "../../assets/iconLeaf-1.webp"; // top right header leaf
import cardLeaf from "../../assets/cardLeaf-1.webp";
import decoFlower from "../../assets/TwinFlower-1.webp";

/* reference images */
import sideImgTop from "../../assets/Event-3.webp";     
import sideImgBottom from "../../assets/Event-4.webp";

const services = [
  {
    icon: <FiCamera />,
    title: "Candid Wedding Photography",
    text: "Unobtrusively capturing genuine emotions, unscripted laughter, and tearful joys as they naturally unfold."
  },
  {
    icon: <FiHeart />,
    title: "Pre-Wedding & Engagements",
    text: "Romantic, styled couple sessions at breathtaking scenic locations to tell the authentic beginning of your story."
  },
  {
    icon: <FiUserCheck />,
    title: "Bridal & Fine-Art Portraits",
    text: "High-fashion editorial portraits capturing detailed adornments, royal attire, and delicate solo moments."
  },
  {
    icon: <FiVideo />,
    title: "Cinematic Wedding Films",
    text: "High-definition teaser trailers and full-length documentary feature films with emotional custom soundscapes."
  }
];

const HomeServiceSection = () => {
  return (
    <section className="wServices" aria-labelledby="services-title">

      {/* LEFT FLOATING LEAF */}
      <img
        src={leafLeft}
        alt=""
        aria-hidden="true"
        className="wServices__leaf wServices__leaf--left"
      />

      {/* RIGHT BOTTOM FLOATING LEAF */}
      <img
        src={leafRight}
        alt=""
        aria-hidden="true"
        className="wServices__leaf wServices__leaf--right"
      />

      {/* ===== HEADER ===== */}
      <div className="wServices__header">
        <p className="wServices__label">SERVICES BY RAINBOW PHOTOGRAPHY</p>

        <h2 id="services-title" className="wServices__title">
          Framing Every Emotion <br /> Into Timeless Masterpieces
        </h2>

        <img 
          src={decoFlower} 
          alt="" 
          aria-hidden="true" 
          className="wServices__flower" 
        />
      </div>

      {/* TOP RIGHT HEADER FLOATING LEAF */}
      <img
        src={leafTopRight}
        alt=""
        aria-hidden="true"
        className="wServices__leaf wServices__leaf--topRight"
      />

      {/* ===== GRID ===== */}
      <div className="wServices__grid">

        {/* LEFT TOP IMAGE */}
        <div className="wServices__img wServices__img--top">
          <img 
            src={sideImgTop} 
            alt="Bride getting ready - Rainbow Photography" 
            loading="lazy" 
          />
        </div>

        {/* CARDS */}
        {services.map((service, index) => (
          <article key={index} className="wServices__card">
            <img 
              src={cardLeaf} 
              alt="" 
              aria-hidden="true" 
              className="wServices__cardLeaf" 
            />

            <div className="wServices__iconWrap">
              {service.icon}
            </div>

            <h3 className="wServices__cardTitle">{service.title}</h3>
            <p className="wServices__cardText">{service.text}</p>
          </article>
        ))}

        {/* RIGHT BOTTOM IMAGE */}
        <div className="wServices__img wServices__img--bottom">
          <img 
            src={sideImgBottom} 
            alt="Wedding couple celebration moment" 
            loading="lazy" 
          />
        </div>

      </div>
    </section>
  );
};

export default HomeServiceSection;