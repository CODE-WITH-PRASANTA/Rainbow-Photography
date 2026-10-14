import React from "react";
import "./HomeServiceSection.css";

import {
  FiClipboard,
  FiSmile,
  FiShoppingBag,
  FiCoffee
} from "react-icons/fi";

/* decorative */
import leafLeft from "../../assets/Leave-1.webp";      // left floating leaf
import leafRight from "../../assets/Leave-2.webp";     // right bottom floating leaf
import leafTopRight from "../../assets/iconLeaf-1.webp";  // ⭐ top right header leaf
import cardLeaf from "../../assets/cardLeaf-1.webp";
import decoFlower from "../../assets/TwinFlower-1.webp";

/* reference images */
import sideImgTop from "../../assets/service4-1.webp";     
import sideImgBottom from "../../assets/service4-2.webp";

const services = [
  {
    icon: <FiClipboard />,
    title: "Wedding Planners",
    text: "From the vibrant flowers and trees to the gently flowing streams, this park provides the perfect."
  },
  {
    icon: <FiSmile />,
    title: "Kids Party",
    text: "From the vibrant flowers and trees to the gently flowing streams, this park provides the perfect."
  },
  {
    icon: <FiShoppingBag />,
    title: "Bridal Shower",
    text: "From the vibrant flowers and trees to the gently flowing streams, this park provides the perfect."
  },
  {
    icon: <FiCoffee />,
    title: "Rehearsal Dinner",
    text: "From the vibrant flowers and trees to the gently flowing streams, this park provides the perfect."
  }
];

const HomeServiceSection = () => {
  return (
    <section className="wServices">

      {/* LEFT FLOATING LEAF */}
      <img
        src={leafLeft}
        alt=""
        className="wServices__leaf wServices__leaf--left"
      />

      {/* RIGHT BOTTOM FLOATING LEAF */}
      <img
        src={leafRight}
        alt=""
        className="wServices__leaf wServices__leaf--right"
      />

      {/* ===== HEADER ===== */}
      <div className="wServices__header">
        <p className="wServices__label">WEDDING SERVICES FOR YOU</p>

        <h2 className="wServices__title">
          We Design Your Special Day <br /> & Event Plans
        </h2>

        <img src={decoFlower} alt="" className="wServices__flower" />
      </div>

      {/* ⭐ TOP RIGHT HEADER FLOATING LEAF (IMPORTANT POSITION) */}
      <img
        src={leafTopRight}
        alt=""
        className="wServices__leaf wServices__leaf--topRight"
      />

      {/* ===== GRID ===== */}
      <div className="wServices__grid">

        {/* LEFT TOP IMAGE */}
        <div className="wServices__img wServices__img--top">
          <img src={sideImgTop} alt="" />
        </div>

        {/* CARDS */}
        {services.map((s, i) => (
          <div key={i} className="wServices__card">

            <img src={cardLeaf} alt="" className="wServices__cardLeaf" />

            <div className="wServices__iconWrap">
              {s.icon}
            </div>

            <h3 className="wServices__cardTitle">{s.title}</h3>
            <p className="wServices__cardText">{s.text}</p>
          </div>
        ))}

        {/* RIGHT BOTTOM IMAGE */}
        <div className="wServices__img wServices__img--bottom">
          <img src={sideImgBottom} alt="" />
        </div>

      </div>
    </section>
  );
};

export default HomeServiceSection;