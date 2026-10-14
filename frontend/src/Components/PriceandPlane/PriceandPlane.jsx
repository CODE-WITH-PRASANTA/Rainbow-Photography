import React, { useEffect, useMemo, useRef } from "react";
import "./PriceandPlane.css";

const PriceandPlane = () => {
  const base = "price-plan";
  const wrapRef = useRef(null);

  const plans = useMemo(
    () => [
      {
        id: 1,
        price: 190,
        title: "Initial Consultation",
        desc: "Lorem Ipsum is simply dummy text of the printing.",
        features: [
          "Wedding Planner",
          "The Wedding Venue",
          "The Wedding Officiant",
          "The Florist",
          "Wedding Photographer",
        ],
      },
      {
        id: 2,
        price: 300,
        title: "Wedding Coordination",
        desc: "Lorem Ipsum is simply dummy text of the printing.",
        features: [
          "Wedding Planner",
          "The Wedding Venue",
          "The Wedding Officiant",
          "The Florist",
          "Wedding Photographer",
          "Wedding Videographer",
        ],
        highlight: true, // ✅ middle premium
      },
      {
        id: 3,
        price: 490,
        title: "Full Wedding Planning",
        desc: "Lorem Ipsum is simply dummy text of the printing.",
        features: [
          "Wedding Planner",
          "The Wedding Venue",
          "The Wedding Officiant",
          "The Florist",
          "Wedding Photographer",
          "Wedding Videographer",
          "The Caterer",
        ],
      },
    ],
    []
  );

  // reveal animation
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
      { threshold: 0.2 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className={base} ref={wrapRef}>
      <div className={`${base}__wrapper`}>
        <div className={`${base}__grid`}>
          {plans.map((plan, i) => (
            <article
              key={plan.id}
              className={`${base}__card 
                ${plan.highlight ? `${base}__card--active` : ""} 
                ${base}__reveal`}
              style={{ transitionDelay: `${100 + i * 120}ms` }}
            >
              {/* PRICE */}
              <div className={`${base}__priceRow`}>
                <span className={`${base}__currency`}>$</span>
                <span className={`${base}__price`}>{plan.price}</span>
                <span className={`${base}__per`}>/mo</span>
              </div>

              <h3 className={`${base}__title`}>{plan.title}</h3>

              <p className={`${base}__desc`}>{plan.desc}</p>

              <ul className={`${base}__list`}>
                {plan.features.map((f, idx) => (
                  <li key={idx} className={`${base}__item`}>
                    ✓ {f}
                  </li>
                ))}
              </ul>

              <button className={`${base}__btn`}>
                Purchase Now <span>→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceandPlane;