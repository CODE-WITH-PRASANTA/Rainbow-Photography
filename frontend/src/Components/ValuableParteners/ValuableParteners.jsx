import React, { useEffect } from "react";
import "./ValuableParteners.css";

const partnersData = [
  { id: 1, name: "L + T" },
  { id: 2, name: "HANI & IORIE" },
  { id: 3, name: "R + S" },
  { id: 4, name: "JK" },
  { id: 5, name: "E & O" },
  { id: 6, name: "OLIVE & MAGIE" },
];

const ValuablePartners = () => {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));
  }, []);

  return (
    <section className="partners-section">
      {/* Animated Gradient Background */}
      <div className="bg-gradient"></div>

      <div className="partners-container">
        <div className="partners-content">

          {/* LEFT TEXT */}
          <header className="partners-header reveal">
            <span className="subtitle">OUR BELOVED COUPLES</span>
            <h2 className="title-main">Valuable</h2>
            <h2 className="title-sub">Partners</h2>

            <div className="divider"></div>

            <p className="description">
              Each celebration tells a beautiful story. We are grateful to our
              wonderful couples who trusted us to make their special moments timeless.
            </p>
          </header>

          {/* RIGHT GRID */}
          <div className="partners-grid">
            {partnersData.map((partner, index) => (
              <div
                key={partner.id}
                className="partner-card reveal"
                style={{ transitionDelay: `${index * 0.12}s` }}
              >
                <span className="logo-text">{partner.name}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ValuablePartners;