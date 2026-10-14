import React from "react";
import "./HomePricing.css";
import { FiCheck } from "react-icons/fi";

/* couple images */
import couple1 from "../../assets/Price-1.webp";
import couple2 from "../../assets/Price-2.webp";

/* flower images */
import flowerCard from "../../assets/LeftFlower-2.webp";
import flowerHeading from "../../assets/TwinFlower-1.webp";

const data = [
  {
    title: "Full Wedding",
    img: couple1,
  },
  {
    title: "Religious Wedding",
    img: couple2,
  },
];

const HomePricing = () => {
  return (
    <section className="HomePricing">

      {/* ===== HEADING ===== */}
      <div className="HomePricing__heading">
        <span className="HomePricing__label">
          WEDDING PRICING PLANS
        </span>

        <h2 className="HomePricing__mainTitle">
          Best Pricing Packages
        </h2>

        <img
          src={flowerHeading}
          alt=""
          className="HomePricing__headingFlower"
        />
      </div>

      {/* ===== CARDS ===== */}
      <div className="HomePricing__container">

        {data.map((card, i) => (
          <div className="HomePricing__card" key={i}>

            {/* flower bg */}
            <img src={flowerCard} className="HomePricing__flower" alt="" />

            {/* couple image */}
            <div className="HomePricing__imageWrap">
              <img src={card.img} alt="" />
            </div>

            {/* content */}
            <div className="HomePricing__content">
              <h3 className="HomePricing__title">{card.title}</h3>

              <ul className="HomePricing__list">
                <li><FiCheck /> Blairquhan Castle</li>
                <li><FiCheck /> Three-course wedding meal</li>
                <li><FiCheck /> Evening buffet with tea</li>
                <li><FiCheck /> One wedding per day</li>
                <li><FiCheck /> Regency architecture</li>
              </ul>

              <div className="HomePricing__price">
                <strong>$3400</strong>
                <span>/1 Night Package</span>
              </div>

              <button className="HomePricing__btn">
                Get Package
              </button>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
};

export default HomePricing;