import React from "react";
import "./PackageMemories.css";

import couple1 from "../../assets/Copule1.webp";
import couple2 from "../../assets/Copule2.webp";

const PackageMemories = () => {
  return (
    <section className="PackageMemories">
      {/* Background */}
      <div className="PackageMemories__background" />
      <div className="PackageMemories__glow PackageMemories__glow--left" />
      <div className="PackageMemories__glow PackageMemories__glow--right" />

      {/* Decorative gold botanical artwork */}
      <div className="PackageMemories__botanical PackageMemories__botanical--left">
        <svg viewBox="0 0 180 300" fill="none" aria-hidden="true">
          <path d="M15 285 Q78 180 150 18" stroke="#B77A2D" strokeWidth="1.5" />
          <path d="M48 230 Q8 217 9 181 Q42 188 48 230Z" fill="#D8B477" fillOpacity=".8" stroke="#B77A2D" strokeWidth=".7" />
          <path d="M48 230 Q29 204 9 181" stroke="#B77A2D" strokeWidth=".8" />
          <path d="M67 194 Q112 189 124 148 Q82 155 67 194Z" fill="#E5CA98" fillOpacity=".8" stroke="#B77A2D" strokeWidth=".7" />
          <path d="M67 194 Q96 164 124 148" stroke="#B77A2D" strokeWidth=".8" />
          <path d="M87 151 Q43 137 45 100 Q78 109 87 151Z" fill="#C49A5C" fillOpacity=".7" stroke="#B77A2D" strokeWidth=".7" />
          <path d="M87 151 Q66 121 45 100" stroke="#B77A2D" strokeWidth=".8" />
          <path d="M107 108 Q148 103 158 63 Q120 72 107 108Z" fill="#E6CB98" stroke="#B77A2D" strokeWidth=".7" />
          <path d="M107 108 Q135 79 158 63" stroke="#B77A2D" strokeWidth=".8" />
          <path d="M129 65 Q96 54 101 25 Q127 34 129 65Z" fill="#D4B16E" fillOpacity=".75" stroke="#B77A2D" strokeWidth=".7" />
        </svg>
      </div>

      <div className="PackageMemories__botanical PackageMemories__botanical--right">
        <svg viewBox="0 0 180 300" fill="none" aria-hidden="true">
          <path d="M15 285 Q78 180 150 18" stroke="#B77A2D" strokeWidth="1.5" />
          <path d="M48 230 Q8 217 9 181 Q42 188 48 230Z" fill="#D8B477" fillOpacity=".8" stroke="#B77A2D" strokeWidth=".7" />
          <path d="M67 194 Q112 189 124 148 Q82 155 67 194Z" fill="#E5CA98" fillOpacity=".8" stroke="#B77A2D" strokeWidth=".7" />
          <path d="M87 151 Q43 137 45 100 Q78 109 87 151Z" fill="#C49A5C" fillOpacity=".7" stroke="#B77A2D" strokeWidth=".7" />
          <path d="M107 108 Q148 103 158 63 Q120 72 107 108Z" fill="#E6CB98" stroke="#B77A2D" strokeWidth=".7" />
          <path d="M129 65 Q96 54 101 25 Q127 34 129 65Z" fill="#D4B16E" fillOpacity=".75" stroke="#B77A2D" strokeWidth=".7" />
        </svg>
      </div>

      {/* Left photograph */}
      <div className="PackageMemories__photo PackageMemories__photo--left">
        <div className="PackageMemories__photo-border">
          <div className="PackageMemories__photo-inner">
            <img
              src={couple1}
              alt="Wedding couple sharing a romantic moment"
              className="PackageMemories__image"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
        <span className="PackageMemories__photo-caption">
          THE BEGINNING OF FOREVER
        </span>
      </div>

      {/* Central content */}
      <div className="PackageMemories__content">
        <p className="PackageMemories__eyebrow">
          RAINBOW PHOTOGRAPHY
        </p>

        <div className="PackageMemories__camera">
          <span />
          <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M4 9H9L11 6H17L19 9H24V23H4V9Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle
              cx="14"
              cy="16"
              r="4"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          <span />
        </div>

        <h2 className="PackageMemories__title">
          Capturing Moments,
          <br />
          <span>Crafting Memories</span>
        </h2>

        <div className="PackageMemories__heart-divider">
          <span />
          <svg viewBox="0 0 30 28" fill="none" aria-hidden="true">
            <path
              d="M15 24S2 16 2 8C2 1 11 1 15 8C19 1 28 1 28 8C28 16 15 24 15 24Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span />
        </div>

        <p className="PackageMemories__subtitle">
          YOUR WEDDING PHOTOGRAPHY AWAITS
        </p>

        <p className="PackageMemories__description">
          Every love story deserves to be remembered beautifully.
          We capture the joy, emotions, and unforgettable moments
          of your wedding through artistic photography and
          cinematic films. From candid smiles to timeless portraits,
          every detail is preserved with creativity and care.
          Let us turn your wedding memories into a timeless story
          you will cherish forever.
        </p>

        <a
          href="/package"
          className="PackageMemories__button"
        >
          <span>Explore Our Packages</span>
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

        <p className="PackageMemories__signature">
          Every frame tells a story
        </p>
      </div>

      {/* Right photograph */}
      <div className="PackageMemories__photo PackageMemories__photo--right">
        <div className="PackageMemories__photo-border">
          <div className="PackageMemories__photo-inner">
            <img
              src={couple2}
              alt="Bride and groom celebrating their wedding"
              className="PackageMemories__image"
              loading="eager"
            />
          </div>
        </div>
        <span className="PackageMemories__photo-caption">
          MOMENTS TO TREASURE
        </span>
      </div>

      {/* Floating decorative particles */}
      <span className="PackageMemories__particle PackageMemories__particle--one" />
      <span className="PackageMemories__particle PackageMemories__particle--two" />
      <span className="PackageMemories__particle PackageMemories__particle--three" />
      <span className="PackageMemories__particle PackageMemories__particle--four" />
    </section>
  );
};

export default PackageMemories;