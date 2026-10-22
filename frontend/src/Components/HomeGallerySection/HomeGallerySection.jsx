
import React, { useCallback, useEffect, useState } from "react";
import "./HomeGallerySection.css";

import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMaximize2,
  FiShare2,
  FiRefreshCw,
} from "react-icons/fi";

import API, { IMG_URL } from "../../api/axios";

const normalizeImageUrl = (image) => {
  if (!image) return "";

  const value = String(image).trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  const baseUrl = String(IMG_URL || "").replace(/\/+$/, "");
  const imagePath = value.startsWith("/") ? value : `/${value}`;

  return `${baseUrl}${imagePath}`;
};

const HomeGallerySection = () => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [popupIndex, setPopupIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch gallery images uploaded from the admin panel
  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/gallery");
      const result = response.data;

      const galleryData = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.gallery)
            ? result.gallery
            : Array.isArray(result?.images)
              ? result.images
              : [];

      const formattedImages = galleryData
        .map((item, position) => ({
          id: item._id || item.id || `gallery-${position}`,
          title: item.title || `Photograph ${position + 1}`,
          category: item.category || "Photography",
          image: normalizeImageUrl(
            item.image || item.imageUrl || item.url
          ),
        }))
        .filter((item) => item.image);

      setImages(formattedImages);
      setIndex(0);
      setPopupIndex(null);
    } catch (err) {
      console.error("Failed to fetch home gallery:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to load gallery images. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Slider navigation
  const prev = () => {
    if (images.length < 2) return;

    setIndex((current) =>
      (current - 1 + images.length) % images.length
    );
  };

  const next = () => {
    if (images.length < 2) return;

    setIndex((current) => (current + 1) % images.length);
  };

  const getImage = (offset) => {
    if (!images.length) return null;

    return images[
      (index + offset + images.length) % images.length
    ];
  };

  // Open popup at the selected image
  const openPopup = (image) => {
    const selectedIndex = images.findIndex(
      (item) => item.id === image.id
    );

    if (selectedIndex !== -1) {
      setPopupIndex(selectedIndex);
    }
  };

  const closePopup = () => setPopupIndex(null);

  const popupPrev = (event) => {
    event?.stopPropagation();

    setPopupIndex((current) =>
      current === null
        ? null
        : (current - 1 + images.length) % images.length
    );
  };

  const popupNext = (event) => {
    event?.stopPropagation();

    setPopupIndex((current) =>
      current === null
        ? null
        : (current + 1) % images.length
    );
  };

  // Keyboard controls and background scroll lock
  useEffect(() => {
    if (popupIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePopup();
      if (event.key === "ArrowLeft") popupPrev();
      if (event.key === "ArrowRight") popupNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [popupIndex, images.length]);

  // Share the selected image
  const shareImage = async () => {
    if (popupIndex === null || !images[popupIndex]) return;

    const selectedImage = images[popupIndex];

    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedImage.title,
          text: `View this photograph from Rainbow Photography: ${selectedImage.title}`,
          url: selectedImage.image,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(selectedImage.image);
        window.alert("Image link copied to clipboard.");
      } else {
        window.prompt("Copy this image link:", selectedImage.image);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Unable to share image:", err);
      }
    }
  };

  // Fullscreen popup image
  const toggleImageFullscreen = async () => {
    const imageElement = document.querySelector(
      ".gallerySlider__popupImg"
    );

    if (!imageElement) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await imageElement.requestFullscreen();
      }
    } catch (err) {
      console.error("Unable to open fullscreen:", err);
    }
  };

  const leftImage = getImage(-1);
  const centerImage = getImage(0);
  const rightImage = getImage(1);

  return (
    <section className="gallerySlider">
      {/* Loading */}
      {loading && (
        <div className="gallerySlider__status" role="status">
          <span className="gallerySlider__loader" />
          <p>Loading our beautiful photographs...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="gallerySlider__status gallerySlider__error">
          <p>{error}</p>

          <button
            type="button"
            className="gallerySlider__retry"
            onClick={fetchGallery}
          >
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      )}

      {/* Empty gallery */}
      {!loading && !error && images.length === 0 && (
        <div className="gallerySlider__status">
          <p>No show case photographs available yet.</p>
        </div>
      )}

      {/* Slider */}
      {!loading && !error && images.length > 0 && (
        <>
          <div className="gallerySlider__track">
            {leftImage && (
              <button
                type="button"
                className="gallerySlider__imageButton gallerySlider__imageButton--left"
                onClick={() => openPopup(leftImage)}
                aria-label={`View ${leftImage.title}`}
              >
                <img
                  src={leftImage.image}
                  className="gallerySlider__img gallerySlider__img--side"
                  alt={leftImage.title}
                  loading="lazy"
                />
              </button>
            )}

            {centerImage && (
              <button
                type="button"
                className="gallerySlider__imageButton gallerySlider__imageButton--center"
                onClick={() => openPopup(centerImage)}
                aria-label={`View ${centerImage.title}`}
              >
                <img
                  src={centerImage.image}
                  className="gallerySlider__img gallerySlider__img--center"
                  alt={centerImage.title}
                />
              </button>
            )}

            {rightImage && (
              <button
                type="button"
                className="gallerySlider__imageButton gallerySlider__imageButton--right"
                onClick={() => openPopup(rightImage)}
                aria-label={`View ${rightImage.title}`}
              >
                <img
                  src={rightImage.image}
                  className="gallerySlider__img gallerySlider__img--side"
                  alt={rightImage.title}
                  loading="lazy"
                />
              </button>
            )}
          </div>

          {/* Slider controls */}
          <div className="gallerySlider__controls">
            <button
              type="button"
              onClick={prev}
              className="gallerySlider__arrow"
              aria-label="Previous image"
              disabled={images.length < 2}
            >
              <FiChevronLeft />
            </button>

            <div
              className="gallerySlider__progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={images.length}
              aria-valuenow={index + 1}
              aria-label="Gallery position"
            >
              <div
                className="gallerySlider__progressFill"
                style={{
                  width: `${((index + 1) / images.length) * 100}%`,
                }}
              />
            </div>

            <button
              type="button"
              onClick={next}
              className="gallerySlider__arrow"
              aria-label="Next image"
              disabled={images.length < 2}
            >
              <FiChevronRight />
            </button>
          </div>
        </>
      )}

      {/* Popup lightbox */}
      {popupIndex !== null && images[popupIndex] && (
        <div
          className="gallerySlider__popup"
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
        >
          <div
            className="gallerySlider__popupInner"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="gallerySlider__popupActionsBar">
              <button
                type="button"
                className="gallerySlider__popupIcon"
                onClick={toggleImageFullscreen}
                aria-label="View fullscreen"
              >
                <FiMaximize2 />
              </button>

              <button
                type="button"
                className="gallerySlider__popupIcon"
                onClick={shareImage}
                aria-label="Share photograph"
              >
                <FiShare2 />
              </button>

              <button
                type="button"
                className="gallerySlider__popupIcon"
                onClick={closePopup}
                aria-label="Close preview"
              >
                <FiX />
              </button>
            </div>

            <button
              type="button"
              className="gallerySlider__popupNav gallerySlider__popupNav--prev"
              onClick={popupPrev}
              aria-label="Previous photograph"
              disabled={images.length < 2}
            >
              <FiChevronLeft />
            </button>

            <img
              key={images[popupIndex].id}
              src={images[popupIndex].image}
              className="gallerySlider__popupImg"
              alt={images[popupIndex].title}
            />

            <button
              type="button"
              className="gallerySlider__popupNav gallerySlider__popupNav--next"
              onClick={popupNext}
              aria-label="Next photograph"
              disabled={images.length < 2}
            >
              <FiChevronRight />
            </button>

            <p className="gallerySlider__popupCaption">
              {images[popupIndex].title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGallerySection;
