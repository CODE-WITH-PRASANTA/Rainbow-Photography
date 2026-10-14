import React from "react";
import "./WeddingCompanies.css";

import logo1 from "../../assets/image-17.webp";
import logo2 from "../../assets/image-18.webp";
import logo3 from "../../assets/image-19.webp";
import logo4 from "../../assets/image-20.webp";
import logo5 from "../../assets/image-21.webp";

import rightTop from "../../assets/icon-flower-23.webp";


const WeddingCompanies = () => {
  return (
    <section className="WeddingCompaniessection">

      {/* Decorative Floating Leaves */}
      <div className="WeddingCompaniesdecor">

        <img
          
          alt=""
          className="WeddingCompaniesleaf WeddingCompaniesleaf-left"
        />

        <img
          src={rightTop}
          alt=""
          className="WeddingCompaniesleaf WeddingCompaniesleaf-right"
        />

      </div>

      <div className="WeddingCompaniescontainer">
        <h2 className="WeddingCompaniestitle">
          Wedding Design Companies
        </h2>

        <div className="WeddingCompanieslogo-wrapper">
          <div className="WeddingCompanieslogo-track">

            <img src={logo1} alt="" />
            <img src={logo2} alt="" />
            <img src={logo3} alt="" />
            <img src={logo4} alt="" />
            <img src={logo5} alt="" />

            {/* duplicate for infinity */}
            <img src={logo1} alt="" />
            <img src={logo2} alt="" />
            <img src={logo3} alt="" />
            <img src={logo4} alt="" />
            <img src={logo5} alt="" />

          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingCompanies;