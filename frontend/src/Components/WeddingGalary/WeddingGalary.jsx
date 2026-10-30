import React, { useState, useRef } from "react";
import "./WeddingGalary.css";
import {
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaPlay,
  FaTh,
  FaShareAlt,
} from "react-icons/fa";

import img1 from "../../assets/page-4.webp";
import img2 from "../../assets/page-2.webp";
import img3 from "../../assets/page-6.webp";
import img4 from "../../assets/page-7.webp";
import img5 from "../../assets/page-8.webp";
import img6 from "../../assets/page-9.webp";
import img7 from "../../assets/page-3.webp";
import img8 from "../../assets/page-5.webp";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

const WeddingGalary = () => {
  const [active, setActive] = useState(null);
  const scrollRef = useRef(null);

  const next = () =>
    setActive((prev) => (prev + 1) % images.length);

  const prev = () =>
    setActive((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  /* ⭐ mobile horizontal pagination */
  const scrollGallery = (dir) => {
    if (!scrollRef.current) return;

    const width = scrollRef.current.offsetWidth;

    scrollRef.current.scrollBy({
      left: dir === "next" ? width * 0.9 : -width * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <section className="wcg-wrapper">

      <div className="wcg-heading">
        <div className="wcg-heart">❤ ❤</div>
        <p className="wcg-sub">SWEET MEMORIES</p>
        <h2>WEDDING GALLERY</h2>
      </div>

      {/* GRID */}
      <div className="wcg-grid" ref={scrollRef}>
        {images.map((img, i) => (
          <div
            key={i}
            className={`wcg-item ${
              i % 2 === 0 ? "wcg-circle" : "wcg-rounded"
            }`}
            onClick={() => setActive(i)}
          >
            <img src={img} alt="" />
            <div className="wcg-hover"></div>
          </div>
        ))}
      </div>

      {/* ⭐ MOBILE PAGINATION */}
      <div className="wcg-mobileNav">
        <button onClick={() => scrollGallery("prev")}>‹</button>
        <button onClick={() => scrollGallery("next")}>›</button>
      </div>

      {/* LIGHTBOX */}
      {active !== null && (
        <div className="wcg-lightbox">

          <div className="wcg-topbar">
            <span>{active + 1} / {images.length}</span>

            <div className="wcg-icons">
              <FaPlay />
              <FaTh />
              <FaShareAlt />
              <FaTimes onClick={() => setActive(null)} />
            </div>
          </div>

          <button className="wcg-prev" onClick={prev}>
            <FaArrowLeft />
          </button>

          <img
            src={images[active]}
            className="wcg-popupImg"
            alt=""
          />

          <button className="wcg-next" onClick={next}>
            <FaArrowRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default WeddingGalary;