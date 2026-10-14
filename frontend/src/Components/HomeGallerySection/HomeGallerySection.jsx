import React, { useState } from "react";
import "./HomeGallerySection.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMaximize2,
  FiShare2,
} from "react-icons/fi";

/* import images */
import img1 from "../../assets/G-1.webp";
import img2 from "../../assets/G-2.webp";
import img3 from "../../assets/G-3.webp";
import img4 from "../../assets/G-4.webp";
import img5 from "../../assets/G-5.webp";

const images = [img1, img2, img3, img4, img5];

const HomeGallerySection = () => {
  const [index, setIndex] = useState(1);
  const [popup, setPopup] = useState(null);

  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const getImage = (offset) =>
    images[(index + offset + images.length) % images.length];

  return (
    <section className="gallerySlider">
      {/* ================= SLIDER ================= */}
      <div className="gallerySlider__track">
        <img
          src={getImage(-1)}
          className="gallerySlider__img gallerySlider__img--side"
          onClick={() => setPopup(getImage(-1))}
          alt=""
        />

        <img
          src={getImage(0)}
          className="gallerySlider__img gallerySlider__img--center"
          onClick={() => setPopup(getImage(0))}
          alt=""
        />

        <img
          src={getImage(1)}
          className="gallerySlider__img gallerySlider__img--side"
          onClick={() => setPopup(getImage(1))}
          alt=""
        />
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="gallerySlider__controls">
        <button onClick={prev} className="gallerySlider__arrow">
          <FiChevronLeft />
        </button>

        <div className="gallerySlider__progress">
          <div
            className="gallerySlider__progressFill"
            style={{
              width: `${((index + 1) / images.length) * 100}%`,
            }}
          />
        </div>

        <button onClick={next} className="gallerySlider__arrow">
          <FiChevronRight />
        </button>
      </div>

      {/* ================= POPUP LIGHTBOX ================= */}
      {popup && (
        <div className="gallerySlider__popup" onClick={() => setPopup(null)}>
          <div
            className="gallerySlider__popupInner"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOP RIGHT ICON BAR (like template) */}
            <div className="gallerySlider__popupActionsBar">
              <button className="gallerySlider__popupIcon">
                <FiMaximize2 />
              </button>

              <button className="gallerySlider__popupIcon">
                <FiShare2 />
              </button>

              <button
                className="gallerySlider__popupIcon"
                onClick={() => setPopup(null)}
              >
                <FiX />
              </button>
            </div>

            <img src={popup} className="gallerySlider__popupImg" alt="" />
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGallerySection;