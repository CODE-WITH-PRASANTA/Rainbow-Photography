import React from "react";
import "./HomeHeading.css";

import flower from "../../assets/Flower-33.webp"; // ⭐ import your flower image

const words = ["WEDDING", "PHOTOGRAPHY"];

const HomeHeading = () => {
  return (
    <section className="HomeHeading">
      <div className="HomeHeading__track">

        {/* duplicate for infinite loop */}
        {[...words, ...words].map((word, i) => (
          <div className="HomeHeading__item" key={i}>
            <h2 className="HomeHeading__text">{word}</h2>
            <img src={flower} alt="flower" className="HomeHeading__flower" />
          </div>
        ))}

      </div>
    </section>
  );
};

export default HomeHeading;