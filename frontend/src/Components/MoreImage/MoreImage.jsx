import React, { useEffect, useState } from "react";
import "./MoreImage.css";

import {
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaShareAlt,
} from "react-icons/fa";

import img1 from "../../assets/page-1.webp";
import img2 from "../../assets/page-2.webp";
import img3 from "../../assets/page-3.webp";
import img4 from "../../assets/page-4.webp";
import img5 from "../../assets/page-5.webp";

import leaf from "../../assets/Leaf-1.webp";
import yellowFlower from "../../assets/yellow-1.webp";
import dividerImg from "../../assets/Devider.webp";

const images = [img1, img2, img3, img4, img5];
const IMAGES_PER_PAGE = 5;

const MoreImage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [shareMessage, setShareMessage] = useState("");

  const totalPages = Math.max(
    1,
    Math.ceil(images.length / IMAGES_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const visibleImages = images.slice(
    startIndex,
    startIndex + IMAGES_PER_PAGE
  );

  const openImage = (index) => {
    setActiveIndex(startIndex + index);
  };

  const closeImage = () => {
    setActiveIndex(null);
    setShareMessage("");
  };

  const prev = (event) => {
    event?.stopPropagation();

    setActiveIndex((index) =>
      index === null
        ? null
        : (index - 1 + images.length) % images.length
    );
  };

  const next = (event) => {
    event?.stopPropagation();

    setActiveIndex((index) =>
      index === null
        ? null
        : (index + 1) % images.length
    );
  };

  const changePage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Keyboard navigation and popup scroll locking
  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeImage();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  const shareImage = async () => {
    const imageUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Rainbow Photography",
          text: "Explore this beautiful photography gallery.",
          url: imageUrl,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(imageUrl);
        setShareMessage("Gallery link copied!");
      } else {
        setShareMessage("Copy the website link from your browser.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareMessage("Unable to share right now.");
      }
    }
  };

  return (
    <section className="miGallery-wrapper">
      {/* Decorative floral elements */}
      <img
        src={leaf}
        alt=""
        aria-hidden="true"
        className="miGallery-flower miGallery-flowerLeft"
      />

      <img
        src={leaf}
        alt=""
        aria-hidden="true"
        className="miGallery-flower miGallery-flowerRight"
      />

      <img
        src={yellowFlower}
        alt=""
        aria-hidden="true"
        className="miGallery-yellowFlower miGallery-yellowFlowerLeft"
      />

      <img
        src={yellowFlower}
        alt=""
        aria-hidden="true"
        className="miGallery-yellowFlower miGallery-yellowFlowerRight"
      />

      {/* Gallery heading */}
      <header className="miGallery-heading">
        <span className="miGallery-eyebrow">
          The Art of Capturing Moments
        </span>

        <h2 className="miGallery-title">
          Moments That <span>Last Forever</span>
        </h2>

        <p className="miGallery-description">
          Every photograph tells a story. Explore our collection of
          beautiful memories, heartfelt emotions, and timeless celebrations.
        </p>

        <img
          src={dividerImg}
          alt=""
          aria-hidden="true"
          className="miGallery-divider"
        />
      </header>

      {/* Equal-sized image grid */}
      <div className="miGallery-grid">
        {visibleImages.map((img, index) => (
          <button
            type="button"
            key={`${currentPage}-${img}`}
            className="miGallery-item"
            onClick={() => openImage(index)}
            aria-label={`View photograph ${startIndex + index + 1}`}
          >
            <img
              src={img}
              alt={`Rainbow Photography photograph ${startIndex + index + 1}`}
              loading="lazy"
            />

            <span className="miGallery-hover">
              <span className="miGallery-viewIcon">↗</span>
              <span className="miGallery-viewText">
                View Photograph
              </span>
            </span>

            <span className="miGallery-number">
              {String(startIndex + index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="miGallery-pagination" aria-label="Gallery pagination">
          <button
            type="button"
            className="miGallery-pageArrow"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <FaArrowLeft />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
                key={page}
                className={`miGallery-pageNumber ${
                  currentPage === page ? "is-active" : ""
                }`}
                onClick={() => changePage(page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {String(page).padStart(2, "0")}
              </button>
            )
          )}

          <button
            type="button"
            className="miGallery-pageArrow"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <FaArrowRight />
          </button>
        </nav>
      )}

      <p className="miGallery-count">
        Showing {visibleImages.length} of {images.length} photographs
      </p>

      {/* Full-screen image popup */}
      {activeIndex !== null && (
        <div
          className="miGallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={closeImage}
        >
          <div className="miGallery-topbar">
            <div className="miGallery-counter">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="miGallery-counterDivider">/</span>
              <span>{String(images.length).padStart(2, "0")}</span>
            </div>

            <div className="miGallery-icons">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  shareImage();
                }}
                aria-label="Share gallery"
                title="Share gallery"
              >
                <FaShareAlt />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  closeImage();
                }}
                aria-label="Close image"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {shareMessage && (
            <p className="miGallery-shareMessage" role="status">
              {shareMessage}
            </p>
          )}

          <button
            type="button"
            className="miGallery-prev"
            onClick={prev}
            aria-label="Previous image"
          >
            <FaArrowLeft />
          </button>

          <div
            className="miGallery-imageStage"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={images[activeIndex]}
              className="miGallery-popupImg"
              alt={`Rainbow Photography photograph ${activeIndex + 1}`}
            />

            <div className="miGallery-popupCaption">
              <span>RAINBOW PHOTOGRAPHY</span>
              <span>
                Photograph {String(activeIndex + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="miGallery-next"
            onClick={next}
            aria-label="Next image"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default MoreImage;