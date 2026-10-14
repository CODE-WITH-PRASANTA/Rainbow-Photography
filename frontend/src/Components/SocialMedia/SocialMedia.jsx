import React, { useEffect, useMemo, useState } from "react";
import "./SocialMedia.css";

const SocialMedia = () => {
  const base = "social-media";

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const rightImg = useMemo(
    () =>
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    []
  );

  /* ✅ UPDATED GOOGLE MAP (Random Location - Times Square, New York) */
  const mapSrc = useMemo(
    () =>
      "https://www.google.com/maps?q=Times+Square,New+York&output=embed",
    []
  );

  return (
    <section className={`${base} ${animate ? `${base}--in` : ""}`}>
      <div className={`${base}__container`}>
        {/* LEFT SIDE */}
        <div className={`${base}__left`}>
          <div className={`${base}__top`}>
            <div className={`${base}__cards`}>
              <div className={`${base}__card`}>
                <div className={`${base}__iconWrap`}>✉</div>
                <div>
                  <div className={`${base}__title`}>OUR EMAIL</div>
                  <div className={`${base}__value`}>eventify@gmail.com</div>
                </div>
              </div>

              <div className={`${base}__card`}>
                <div className={`${base}__iconWrap`}>☎</div>
                <div>
                  <div className={`${base}__title`}>CALL / MESSAGE</div>
                  <div className={`${base}__value`}>+1 123 456 7890</div>
                </div>
              </div>

              <div className={`${base}__card`}>
                <div className={`${base}__iconWrap`}>📍</div>
                <div>
                  <div className={`${base}__title`}>OUR LOCATION</div>
                  <div className={`${base}__value`}>1800 Abbot Kinney</div>
                </div>
              </div>

              <div className={`${base}__card`}>
                <div className={`${base}__iconWrap`}>📷</div>
                <div>
                  <div className={`${base}__title`}>INSTAGRAM</div>
                  <div className={`${base}__value`}>@eventify.live</div>
                </div>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className={`${base}__mapSection`}>
            <iframe
              className={`${base}__map`}
              title="Google Map"
              src={mapSrc}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className={`${base}__right`}>
          <img src={rightImg} alt="Team" className={`${base}__image`} />
          <div className={`${base}__imageOverlay`} />
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;