import React from "react";
import "./DesginCompany.css";

import logo1 from "../../assets/image-17.webp";
import logo2 from "../../assets/image-18.webp";
import logo3 from "../../assets/image-19.webp";
import logo4 from "../../assets/image-20.webp";
import logo5 from "../../assets/image-21.webp";


import rightLeaf from "../../assets/icon-flower-23.webp";

const DesginCompany = () => {
  return (
    <section className="designCompanies-section">

      {/* Decorative Floating Leaves */}
      <div className="designCompanies-decor">

        

        <img
          src={rightLeaf}
          alt=""
          className="designCompanies-leaf designCompanies-leaf-right"
        />

      </div>

      <div className="designCompanies-container">

        <h1 className="designCompanies-title">
          Wedding Design Companies
        </h1>

        <div className="designCompanies-logo-wrapper">
          <div className="designCompanies-logo-track">

            <img src={logo1} alt="company logo" />
            <img src={logo2} alt="company logo" />
            <img src={logo3} alt="company logo" />
            <img src={logo4} alt="company logo" />
            <img src={logo5} alt="company logo" />

            {/* duplicate for infinite scroll */}
            <img src={logo1} alt="company logo" />
            <img src={logo2} alt="company logo" />
            <img src={logo3} alt="company logo" />
            <img src={logo4} alt="company logo" />
            <img src={logo5} alt="company logo" />

          </div>
        </div>

      </div>
    </section>
  );
};

export default DesginCompany;