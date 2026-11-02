
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import API, { IMG_URL } from "../../api/axios";
import "./PreAndPostTwo.css";

const PAGE_SIZE = 6;

const MAIN_CATEGORY = "Pre Wedding and Post Wedding Shoot";

const CATEGORIES = [
  { id: "all", label: "All Stories" },
  { id: "pre-wedding", label: "Pre-Wedding" },
  { id: "post-wedding", label: "Post-Wedding" },
  { id: "destination", label: "Destinations" },
  { id: "sunset-candid", label: "Sunset & Candids" },
  { id: "heritage", label: "Heritage & Royal" },
];

// Exact subcategory values saved by the admin gallery.
const SUBCATEGORY_MAP = {
  "pre-wedding": "Pre-Wedding",
  "post-wedding": "Post-Wedding",
  destination: "Destinations",
  "sunset-candid": "Sunset & Candids",
  heritage: "Heritage & Royal",
};

const normalizeText = (value) =>
  String(value || "").trim().toLowerCase();

/* ---------------- Image URL ---------------- */

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  const baseURL = String(
    IMG_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");

  const imagePath = image.startsWith("/")
    ? image
    : `/${image}`;

  return `${baseURL}${imagePath}`;
};

/* ---------------- Backend Response ---------------- */

const getGalleryArray = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData?.gallery)) {
    return responseData.gallery;
  }

  if (Array.isArray(responseData?.photos)) {
    return responseData.photos;
  }

  return [];
};

/* ---------------- Format Gallery Data ---------------- */

const formatGalleryPhoto = (item) => {
  const image =
    item.image ||
    item.imageUrl ||
    item.imagePath ||
    item.url ||
    "";

  return {
    id: item._id || item.id,
    title: item.title || item.name || "Wedding Photography",
    image: getImageUrl(image),
    category: item.category || "",
    subCategory: item.subCategory || item.subcategory || "",
    alt:
      item.title ||
      item.name ||
      "Pre and post wedding photography",
  };
};

/* ---------------- Icons ---------------- */

const ZoomIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="11"
      cy="11"
      r="6.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const PrevIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M15 5l-7 7 7 7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NextIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M9 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------------- Gallery Card ---------------- */

const PreAndPostTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <li
      className="PreAndPostTwo__item"
      style={{
        "--delay": `${(index % PAGE_SIZE) * 70}ms`,
      }}
    >
      <button
        type="button"
        className={`PreAndPostTwo__card ${
          loaded ? "is-loaded" : ""
        }`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        {imageError ? (
          <div className="PreAndPostTwo__image-error">
            Image unavailable
          </div>
        ) : (
          <img
            className="PreAndPostTwo__image"
            src={photo.image}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            draggable="false"
            onLoad={() => setLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        <span className="PreAndPostTwo__overlay">
          <span className="PreAndPostTwo__tag">
            {photo.subCategory}
          </span>

          <span className="PreAndPostTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

/* ---------------- Main Component ---------------- */

const PreAndPostTwo = () => {
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState(null);

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabRefs = useRef({});
  const requestRef = useRef(null);

  /* ---------------- Fetch Photos Using Axios ---------------- */

  const fetchWeddingPhotos = useCallback(async () => {
    if (requestRef.current) {
      requestRef.current.abort();
    }

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      setLoading(true);
      setError("");

      const response = await API.get("/gallery", {
        params: {
          category: MAIN_CATEGORY,
        },
        signal: controller.signal,
      });

      const galleryData = getGalleryArray(response.data);

      const formattedPhotos = galleryData
        // Ensure only the correct main category is displayed.
        .filter(
          (item) =>
            normalizeText(item.category) ===
            normalizeText(MAIN_CATEGORY)
        )
        .map(formatGalleryPhoto)
        .filter(
          (photo) => photo.id && photo.image
        );

      setPhotos(formattedPhotos);
    } catch (err) {
      if (
        err.name === "CanceledError" ||
        err.code === "ERR_CANCELED"
      ) {
        return;
      }

      console.error(
        "Wedding gallery fetch error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load wedding photographs. Please try again."
      );

      setPhotos([]);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchWeddingPhotos();

    return () => {
      if (requestRef.current) {
        requestRef.current.abort();
      }
    };
  }, [fetchWeddingPhotos]);

  /* ---------------- Category Wise Filtering ---------------- */

  const filtered = useMemo(() => {
    if (filter === "all") {
      return photos;
    }

    const selectedSubcategory = SUBCATEGORY_MAP[filter];

    return photos.filter(
      (photo) =>
        normalizeText(photo.subCategory) ===
        normalizeText(selectedSubcategory)
    );
  }, [photos, filter]);

  const visible = filtered.slice(0, visibleCount);

  const hasMore = visibleCount < filtered.length;

  /* ---------------- Sliding Tab Indicator ---------------- */

  const updateIndicator = useCallback(() => {
    const element = tabRefs.current[filter];

    if (element) {
      setIndicator({
        left: element.offsetLeft,
        width: element.offsetWidth,
      });
    }
  }, [filter]);

  useLayoutEffect(() => {
    updateIndicator();

    window.addEventListener("resize", updateIndicator);

    if (document.fonts?.ready) {
      document.fonts.ready.then(updateIndicator);
    }

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  /* ---------------- Change Category ---------------- */

  const handleFilter = (id, event) => {
    if (id === filter) return;

    setFilter(id);
    setVisibleCount(PAGE_SIZE);
    setLightbox(null);

    event.currentTarget.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  /* ---------------- Lightbox Controls ---------------- */

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const showPrev = useCallback(() => {
    setLightbox((current) => {
      if (current === null || filtered.length === 0) {
        return current;
      }

      return (
        (current - 1 + filtered.length) %
        filtered.length
      );
    });
  }, [filtered.length]);

  const showNext = useCallback(() => {
    setLightbox((current) => {
      if (current === null || filtered.length === 0) {
        return current;
      }

      return (current + 1) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox, closeLightbox, showPrev, showNext]);

  const activePhoto =
    lightbox !== null ? filtered[lightbox] : null;

  /* ---------------- Render ---------------- */

  return (
    <section
      className="PreAndPostTwo"
      aria-labelledby="PreAndPostTwo-title"
    >
      <div className="PreAndPostTwo__container">

        {/* Header */}
        <header className="PreAndPostTwo__header">
          <span className="PreAndPostTwo__eyebrow">
            Our Couple Stories
          </span>

          <h2
            className="PreAndPostTwo__title"
            id="PreAndPostTwo-title"
          >
            Pre &amp; Post Wedding Portfolio
          </h2>

          <span
            className="PreAndPostTwo__divider"
            aria-hidden="true"
          />

          <p className="PreAndPostTwo__subtitle">
            Relive your connection through sweeping destination
            vistas, intimate candlelit portraits, and effortless
            candid laughter.
          </p>
        </header>

        {/* Category Tabs */}
        <div
          className="PreAndPostTwo__filters"
          role="tablist"
          aria-label="Filter wedding photographs"
        >
          <div className="PreAndPostTwo__tabs">
            <span
              className="PreAndPostTwo__indicator"
              aria-hidden="true"
              style={{
                width: `${indicator.width}px`,
                transform: `translateX(${indicator.left}px)`,
              }}
            />

            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={filter === category.id}
                ref={(element) => {
                  tabRefs.current[category.id] = element;
                }}
                className={`PreAndPostTwo__tab ${
                  filter === category.id ? "is-active" : ""
                }`}
                onClick={(event) =>
                  handleFilter(category.id, event)
                }
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="PreAndPostTwo__status">
            <p>Loading wedding photographs...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="PreAndPostTwo__status PreAndPostTwo__error">
            <p>{error}</p>

            <button
              type="button"
              className="PreAndPostTwo__button"
              onClick={fetchWeddingPhotos}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Gallery */}
        {!loading && !error && (
          <>
            <ul
              className="PreAndPostTwo__grid"
              key={filter}
            >
              {visible.map((photo, index) => (
                <PreAndPostTwoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onOpen={setLightbox}
                />
              ))}
            </ul>

            {/* Empty State */}
            {filtered.length === 0 && (
              <p className="PreAndPostTwo__empty">
                No couple photographs in this category yet.
              </p>
            )}

            {/* Load More */}
            {filtered.length > 0 && (
              <div className="PreAndPostTwo__footer">
                <p className="PreAndPostTwo__count">
                  Showing {visible.length} of {filtered.length} photos
                </p>

                {hasMore && (
                  <button
                    type="button"
                    className="PreAndPostTwo__button"
                    onClick={() =>
                      setVisibleCount(
                        (count) => count + PAGE_SIZE
                      )
                    }
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {activePhoto && (
        <div
          className="PreAndPostTwo__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Couple photo viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="PreAndPostTwo__lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                className="PreAndPostTwo__lightbox-nav PreAndPostTwo__lightbox-nav--prev"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous photo"
              >
                <PrevIcon />
              </button>

              <button
                type="button"
                className="PreAndPostTwo__lightbox-nav PreAndPostTwo__lightbox-nav--next"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Next photo"
              >
                <NextIcon />
              </button>
            </>
          )}

          <figure
            className="PreAndPostTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="PreAndPostTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />

            <figcaption className="PreAndPostTwo__lightbox-caption">
              <span className="PreAndPostTwo__lightbox-tag">
                {activePhoto.subCategory}
              </span>

              <span className="PreAndPostTwo__lightbox-counter">
                {lightbox + 1} / {filtered.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
};

export default PreAndPostTwo;
