
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import API, { IMG_URL } from "../../api/axios";
import "./BabyShootTwo.css";

const PAGE_SIZE = 6;
const MAIN_CATEGORY = "Baby Shoot";

const CATEGORIES = [
  { id: "all", label: "All Photos" },
  { id: "newborn", label: "Newborn" },
  { id: "sitter", label: "Sitter (6-9M)" },
  { id: "themes-props", label: "Themes & Props" },
  { id: "family-cuddles", label: "Family Cuddles" },
];

// Match the exact subcategory names saved by your admin gallery.
const SUBCATEGORY_MAP = {
  newborn: "Newborn",
  sitter: "Sitter (6-9M)",
  "themes-props": "Themes & Props",
  "family-cuddles": "Family Cuddles",
};

const normalizeText = (value) =>
  String(value || "").trim().toLowerCase();

const getImageUrl = (image) => {
  if (!image) return "";

  // Already a complete URL or a base64 image.
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  const baseUrl = String(IMG_URL || "http://localhost:5000").replace(
    /\/+$/,
    ""
  );

  const imagePath = image.startsWith("/") ? image : `/${image}`;

  return `${baseUrl}${imagePath}`;
};

const getGalleryArray = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.gallery)) return responseData.gallery;
  if (Array.isArray(responseData?.photos)) return responseData.photos;

  return [];
};

// Convert the backend response into a consistent frontend format.
const formatGalleryPhoto = (item) => {
  const image =
    item.image ||
    item.imageUrl ||
    item.imagePath ||
    item.url ||
    "";

  return {
    id: item._id || item.id,
    title: item.title || item.name || "Baby Photography",
    image: getImageUrl(image),
    category: item.category || "",
    subCategory: item.subCategory || item.subcategory || "",
    alt:
      item.title ||
      item.name ||
      "Baby photography portrait",
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

const BabyShootTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <li
      className="BabyShootTwo__item"
      style={{ "--delay": `${(index % PAGE_SIZE) * 70}ms` }}
    >
      <button
        type="button"
        className={`BabyShootTwo__card ${
          loaded ? "is-loaded" : ""
        }`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        {imageError ? (
          <div className="BabyShootTwo__image-error">
            Image unavailable
          </div>
        ) : (
          <img
            className="BabyShootTwo__image"
            src={photo.image}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            draggable="false"
            onLoad={() => setLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        <span className="BabyShootTwo__overlay">
          <span className="BabyShootTwo__tag">
            {photo.subCategory}
          </span>

          <span className="BabyShootTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

/* ---------------- Main Component ---------------- */

const BabyShootTwo = () => {
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

  /* ---------------- Fetch Baby Shoot Photos ---------------- */

  const fetchBabyShootPhotos = useCallback(async () => {
    if (requestRef.current) {
      requestRef.current.abort();
    }

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      setLoading(true);
      setError("");

      // Fetch only the Baby Shoot category from your backend.
      const response = await API.get("/gallery", {
        params: {
          category: MAIN_CATEGORY,
        },
        signal: controller.signal,
      });

      const galleryItems = getGalleryArray(response.data);

      const formattedPhotos = galleryItems
        // Extra category protection on the frontend.
        .filter(
          (item) =>
            normalizeText(item.category) ===
            normalizeText(MAIN_CATEGORY)
        )
        .map(formatGalleryPhoto)
        .filter((photo) => photo.id && photo.image);

      setPhotos(formattedPhotos);
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return;
      }

      console.error(
        "Baby Shoot gallery fetch error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load baby photos. Please try again."
      );

      setPhotos([]);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBabyShootPhotos();

    return () => {
      if (requestRef.current) {
        requestRef.current.abort();
      }
    };
  }, [fetchBabyShootPhotos]);

  /* ---------------- Category Filtering ---------------- */

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

  /* ---------------- Tab Indicator ---------------- */

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

  /* ---------------- Lightbox ---------------- */

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const showPrev = useCallback(() => {
    setLightbox((current) =>
      current === null || filtered.length === 0
        ? current
        : (current - 1 + filtered.length) % filtered.length
    );
  }, [filtered.length]);

  const showNext = useCallback(() => {
    setLightbox((current) =>
      current === null || filtered.length === 0
        ? current
        : (current + 1) % filtered.length
    );
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
      className="BabyShootTwo"
      aria-labelledby="BabyShootTwo-title"
    >
      <div className="BabyShootTwo__container">
        {/* Header */}
        <header className="BabyShootTwo__header">
          <span className="BabyShootTwo__eyebrow">
            Little Wonders Gallery
          </span>

          <h2
            className="BabyShootTwo__title"
            id="BabyShootTwo-title"
          >
            Newborn &amp; Baby Photography Portfolio
          </h2>

          <span
            className="BabyShootTwo__divider"
            aria-hidden="true"
          />

          <p className="BabyShootTwo__subtitle">
            Every tiny yawn, gentle touch, and innocent smile
            safely preserved in heartwarming, timeless portraits.
          </p>
        </header>

        {/* Category Tabs */}
        <div
          className="BabyShootTwo__filters"
          role="tablist"
          aria-label="Filter baby photos"
        >
          <div className="BabyShootTwo__tabs">
            <span
              className="BabyShootTwo__indicator"
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
                className={`BabyShootTwo__tab ${
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

        {/* Loading */}
        {loading && (
          <div className="BabyShootTwo__status">
            <p>Loading baby photos...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="BabyShootTwo__status BabyShootTwo__error">
            <p>{error}</p>

            <button
              type="button"
              className="BabyShootTwo__button"
              onClick={fetchBabyShootPhotos}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Gallery */}
        {!loading && !error && (
          <>
            <ul
              className="BabyShootTwo__grid"
              key={filter}
            >
              {visible.map((photo, index) => (
                <BabyShootTwoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onOpen={setLightbox}
                />
              ))}
            </ul>

            {/* Empty State */}
            {filtered.length === 0 && (
              <p className="BabyShootTwo__empty">
                No baby portraits available in this category yet.
              </p>
            )}

            {/* Load More */}
            {filtered.length > 0 && (
              <div className="BabyShootTwo__footer">
                <p className="BabyShootTwo__count">
                  Showing {visible.length} of {filtered.length} photos
                </p>

                {hasMore && (
                  <button
                    type="button"
                    className="BabyShootTwo__button"
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
          className="BabyShootTwo__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Baby photo viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="BabyShootTwo__lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                className="BabyShootTwo__lightbox-nav BabyShootTwo__lightbox-nav--prev"
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
                className="BabyShootTwo__lightbox-nav BabyShootTwo__lightbox-nav--next"
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
            className="BabyShootTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="BabyShootTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />

            <figcaption className="BabyShootTwo__lightbox-caption">
              <span className="BabyShootTwo__lightbox-tag">
                {activePhoto.subCategory}
              </span>

              <span className="BabyShootTwo__lightbox-counter">
                {lightbox + 1} / {filtered.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
};

export default BabyShootTwo;
