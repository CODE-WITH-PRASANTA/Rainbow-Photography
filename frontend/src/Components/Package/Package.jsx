import React from "react";
import "./Package.css";
import { FiCheck } from "react-icons/fi";

/* couple images */
import couple1 from "../../assets/Price-1.webp";
import couple2 from "../../assets/Price-2.webp";

/* flower images */
import flowerCard from "../../assets/LeftFlower-2.webp";
import flowerHeading from "../../assets/TwinFlower-1.webp";

const data = [
  {
    id: 1,
    title: "Full Wedding",
    img: couple1,
    price: 250000,
    period: "/1 Night Package",
    features: [
      "Blairquhan Castle",
      "Three-course wedding meal",
      "Evening buffet with tea",
      "One wedding per day",
      "Regency architecture",
    ],
  },
  {
    id: 2,
    title: "Religious Wedding",
    img: couple2,
    price: 180000,
    period: "/1 Night Package",
    features: [
      "Blairquhan Castle",
      "Three-course wedding meal",
      "Evening buffet with tea",
      "One wedding per day",
      "Regency architecture",
    ],
  },
];

// Formats numbers according to Indian numbering standards (₹2,50,000)
const formatINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Package = () => {
  return (
    <section className="Package">
      {/* ===== HEADING ===== */}
      <div className="PPackage__heading">
        <span className="PPackage__label">WEDDING PRICING PLANS</span>
        <h2 className="PPackage__mainTitle">Best Pricing Packages</h2>
        <img
          src={flowerHeading}
          alt=""
          className="PPackage__headingFlower"
        />
      </div>

      {/* ===== CARDS ===== */}
      <div className="PPackage__container">
        {data.map((card) => (
          <div className="PPackage__card" key={card.id}>
            {/* flower background */}
            <img
              src={flowerCard}
              className="PPackage__flower"
              alt=""
            />

            {/* couple image */}
            <div className="PPackage__imageWrap">
              <img src={card.img} alt={card.title} />
            </div>

            {/* content */}
            <div className="PPackage__content">
              <h3 className="PPackage__title">{card.title}</h3>

              <ul className="PPackage__list">
                {card.features.map((feature, idx) => (
                  <li key={idx}>
                    <FiCheck /> {feature}
                  </li>
                ))}
              </ul>

              <div className="PPackage__price">
                <strong>{formatINR(card.price)}</strong>
                <span>{card.period}</span>
              </div>

              <button className="PPackage__btn">Get Package</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Package;