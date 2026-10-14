// WonderfullCopule.jsx
import React, { useEffect } from "react";
import "./WonderfullCopule.css";

import event1 from "../../assets/Copule1.webp";
import event2 from "../../assets/Copule2.webp";
import floral from "../../assets/iconflowers-3.webp";

const WonderfullCopule = () => {
  // ✅ component base class
  const base = "wonderful-couple";

  useEffect(() => {
    const els = document.querySelectorAll(`.${base}__animate`);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(`${base}__show`);
        });
      },
      { threshold: 0.2 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className={base}>
      {/* Decorative right floral */}
      <img src={floral} alt="" className={`${base}__floral`} />

      {/* Watermark */}
      <div className={`${base}__watermark`}>WENDOLA</div>

      <div className={`${base}__container`}>
        <div className={`${base}__grid`}>
          {/* LEFT */}
          <div className={`${base}__left ${base}__animate`}>
            <div className={`${base}__imgSmall`}>
              <img src={event1} alt="Wedding couple" />
            </div>

            <div className={`${base}__quote`}>
              <p>
                TODAY, WE CELEBRATE THE LOVE
                <br />
                AND COMMITMENT OF THIS
                <br />
                WONDERFUL COUPLE.
              </p>

              <button className={`${base}__btn`} type="button">
                VIEW MAP
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className={`${base}__right`}>
            <div className={`${base}__text ${base}__animate`}>
              <p className={`${base}__desc`}>
                From the vibrant flowers and trees to the gently flowing streams,
                this park provides the perfect backdrop for the joyous occasion.
                As we stand here today, surrounded by the beauty of this park, we
                are reminded of the enduring power of the love.
              </p>

              <div className={`${base}__time`}>
                <span className={`${base}__clock`} aria-hidden="true">
                  {/* simple clock icon */}
                  <svg viewBox="0 0 24 24" width="22" height="22">
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
                  10:30 AM IN THE QUARE VILLA
                </span>
              </div>
            </div>

            <div className={`${base}__imgLarge ${base}__animate`}>
              <img src={event2} alt="Wedding ceremony" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WonderfullCopule;