import React, { useEffect } from "react";
import "./Grid.css";

import img1 from "../../assets/news1-1.webp";
import img2 from "../../assets/news1-2.webp";

const Grid = () => {

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <section className="wedding-grid">

      {/* ===== FIRST ROW ===== */}
      <div className="grid-row fade-up">
        <div className="grid-text">
          <div className="date-box">
            <div className="date-number">24</div>
            <div className="date-month">December 2024</div>
          </div>

          <div className="vertical-line"></div>

          <div className="content-box">
            <h2>
              Couple’s wedding turns emotional as groom stands
            </h2>
            <p>
              I’m filled with joy and excitement to be marrying the love of my life.
            </p>
          </div>
        </div>

        <div className="grid-image">
          <img src={img1} alt="Wedding setup" />
        </div>
      </div>

      {/* ===== SECOND ROW ===== */}
      <div className="grid-row reverse fade-up">
        <div className="grid-text">
          <div className="date-box">
            <div className="date-number">24</div>
            <div className="date-month">December 2024</div>
          </div>

          <div className="vertical-line"></div>

          <div className="content-box">
            <h2>
              Photography is the important part of wedding.
            </h2>
            <p>
              I’m filled with joy and excitement to be marrying the love of my life.
            </p>
          </div>
        </div>

        <div className="grid-image">
          <img src={img2} alt="Wedding couple" />
        </div>
      </div>

    </section>
  );
};

export default Grid;