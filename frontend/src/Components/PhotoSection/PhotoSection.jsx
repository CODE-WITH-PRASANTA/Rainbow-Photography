
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./PhotoSection.css";

import API, { IMG_URL } from "../../api/axios";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";

const IMAGES_PER_PAGE = 6;

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (item) => {
  const image =
    typeof item === "string"
      ? item
      : item?.image || item?.imageUrl || item?.url || item?.path || "";

  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  const baseURL = (IMG_URL || "").replace(/\/+$/, "");
  const imagePath = image.startsWith("/") ? image : `/${image}`;

  return `${baseURL}${imagePath}`;
};

// =====================================================
// CATEGORY HELPER
// Supports Marriage, Marrige, Wedding and Reception
// =====================================================

const normalizeCategory = (category) =>
  String(category || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

const isAllowedCategory = (category) => {
  const normalized = normalizeCategory(category);

  return [
    "marriage",
    "marrige",
    "wedding",
    "reception",
  ].includes(normalized);
};

// =====================================================
// COMPONENT
// =====================================================

const PhotoSection = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const gridRef = useRef(null);

  // =====================================================
  // FETCH PHOTOS FROM BACKEND
  // =====================================================

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/gallery");
      const responseData = response.data;

      const gallery = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData?.gallery)
        ? responseData.gallery
        : Array.isArray(responseData?.images)
        ? responseData.images
        : [];

      const filteredPhotos = gallery
        .filter((item) =>
          isAllowedCategory(
            item.category ||
              item.categoryName ||
              item.type
          )
        )
        .map((item, index) => ({
          id: item._id || item.id || `photo-${index}`,
          src: getImageUrl(item),
          title: item.title || item.name || "Wedding Photography",
          category:
            item.category ||
            item.categoryName ||
            item.type ||
            "",
          type: ["tall", "small", "wide"][index % 3],
        }))
        .filter((photo) => photo.src);

      setPhotos(filteredPhotos);
      setCurrentPage(1);
      setActiveIndex(0);
    } catch (err) {
      console.error(
        "Failed to fetch gallery:",
        err.response?.data || err.message
      );

      setError("Unable to load wedding photos. Please try again.");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(photos.length / IMAGES_PER_PAGE);

  const currentPhotos = useMemo(() => {
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;

    return photos.slice(startIndex, startIndex + IMAGES_PER_PAGE);
  }, [photos, currentPage]);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    setActiveIndex(0);

    if (gridRef.current) {
      gridRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // MOBILE SLIDER ACTIVE DOT
  // =====================================================

  const handleScroll = (event) => {
    const element = event.currentTarget;
    const width = element.clientWidth;

    if (!width) return;

    const index = Math.round(element.scrollLeft / width);

    setActiveIndex(
      Math.min(Math.max(index, 0), currentPhotos.length - 1)
    );
  };

  // Reset slider when the visible page changes
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }

    setActiveIndex(0);
  }, [currentPage]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="gallery-wrapper">
      <header className="gallery-header">
        <h2 className="gallery-title">Wedding Photography</h2>

        <p className="gallery-subtitle">
          Capturing the most beautiful moments with elegance & emotion.
        </p>
      </header>

      {/* LOADING */}
      {loading && (
        <div className="photo-gallery-status">
          <span className="photo-gallery-spinner" />
          <p>Loading wedding and reception photos...</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="photo-gallery-status">
          <p>{error}</p>

          <button
            type="button"
            className="photo-gallery-retry"
            onClick={fetchPhotos}
          >
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && photos.length === 0 && (
        <div className="photo-gallery-status">
          <p>
            No Marriage or Reception photos are currently available.
          </p>
        </div>
      )}

      {/* GALLERY */}
      {!loading && !error && currentPhotos.length > 0 && (
        <>
          <div
            className="gallery-grid"
            ref={gridRef}
            onScroll={handleScroll}
          >
            {currentPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`gallery-item ${photo.type}`}
              >
                <div className="image-container">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE SLIDER DOTS */}
          <div className="pagination-dots">
            {currentPhotos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                aria-label={`Show photo ${index + 1}`}
                className={`dot ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => {
                  if (gridRef.current) {
                    gridRef.current.scrollTo({
                      left: index * gridRef.current.clientWidth,
                      behavior: "smooth",
                    });
                  }

                  setActiveIndex(index);
                }}
              />
            ))}
          </div>

          {/* PAGE PAGINATION */}
          {totalPages > 1 && (
            <nav className="photo-pagination" aria-label="Gallery pages">
              <button
                type="button"
                className="photo-pagination-btn"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <FiChevronLeft />
                <span>Previous</span>
              </button>

              <div className="photo-pagination-pages">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={`photo-pagination-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => changePage(page)}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="photo-pagination-btn"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span>Next</span>
                <FiChevronRight />
              </button>
            </nav>
          )}

          <p className="photo-gallery-count">
            Showing {(currentPage - 1) * IMAGES_PER_PAGE + 1}–
            {Math.min(currentPage * IMAGES_PER_PAGE, photos.length)} of{" "}
            {photos.length} photos
          </p>
        </>
      )}
    </section>
  );
};

export default PhotoSection;
