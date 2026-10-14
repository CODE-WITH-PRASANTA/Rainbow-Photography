import React, { useEffect, useMemo, useRef, useState } from "react";
import "./OurService.css";

import img1 from "../../assets/image-1.webp";
import img2 from "../../assets/image-2.webp";
import img3 from "../../assets/image-3.webp";
import img4 from "../../assets/image-4.webp";

const OurService = () => {
  const base = "our-service";
  const wrapRef = useRef(null);

  const services = useMemo(
    () => [
      { id: 1, title: "Wedding Dress", img: img1 },
      { id: 2, title: "Bridal Bouquets", img: img2 },
      { id: 3, title: "Cake Decoration", img: img3 },
      { id: 4, title: "Event Planning", img: img4 },
    ],
    []
  );

  // ✅ reveal animation on scroll
  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    const items = root.querySelectorAll(`.${base}__reveal`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(`${base}__reveal--in`);
        });
      },
      { threshold: 0.18 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ✅ mobile pagination
  const [active, setActive] = useState(0);
  const total = services.length;

  const go = (idx) => setActive((idx + total) % total);
  const next = () => setActive((p) => (p + 1) % total);
  const prev = () => setActive((p) => (p - 1 + total) % total);

  // ✅ keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={base} ref={wrapRef}>
      <div className={`${base}__container`}>
        {/* TOP */}
        <header className={`${base}__head ${base}__reveal`}>
          <h2 className={`${base}__title`}>Our Awesome Services For You</h2>

          <p className={`${base}__sub`}>
            From intimate gatherings to grand luxury weddings, we bring together
            creativity, organization, and passion to design every detail with
            precision.
          </p>
        </header>

        {/* DESKTOP / LAPTOP GRID */}
        <div className={`${base}__grid ${base}__grid--desktop`}>
          {services.map((s, i) => (
            <article
              key={s.id}
              className={`${base}__card ${base}__reveal`}
              style={{ transitionDelay: `${140 + i * 110}ms` }}
            >
              <div className={`${base}__ring`} aria-hidden="true">
                <div className={`${base}__ringInner`}>
                  <img className={`${base}__img`} src={s.img} alt={s.title} />
                </div>
              </div>
              <h3 className={`${base}__cardTitle`}>{s.title}</h3>
            </article>
          ))}
        </div>

        {/* ✅ MOBILE PAGINATION (proper) */}
        <div className={`${base}__mobile ${base}__reveal`}>
          <div className={`${base}__slider`}>
            {/* viewport */}
            <div className={`${base}__viewport`}>
              <div
                className={`${base}__track`}
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {services.map((s) => (
                  <div key={s.id} className={`${base}__slide`}>
                    <article className={`${base}__card ${base}__card--mobile`}>
                      <div className={`${base}__ring`}>
                        <div className={`${base}__ringInner`}>
                          <img className={`${base}__img`} src={s.img} alt={s.title} />
                        </div>
                      </div>
                      <h3 className={`${base}__cardTitle`}>{s.title}</h3>
                    </article>
                  </div>
                ))}
              </div>

              {/* arrows overlay */}
              <button
                type="button"
                className={`${base}__nav ${base}__nav--prev`}
                onClick={prev}
                aria-label="Previous service"
              >
                ‹
              </button>

              <button
                type="button"
                className={`${base}__nav ${base}__nav--next`}
                onClick={next}
                aria-label="Next service"
              >
                ›
              </button>
            </div>

            {/* dots */}
            <div className={`${base}__dots`} role="tablist" aria-label="Service pages">
              {services.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${base}__dot ${i === active ? `${base}__dot--active` : ""}`}
                  onClick={() => go(i)}
                  aria-label={`Go to service ${i + 1}`}
                  aria-current={i === active ? "true" : "false"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurService;