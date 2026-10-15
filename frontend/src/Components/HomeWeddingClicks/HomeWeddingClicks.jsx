
import React, { useCallback, useEffect, useState } from "react";
import "./HomeWeddingClicks.css";

import API, { IMG_URL } from "../../api/axios";

import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";

import decorLeft from "../../assets/Flower-18.webp";

const IMAGES_PER_PAGE = 6;

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

const HomeWedingClicks = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch photographs uploaded through the admin panel
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
        .map((item, index) => ({
          id: item._id || item.id || `gallery-${index}`,
          title: item.title || `Wedding Photograph ${index + 1}`,
          category: item.category || "Wedding",
          image: normalizeImageUrl(
            item.image || item.imageUrl || item.url
          ),
        }))
        .filter((item) => item.image);

      // Prefer wedding photographs when the API provides categories.
      // If none are categorized as Wedding, display all gallery images.
      const weddingImages = formattedImages.filter(
        (item) => item.category.toLowerCase() === "wedding"
      );

      setImages(
        weddingImages.length > 0 ? weddingImages : formattedImages
      );
      setCurrentPage(1);
    } catch (requestError) {
      console.error("Failed to fetch wedding gallery:", requestError);

      setError(
        requestError?.response?.data?.message ||
          "Unable to load photographs. Please try again."
      );
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

  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;

  const currentImages = images.slice(
    startIndex,
    startIndex + IMAGES_PER_PAGE
  );

  const changePage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);

    setCurrentPage(nextPage);
  };

  return (
    <section className="HomeWedingClicks">
      {/* Background split */}
      <div className="HomeWedingClicks__bg" />

      {/* Decorative floating image */}
      <img
        src={decorLeft}
        alt=""
        aria-hidden="true"
        className="HomeWedingClicks__decor"
      />

      <div className="HomeWedingClicks__container">
        {/* Heading */}
        <div className="HomeWedingClicks__header">
          <span className="HomeWedingClicks__label">
            SOME BEAUTIFUL MEMORIES
          </span>

          <h2 className="HomeWedingClicks__title">
            Beautiful Wedding Clicks
          </h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="HomeWedingClicks__status" role="status">
            <span className="HomeWedingClicks__loader" />
            <p>Loading beautiful wedding photographs...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="HomeWedingClicks__status HomeWedingClicks__error">
            <p>{error}</p>

            <button
              type="button"
              className="HomeWedingClicks__retry"
              onClick={fetchGallery}
            >
              <FiRefreshCw />
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && images.length === 0 && (
          <div className="HomeWedingClicks__status">
            <p>No wedding photographs are available yet.</p>
          </div>
        )}

        {/* Gallery grid */}
        {!loading && !error && currentImages.length > 0 && (
          <>
            <div className="HomeWedingClicks__grid">
              {currentImages.map((item, index) => (
                <div
                  className={`HomeWedingClicks__item ${
                    index === 1 || index === 3
                      ? "HomeWedingClicks__wide"
                      : ""
                  }`}
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.opacity = "0.35";
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="HomeWedingClicks__pagination"
                aria-label="Wedding gallery pagination"
              >
                <button
                  type="button"
                  className="HomeWedingClicks__pageArrow"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <FiChevronLeft />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={`HomeWedingClicks__pageNumber ${
                      currentPage === page
                        ? "HomeWedingClicks__pageNumber--active"
                        : ""
                    }`}
                    onClick={() => changePage(page)}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="HomeWedingClicks__pageArrow"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <FiChevronRight />
                </button>
              </nav>
            )}

            <p className="HomeWedingClicks__count">
              Showing {currentImages.length} of {images.length} photographs
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default HomeWedingClicks;
