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
    title: "Full Wedding",
    img: couple1,
  },
  {
    title: "Religious Wedding",
    img: couple2,
  },
];

const Package = () => {
  return (
    <section className="Package">

      {/* ===== HEADING ===== */}
      <div className="PPackage__heading">
        <span className="PPackage__label">
          WEDDING PRICING PLANS
        </span>

        <h2 className="PPackage__mainTitle">
          Best Pricing Packages
        </h2>

        <img
          src={flowerHeading}
          alt=""
          className="PPackage__headingFlower"
        />
      </div>

      {/* ===== CARDS ===== */}
      <div className="PPackage__container">
        {data.map((card, i) => (
          <div className="PPackage__card" key={i}>

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
                <li><FiCheck /> Blairquhan Castle</li>
                <li><FiCheck /> Three-course wedding meal</li>
                <li><FiCheck /> Evening buffet with tea</li>
                <li><FiCheck /> One wedding per day</li>
                <li><FiCheck /> Regency architecture</li>
              </ul>

              <div className="PPackage__price">
                <strong>$3400</strong>
                <span>/1 Night Package</span>
              </div>

              <button className="PPackage__btn">
                Get Package
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};

export default Package;