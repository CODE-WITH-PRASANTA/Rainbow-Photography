import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Arrangement.css";

const Arrangement = () => {
  // ✅ component base class name
  const base = "arrangement";
  const wrapRef = useRef(null);

  // ✅ inline SVG icons (random reference-style)
  const icons = useMemo(
    () => ({
      flower: (
        <svg viewBox="0 0 64 64" className={`${base}__svg`} aria-hidden="true">
          <path
            d="M32 10c3 6-1 10-1 10s7-1 10 3c3 4-1 9-1 9s6 2 6 7c0 6-7 7-7 7s2 6-3 9c-5 3-10-2-10-2s-3 6-8 5c-6-1-6-8-6-8s-6-1-6-7c0-6 7-7 7-7s-2-6 3-9c5-3 10 2 10 2s2-7 6-9z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M32 28c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      ceremony: (
        <svg viewBox="0 0 64 64" className={`${base}__svg`} aria-hidden="true">
          <path
            d="M20 52h24M24 52V30c0-5 4-9 9-9s9 4 9 9v22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M28 20c0-6 8-12 16-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M30 34h4M30 40h4M30 46h4M38 34h4M38 40h4M38 46h4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      repeat: (
        <svg viewBox="0 0 64 64" className={`${base}__svg`} aria-hidden="true">
          <path
            d="M18 30a14 14 0 0 1 27-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M46 34a14 14 0 0 1-27 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M44 16v10h10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 48V38H10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      couple: (
        <svg viewBox="0 0 64 64" className={`${base}__svg`} aria-hidden="true">
          <path
            d="M22 30c3 0 6-3 6-7s-3-7-6-7-6 3-6 7 3 7 6 7zm20 0c3 0 6-3 6-7s-3-7-6-7-6 3-6 7 3 7 6 7z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M10 52c0-8 6-14 12-14s12 6 12 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M30 52c0-8 6-14 12-14s12 6 12 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    }),
    [base]
  );

  const stats = useMemo(
    () => [
      { id: 1, value: 840, label: "Flower Arrangements", icon: icons.flower },
      { id: 2, value: 980, label: "Ceremonies", icon: icons.ceremony },
      { id: 3, value: 660, label: "Repeat Customer", icon: icons.repeat },
      { id: 4, value: 120, label: "Happy Couple", icon: icons.couple },
    ],
    [icons]
  );

  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  // ✅ reveal + trigger count animation when visible
  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setInView(true);
      },
      { threshold: 0.25 }
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  // ✅ count up animation
  useEffect(() => {
    if (!inView) return;

    const duration = 1100; // ms
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);

      setCounts(stats.map((s) => Math.round(s.value * eased)));

      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, stats]);

  return (
    <section className={base} ref={wrapRef}>
      <div className={`${base}__container`}>
        <div className={`${base}__grid`}>
          {stats.map((s, idx) => (
            <article key={s.id} className={`${base}__card`}>
              <div className={`${base}__iconTop`}>{s.icon}</div>

              <div className={`${base}__row`}>
                <div className={`${base}__num`}>{counts[idx]}</div>

                {/* middle dotted decoration like reference */}
                <div className={`${base}__decor`} aria-hidden="true">
                  <span className={`${base}__line`} />
                  <span className={`${base}__dot`} />
                  <span className={`${base}__dot`} />
                  <span className={`${base}__dot`} />
                  <span className={`${base}__line`} />
                </div>
              </div>

              <div className={`${base}__label`}>{s.label}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Arrangement;