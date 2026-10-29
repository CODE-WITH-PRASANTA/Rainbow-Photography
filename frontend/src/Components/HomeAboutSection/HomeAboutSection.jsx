import React from "react";
import "./HomeAboutSection.css";

/* images */
import mainImg from "../../assets/Event-2.webp";   // primary wedding couple / stage image
import peopleImg from "../../assets/Event-1.webp"; // candid portrait / emotion image
import leaf1 from "../../assets/Leave-1.webp";
import leaf2 from "../../assets/Leave-2.webp";

const HomeAboutSection = () => {
  return (
    <section className="aboutWedding" aria-labelledby="about-title">
      <div className="aboutWedding__container">

        {/* LEFT CONTENT */}
        <div className="aboutWedding__content">
          <span className="aboutWedding__label">
            WELCOME TO RAINBOW PHOTOGRAPHY
          </span>

          <h2 id="about-title" className="aboutWedding__title">
            Capturing Timeless <br /> Wedding Stories
          </h2>

          <p className="aboutWedding__desc">
            At Rainbow Photography, we believe every love story carries its own spectrum of vibrant emotions. 
            From the quiet stolen glances to the energetic celebration on the dance floor, 
            we document genuine, timeless memories that let you relive your most sacred day for generations to come.
          </p>

          <div className="aboutWedding__block">
            <h4>12+ Years Behind the Lens</h4>
            <p>
              Over a decade of preserving heirloom-quality moments across luxury destinations, cultural celebrations, and intimate elopements.
            </p>
          </div>

          <div className="aboutWedding__block">
            <h4>Artistic & Candid Approach</h4>
            <p>
              We blend editorial-style portraiture with unobtrusive documentary coverage, ensuring you stay fully present while we freeze time.
            </p>
          </div>

          <button 
            type="button" 
            className="aboutWedding__btn"
            onClick={() => {
              const contactElement = document.getElementById("contact");
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <span>Book a Consultation</span>
          </button>
        </div>

        {/* RIGHT IMAGES */}
        <div className="aboutWedding__media" aria-hidden="true">
          <img 
            src={leaf1} 
            className="aboutWedding__leaf aboutWedding__leaf--top" 
            alt="" 
            loading="lazy"
          />

          <div className="aboutWedding__imgWrap aboutWedding__imgWrap--main">
            <img 
              src={mainImg} 
              alt="Romantic wedding celebration captured by Rainbow Photography" 
              loading="lazy"
            />
          </div>

          <div className="aboutWedding__imgWrap aboutWedding__imgWrap--people">
            <img 
              src={peopleImg} 
              alt="Candid emotional moment between guests at wedding" 
              loading="lazy"
            />
          </div>

          {/* Decorative Experience Badge */}
          <div className="aboutWedding__badge">
            <span className="aboutWedding__badgeNumber">500+</span>
            <span className="aboutWedding__badgeText">Weddings Documented</span>
          </div>

          <img 
            src={leaf2} 
            className="aboutWedding__leaf aboutWedding__leaf--side" 
            alt="" 
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
};

export default HomeAboutSection;