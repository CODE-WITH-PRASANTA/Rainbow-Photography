import React from "react";
import "./HomeHeroSection.css";

import heroBg from "../../assets/Bg-1.webp";

import flowerLeftBig from "../../assets/MainF-2.webp";
import flowerRightFade from "../../assets/MainF-1.webp";
import twinFlower from "../../assets/TwinFlower-1.webp";
import yellowFlower from "../../assets/yellow-1.webp";
import dividerImg from "../../assets/Devider.webp";

import { FiPhone, FiMail } from "react-icons/fi";
import { FaFacebookF, FaGooglePlusG } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const HomeHeroSection = () => {
  return (
    <section className="weddingHero">

      {/* BG */}
      <div
        className="weddingHero__bg"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* FLOWERS */}
      <img src={flowerLeftBig} className="weddingHero__flower weddingHero__flower--leftBig" alt="" />
      <img src={flowerRightFade} className="weddingHero__flower weddingHero__flower--rightFade" alt="" />
      <img src={twinFlower} className="weddingHero__flower weddingHero__flower--twin" alt="" />
      <img src={yellowFlower} className="weddingHero__flower weddingHero__flower--yellow" alt="" />

      {/* TOP BAR */}
      <div className="weddingHero__topBar">
        <div className="weddingHero__contact">
          <span className="weddingHero__contactItem">
            <FiPhone />
            Phone No : +1 836 384 493
          </span>

          <span className="weddingHero__contactItem">
            <FiMail />
            Email Address : username@domain.com
          </span>
        </div>

       <div className="weddingHero__social">
  <button className="weddingHero__socialBtn weddingHero__socialBtn--facebook">
    <FaFacebookF />
  </button>

  <button className="weddingHero__socialBtn weddingHero__socialBtn--google">
    <FaGooglePlusG />
  </button>

  <button className="weddingHero__socialBtn weddingHero__socialBtn--close">
    <RxCross2 />
  </button>
</div>
      </div>

      {/* CONTENT */}
      <div className="weddingHero__content">

        <img src={dividerImg} className="weddingHero__dividerImg" alt="" />

        <h1 className="weddingHero__title">
          Wedding & Event Planner <br />
          <span>For Colorful Couples</span>
        </h1>

        <p className="weddingHero__subtitle">
          No matter your dreams - we can assist you in planning your
        </p>
      </div>
    </section>
  );
};

export default HomeHeroSection;