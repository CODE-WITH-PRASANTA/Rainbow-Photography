// WonderfullCopule.jsx
import React, { useEffect } from "react";
import "./WonderfullCopule.css";

import event1 from "../../assets/Price-1.webp";
import event2 from "../../assets/Price-2.webp";
import floral from "../../assets/iconflowers-3.webp";

const WonderfullCopule = () => {
  const base = "wonderful-couple";

  useEffect(() => {
    const els = document.querySelectorAll(`.${base}__animate`);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(`${base}__show`);
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [base]);

  return (
    <section className={base} aria-labelledby="featured-story-title">
      {/* Decorative right floral */}
      <img
        src={floral}
        alt=""
        aria-hidden="true"
        className={`${base}__floral`}
        loading="lazy"
      />

      {/* Watermark branding */}
      <div className={`${base}__watermark`} aria-hidden="true">
        RAINBOW
      </div>

      <div className={`${base}__container`}>
        <div className={`${base}__grid`}>
          {/* LEFT COLUMN */}
          <div className={`${base}__left ${base}__animate`}>
            <div className={`${base}__imgSmall`}>
              <img
                src={event1}
                alt="Romantic portrait of an intimate wedding couple by Rainbow Photography"
                loading="lazy"
              />
            </div>

            <div className={`${base}__quote`}>
              <span className={`${base}__tag`}>FEATURED LOVE STORY</span>
              <p>
                TWO SOULS, ONE HEARTBEAT.
                <br />
                EVERY FRAME WE CAPTURE IS A
                <br />
                POEM OF ETERNAL PROMISES.
              </p>

              <a
                href="#portfolio"
                className={`${base}__btn`}
                aria-label="Explore more featured wedding stories and gallery"
              >
                <span>VIEW GALLERY</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={`${base}__right`}>
            <div className={`${base}__text ${base}__animate`}>
              <h2 id="featured-story-title" className={`${base}__heading`}>
                Framing Pure Emotion, Lighting & Love
              </h2>

              <p className={`${base}__desc`}>
                From the gentle morning prep jitters to the triumphant sacred vows,
                Rainbow Photography preserves every subtle nuance with delicate artistic care.
                We craft evocative, cinematic visual heirlooms where natural light, genuine
                unscripted laughter, and timeless romance shine effortlessly.
              </p>

              <div className={`${base}__time`}>
                <span className={`${base}__clock`} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M12 8v5l3 2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <span className={`${base}__timeText`}>
                  DESTINATION & ROYAL WEDDING SPECIALISTS
                </span>
              </div>
            </div>

            <div className={`${base}__imgLarge ${base}__animate`}>
              <img
                src={event2}
                alt="Cinematic outdoor wedding celebration captured by Rainbow Photography"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WonderfullCopule;