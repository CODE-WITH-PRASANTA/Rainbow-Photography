import React from "react";
import "./HomeTimelessStory.css";

import couple1 from "../../assets/Copule1.webp";
import couple2 from "../../assets/Copule2.webp";

const HomeTimelessStory = () => {
  return (
    <section className="HomeTimelessStory">
      <div className="HomeTimelessStory__background" />

      {/* Decorative gold leaves */}
      <div className="HomeTimelessStory__leaf HomeTimelessStory__leaf--left-top">
        <svg viewBox="0 0 150 220" fill="none">
          <path d="M20 205 Q65 120 125 15" stroke="#B98235" strokeWidth="1.5" />
          <path d="M47 160 Q5 145 8 110 Q40 117 47 160Z" fill="#D6AD6B" fillOpacity=".65" />
          <path d="M47 160 Q22 130 8 110" stroke="#B98235" />
          <path d="M63 135 Q106 127 116 88 Q77 95 63 135Z" fill="#E6C992" fillOpacity=".8" />
          <path d="M63 135 Q91 105 116 88" stroke="#B98235" />
          <path d="M82 96 Q40 85 40 51 Q75 59 82 96Z" fill="#B98A47" fillOpacity=".6" />
          <path d="M82 96 Q61 70 40 51" stroke="#B98235" />
          <path d="M101 65 Q130 60 136 29 Q110 35 101 65Z" fill="#E6C992" />
          <path d="M101 65 Q120 42 136 29" stroke="#B98235" />
        </svg>
      </div>

      <div className="HomeTimelessStory__leaf HomeTimelessStory__leaf--right-top">
        <svg viewBox="0 0 150 220" fill="none">
          <path d="M20 205 Q65 120 125 15" stroke="#B98235" strokeWidth="1.5" />
          <path d="M47 160 Q5 145 8 110 Q40 117 47 160Z" fill="#D6AD6B" fillOpacity=".65" />
          <path d="M63 135 Q106 127 116 88 Q77 95 63 135Z" fill="#E6C992" fillOpacity=".8" />
          <path d="M82 96 Q40 85 40 51 Q75 59 82 96Z" fill="#B98A47" fillOpacity=".6" />
          <path d="M101 65 Q130 60 136 29 Q110 35 101 65Z" fill="#E6C992" />
        </svg>
      </div>

      <div className="HomeTimelessStory__leaf HomeTimelessStory__leaf--left-bottom">
        <svg viewBox="0 0 150 220" fill="none">
          <path d="M20 205 Q65 120 125 15" stroke="#B98235" strokeWidth="1.5" />
          <path d="M47 160 Q5 145 8 110 Q40 117 47 160Z" fill="#D6AD6B" fillOpacity=".65" />
          <path d="M63 135 Q106 127 116 88 Q77 95 63 135Z" fill="#E6C992" fillOpacity=".8" />
          <path d="M82 96 Q40 85 40 51 Q75 59 82 96Z" fill="#B98A47" fillOpacity=".6" />
          <path d="M101 65 Q130 60 136 29 Q110 35 101 65Z" fill="#E6C992" />
        </svg>
      </div>

      <div className="HomeTimelessStory__leaf HomeTimelessStory__leaf--right-bottom">
        <svg viewBox="0 0 150 220" fill="none">
          <path d="M20 205 Q65 120 125 15" stroke="#B98235" strokeWidth="1.5" />
          <path d="M47 160 Q5 145 8 110 Q40 117 47 160Z" fill="#D6AD6B" fillOpacity=".65" />
          <path d="M63 135 Q106 127 116 88 Q77 95 63 135Z" fill="#E6C992" fillOpacity=".8" />
          <path d="M82 96 Q40 85 40 51 Q75 59 82 96Z" fill="#B98A47" fillOpacity=".6" />
          <path d="M101 65 Q130 60 136 29 Q110 35 101 65Z" fill="#E6C992" />
        </svg>
      </div>

      {/* Left wedding photograph */}
      <div className="HomeTimelessStory__photo HomeTimelessStory__photo--left">
        <div className="HomeTimelessStory__photo-frame">
          <img
            src={couple1}
            alt="Bride and groom sharing a romantic wedding moment"
            className="HomeTimelessStory__image"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Center content */}
      <div className="HomeTimelessStory__content">
        <p className="HomeTimelessStory__eyebrow">
          RAINBOW PHOTOGRAPHY
        </p>

        <div className="HomeTimelessStory__camera-divider">
          <span />
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 8H8L10 5H15L17 8H20V19H4V8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="13"
              r="3.2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span />
        </div>

        <h1 className="HomeTimelessStory__title">
          Every Moment,
          <br />
          A <span>Timeless</span> Story
        </h1>

        <p className="HomeTimelessStory__description">
          We capture the love, emotions and unforgettable
          celebrations that make your story unique. From candid
          moments to timeless portraits, we turn your special day
          into memories for a lifetime.
        </p>

        <div className="HomeTimelessStory__ornament">
          <span />
          <svg viewBox="0 0 40 24" fill="none" aria-hidden="true">
            <path
              d="M20 19C16 15 3 10 5 5C7 0 14 5 20 12C26 5 33 0 35 5C37 10 24 15 20 19Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
          </svg>
          <span />
        </div>

        <a
          href="/contact"
          className="HomeTimelessStory__button"
          aria-label="Book your photography session"
        >
          <span>Book Your Session</span>

          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 12H19M13 6L19 12L13 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* Right wedding photograph */}
      <div className="HomeTimelessStory__photo HomeTimelessStory__photo--right">
        <div className="HomeTimelessStory__photo-frame">
          <img
            src={couple2}
            alt="Bride and groom in traditional wedding attire"
            className="HomeTimelessStory__image"
            loading="eager"
          />
        </div>
      </div>

      {/* Floating gold particles */}
      <div className="HomeTimelessStory__gold-particle HomeTimelessStory__gold-particle--one" />
      <div className="HomeTimelessStory__gold-particle HomeTimelessStory__gold-particle--two" />
      <div className="HomeTimelessStory__gold-particle HomeTimelessStory__gold-particle--three" />
    </section>
  );
};

export default HomeTimelessStory;