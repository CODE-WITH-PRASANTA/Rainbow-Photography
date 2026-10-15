
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./GalaryImage.css";

import leaf from "../../assets/Leaf-1.webp";

import API, { IMG_URL } from "../../api/axios";

import {
  FiArrowLeft,
  FiArrowRight,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";

const IMAGES_PER_PAGE = 6;

const DEFAULT_IMAGE_BASE = IMG_URL || "";

const normalizeImageUrl = (image) => {
  if (!image) return "";

  const imagePath = String(image).trim();

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  const baseUrl = String(DEFAULT_IMAGE_BASE).replace(/\/+$/, "");
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${baseUrl}${normalizedPath}`;
};

const normalizeGalleryItem = (item, index) => ({
  ...item,
  id: item._id || item.id || `gallery-${index}`,
  title: item.title || `Photograph ${index + 1}`,
  category: item.category || "Photography",
  image: normalizeImageUrl(
    item.image || item.imageUrl || item.url
  ),
});

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Unable to load gallery images. Please try again.";

const GalaryImage = () => {
  const [images, setImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch images uploaded through the admin panel
  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/gallery");
      const responseData = response.data;

      const galleryData = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(responseData?.gallery)
            ? responseData.gallery
            : Array.isArray(responseData?.images)
              ? responseData.images
              : [];

      const normalizedImages = galleryData
        .map(normalizeGalleryItem)
        .filter((item) => item.image);

      setImages(normalizedImages);
      setCurrentPage(1);
      setPreviewIndex(null);
    } catch (requestError) {
      console.error("Failed to fetch gallery:", requestError);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const totalPages = Math.max(
    1,
    Math.ceil(images.length / IMAGES_PER_PAGE)
  );

  const currentImages = useMemo(() => {
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;

    return images.slice(
      startIndex,
      startIndex + IMAGES_PER_PAGE
    );
  }, [images, currentPage]);

  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;

  const changePage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

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

  // Keyboard navigation and background scroll lock
  useEffect(() => {
    if (previewIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePreview();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewIndex, images.length]);

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

      {/* Loading state */}
      {loading && (
        <div className="galaryimage--status" role="status">
          <span className="galaryimage--loader" />
          <p>Loading beautiful photographs...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="galaryimage--status galaryimage--error">
          <p>{error}</p>

          <button
            type="button"
            className="galaryimage--retry"
            onClick={fetchGallery}
          >
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      )}

      {/* Gallery grid */}
      {!loading && !error && images.length > 0 && (
        <>
          <div className="galaryimage--container">
            {currentImages.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className="galaryimage--item"
                onClick={() => openPreview(index)}
                aria-label={`Open ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0.35";
                  }}
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

          {/* Pagination: six images per page */}
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
        </>
      )}

      {/* Empty state */}
      {!loading && !error && images.length === 0 && (
        <div className="galaryimage--status">
          <p>No photographs are available yet.</p>
          <p>New images uploaded through our studio gallery will appear here.</p>

          <button
            type="button"
            className="galaryimage--retry"
            onClick={fetchGallery}
          >
            <FiRefreshCw />
            Refresh Gallery
          </button>
        </div>
      )}

      {/* Image popup */}
      {previewIndex !== null && images[previewIndex] && (
        <div
          className="galaryimage--popup"
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
          aria-label="Photograph preview"
        >
          <button
            type="button"
            className="galaryimage--popupClose"
            onClick={closePreview}
            aria-label="Close photograph"
          >
            <FiX />
          </button>

          <button
            type="button"
            className="galaryimage--popupArrow galaryimage--popupPrev"
            onClick={showPrevious}
            aria-label="Previous photograph"
          >
            <FiChevronLeft />
          </button>

          <img
            key={images[previewIndex].id}
            src={images[previewIndex].image}
            alt={images[previewIndex].title}
            className="galaryimage--popupImage"
            onClick={(event) => event.stopPropagation()}
          />

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
