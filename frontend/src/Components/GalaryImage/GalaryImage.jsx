import React, { useEffect, useState } from "react";
import "./GalaryImage.css";

import img1 from "../../assets/page-2.webp";
import img2 from "../../assets/page-3.webp";
import img3 from "../../assets/page-4.webp";
import img4 from "../../assets/page-5.webp";
import img5 from "../../assets/page-6.webp";
import img6 from "../../assets/page-7.webp";
import img7 from "../../assets/page-2.webp";
import img8 from "../../assets/page-3.webp";
import img9 from "../../assets/page-4.webp";

import leaf from "../../assets/Leaf-1.webp";

import {
  FiArrowLeft,
  FiArrowRight,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
];

const IMAGES_PER_PAGE = 6;

const GalaryImage = () => {
  const [previewIndex, setPreviewIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(images.length / IMAGES_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;

  const currentImages = images.slice(
    startIndex,
    startIndex + IMAGES_PER_PAGE
  );

  const openPreview = (index) => {
    setPreviewIndex(startIndex + index);
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

  const showPrevious = (event) => {
    event?.stopPropagation();

    setPreviewIndex((current) =>
      current === null
        ? null
        : (current - 1 + images.length) % images.length
    );
  };

  const showNext = (event) => {
    event?.stopPropagation();

    setPreviewIndex((current) =>
      current === null
        ? null
        : (current + 1) % images.length
    );
  };

  const changePage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  // Keyboard navigation and prevent background scrolling
  useEffect(() => {
    if (previewIndex === null) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePreview();
      }

      if (event.key === "ArrowLeft") {
        setPreviewIndex((current) =>
          current === null
            ? null
            : (current - 1 + images.length) % images.length
        );
      }

      if (event.key === "ArrowRight") {
        setPreviewIndex((current) =>
          current === null
            ? null
            : (current + 1) % images.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewIndex]);

  return (
    <section className="galaryimage--section">
      {/* Decorative leaves */}
      <img
        src={leaf}
        alt=""
        aria-hidden="true"
        className="galaryimage--leaf galaryimage--leafLeft"
      />

      <img
        src={leaf}
        alt=""
        aria-hidden="true"
        className="galaryimage--leaf galaryimage--leafRight"
      />

      {/* Gallery heading */}
      <div className="galaryimage--heading">
        <span className="galaryimage--eyebrow">
          Moments Worth Remembering
        </span>

        <h2 className="galaryimage--title">
          Our Beautiful <span>Gallery</span>
        </h2>

        <p className="galaryimage--description">
          A collection of beautiful stories, timeless emotions, and
          unforgettable moments captured through our lens.
        </p>

        <div
          className="galaryimage--ornament"
          aria-hidden="true"
        >
          <span />
          <span className="galaryimage--ornamentDiamond">✧</span>
          <span />
        </div>
      </div>

      {/* Gallery grid */}
      <div className="galaryimage--container">
        {currentImages.map((img, index) => (
          <button
            type="button"
            key={`${currentPage}-${index}`}
            className="galaryimage--item"
            onClick={() => openPreview(index)}
            aria-label={`Open gallery image ${startIndex + index + 1}`}
          >
            <img
              src={img}
              alt={`Rainbow Photography gallery ${startIndex + index + 1}`}
              loading="lazy"
            />

            <span className="galaryimage--imageOverlay">
              <span className="galaryimage--viewIcon">↗</span>
              <span className="galaryimage--viewText">
                View Photograph
              </span>
            </span>

            <span className="galaryimage--imageNumber">
              {String(startIndex + index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {/* Six images per page */}
      {totalPages > 1 && (
        <nav
          className="galaryimage--pagination"
          aria-label="Gallery pages"
        >
          <button
            type="button"
            className="galaryimage--pageArrow"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous gallery page"
          >
            <FiArrowLeft />
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              type="button"
              key={page}
              className={`galaryimage--pageNumber ${
                currentPage === page
                  ? "galaryimage--pageNumberActive"
                  : ""
              }`}
              onClick={() => changePage(page)}
              aria-current={
                currentPage === page ? "page" : undefined
              }
              aria-label={`Gallery page ${page}`}
            >
              {String(page).padStart(2, "0")}
            </button>
          ))}

          <button
            type="button"
            className="galaryimage--pageArrow"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next gallery page"
          >
            <FiArrowRight />
          </button>
        </nav>
      )}

      <p className="galaryimage--count">
        Showing {currentImages.length} of {images.length} photographs
      </p>

      {/* Image-only popup: transparent background */}
      {previewIndex !== null && (
        <div
          className="galaryimage--popup"
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
          aria-label="Photograph preview"
        >
          {/* Close button */}
          <button
            type="button"
            className="galaryimage--popupClose"
            onClick={closePreview}
            aria-label="Close photograph"
          >
            <FiX />
          </button>

          {/* Previous image */}
          <button
            type="button"
            className="galaryimage--popupArrow galaryimage--popupPrev"
            onClick={showPrevious}
            aria-label="Previous photograph"
          >
            <FiChevronLeft />
          </button>

          {/* Photograph only */}
          <img
            src={images[previewIndex]}
            alt={`Rainbow Photography photograph ${previewIndex + 1}`}
            className="galaryimage--popupImage"
            onClick={(event) => event.stopPropagation()}
          />

          {/* Next image */}
          <button
            type="button"
            className="galaryimage--popupArrow galaryimage--popupNext"
            onClick={showNext}
            aria-label="Next photograph"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default GalaryImage;