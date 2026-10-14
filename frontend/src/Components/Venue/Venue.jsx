import React, { useEffect, useMemo, useRef } from "react";
import "./Venue.css";

// ✅ Use your own icons (replace paths if different)
import ringIcon from "../../assets/services2-1.webp";
import diningIcon from "../../assets/services2-2.webp";
import cameraIcon from "../../assets/services2-3.webp";

const Venue = () => {
  // ✅ component base class name
  const base = "venue";
  const wrapRef = useRef(null);

  const cards = useMemo(
    () => [
      { id: 1, tag: "VENUE", title: "THE ORCHARD", icon: ringIcon },
      { id: 2, tag: "DINING", title: "LUNCH TOGETHER", icon: diningIcon },
      { id: 3, tag: "AFTER PARTY", title: "PHOTOGRAPHY", icon: cameraIcon },
      { id: 4, tag: "DINING", title: "CATERING SERVICES", icon: diningIcon },
      { id: 5, tag: "VENUE", title: "THE WEDDING", icon: ringIcon },
      { id: 6, tag: "AFTER PARTY", title: "PHOTOGRAPHER", icon: cameraIcon },
    ],
    []
  );

  // ✅ smooth reveal on scroll
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

  return (
    <section className={base} ref={wrapRef}>
      <div className={`${base}__container`}>
        <div className={`${base}__grid`}>
          {cards.map((c, i) => (
            <article
              key={c.id}
              className={`${base}__card ${base}__reveal`}
              style={{ transitionDelay: `${90 + i * 90}ms` }}
            >
              <div className={`${base}__iconWrap`} aria-hidden="true">
                <img className={`${base}__icon`} src={c.icon} alt="" />
              </div>

              <div className={`${base}__tag`}>{c.tag}</div>
              <div className={`${base}__tagLine`} />

              <h3 className={`${base}__title`}>{c.title}</h3>

              <p className={`${base}__desc`}>
                At the base of Mt Warning, lies <br />
                a beautiful macadamia.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Venue;