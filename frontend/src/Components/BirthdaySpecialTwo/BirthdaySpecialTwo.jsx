
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./BirthdaySpecialTwo.css";
import API, { IMG_URL } from "../../api/axios";

const PAGE_SIZE = 6;

// ========================================
// MAIN CATEGORY FROM MONGODB
// ========================================

const MAIN_CATEGORY = "Birthday Special";

// ========================================
// SUBCATEGORY FILTERS
// Values must exactly match MongoDB
// ========================================

const CATEGORIES = [
  { id: "all", label: "All Celebrations" },
  { id: "Cake Smash", label: "Cake Smash" },
  { id: "Kids Party", label: "Kids Party" },
  { id: "Themed Decor", label: "Themed Decor" },
  { id: "Family Moments", label: "Family Moments" },
];

// ========================================
// IMAGE URL HELPER
// ========================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${IMG_URL.replace(/\/$/, "")}/${image.replace(
    /^\/+/,
    ""
  )}`;
};

// ========================================
// ICONS
// ========================================

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

// ========================================
// SINGLE GALLERY CARD
// ========================================

const BirthdaySpecialTwoCard = ({
  photo,
  index,
  onOpen,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <li
      className="BirthdaySpecialTwo__item"
      style={{
        "--delay": `${(index % PAGE_SIZE) * 70}ms`,
      }}
    >
      <button
        type="button"
        className={`BirthdaySpecialTwo__card ${
          loaded ? "is-loaded" : ""
        }`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        {!imageError ? (
          <img
            className="BirthdaySpecialTwo__image"
            src={getImageUrl(photo.image)}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            draggable="false"
            onLoad={() => setLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="BirthdaySpecialTwo__image-error">
            Image unavailable
          </span>
        )}

        <span className="BirthdaySpecialTwo__overlay">
          <span className="BirthdaySpecialTwo__tag">
            {photo.subCategory}
          </span>

          <span className="BirthdaySpecialTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

// ========================================
// MAIN COMPONENT
// ========================================

const BirthdaySpecialTwo = () => {
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

  // ========================================
  // FETCH BIRTHDAY IMAGES FROM BACKEND
  // ========================================

  const fetchBirthdayImages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/gallery", {
        params: {
          category: MAIN_CATEGORY,
        },
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load birthday gallery."
        );
      }

      const galleryData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      // Only display valid Birthday Special records
      const birthdayPhotos = galleryData
        .filter(
          (item) =>
            item.category === MAIN_CATEGORY &&
            item.image &&
            CATEGORIES.some(
              (category) =>
                category.id === "all" ||
                category.id === item.subCategory
            )
        )
        .map((item) => ({
          id: item._id,
          title: item.title,
          image: item.image,
          category: item.category,
          subCategory: item.subCategory,
          alt: item.title || `${item.subCategory} photography`,
        }));

      setPhotos(birthdayPhotos);
    } catch (err) {
      console.error(
        "BIRTHDAY GALLERY FETCH ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load birthday photos."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBirthdayImages();
  }, [fetchBirthdayImages]);

  // ========================================
  // FILTER IMAGES CATEGORY-WISE
  // ========================================

  const filtered = useMemo(() => {
    if (filter === "all") {
      return photos;
    }

    return photos.filter(
      (photo) => photo.subCategory === filter
    );
  }, [photos, filter]);

  const visible = filtered.slice(0, visibleCount);

  const hasMore = visibleCount < filtered.length;

  // ========================================
  // SLIDING INDICATOR
  // ========================================

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
      window.removeEventListener(
        "resize",
        updateIndicator
      );
    };
  }, [updateIndicator]);

  // ========================================
  // CATEGORY FILTER
  // ========================================

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

  // ========================================
  // LIGHTBOX CONTROLS
  // ========================================

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const showPrev = useCallback(() => {
    setLightbox((index) =>
      index === null
        ? index
        : (index - 1 + filtered.length) % filtered.length
    );
  }, [filtered.length]);

  const showNext = useCallback(() => {
    setLightbox((index) =>
      index === null
        ? index
        : (index + 1) % filtered.length
    );
  }, [filtered.length]);

  // ========================================
  // KEYBOARD NAVIGATION
  // ========================================

  useEffect(() => {
    if (lightbox === null) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") closeLightbox();

      if (event.key === "ArrowLeft") showPrev();

      if (event.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeLightbox, showPrev, showNext]);

  // ========================================
  // ACTIVE LIGHTBOX PHOTO
  // ========================================

  const activePhoto =
    lightbox !== null ? filtered[lightbox] : null;

  // ========================================
  // JSX
  // ========================================

  return (
    <section
      className="BirthdaySpecialTwo"
      aria-labelledby="BirthdaySpecialTwo-title"
    >
      <div className="BirthdaySpecialTwo__container">

        {/* HEADING */}

        <header className="BirthdaySpecialTwo__header">

          <span className="BirthdaySpecialTwo__eyebrow">
            Birthday Celebrations
          </span>

          <h2
            className="BirthdaySpecialTwo__title"
            id="BirthdaySpecialTwo-title"
          >
            Birthday Photography Portfolio
          </h2>

          <span
            className="BirthdaySpecialTwo__divider"
            aria-hidden="true"
          />

          <p className="BirthdaySpecialTwo__subtitle">
            Cherish every joyful chuckle, playful cake smash,
            and candle-blowing moment with our bespoke
            birthday photography sessions.
          </p>

        </header>

        {/* CATEGORY FILTERS */}

        <div
          className="BirthdaySpecialTwo__filters"
          role="tablist"
          aria-label="Filter birthday photos"
        >
          <div className="BirthdaySpecialTwo__tabs">

            <span
              className="BirthdaySpecialTwo__indicator"
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
                className={`BirthdaySpecialTwo__tab ${
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

        {/* LOADING */}

        {loading && (
          <div
            className="BirthdaySpecialTwo__empty"
            role="status"
          >
            Loading birthday photographs...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div
            className="BirthdaySpecialTwo__empty"
            role="alert"
          >
            <p>{error}</p>

            <button
              type="button"
              className="BirthdaySpecialTwo__button"
              onClick={fetchBirthdayImages}
            >
              Try Again
            </button>
          </div>
        )}

        {/* GALLERY GRID */}

        {!loading && !error && (
          <>
            <ul
              className="BirthdaySpecialTwo__grid"
              key={filter}
            >
              {visible.map((photo, index) => (
                <BirthdaySpecialTwoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onOpen={setLightbox}
                />
              ))}
            </ul>

            {/* EMPTY CATEGORY */}

            {filtered.length === 0 && (
              <p className="BirthdaySpecialTwo__empty">
                No celebration photos in this category yet.
              </p>
            )}

            {/* LOAD MORE */}

            {filtered.length > 0 && (
              <div className="BirthdaySpecialTwo__footer">

                <p className="BirthdaySpecialTwo__count">
                  Showing {visible.length} of {filtered.length} photos
                </p>

                {hasMore && (
                  <button
                    type="button"
                    className="BirthdaySpecialTwo__button"
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

      {/* LIGHTBOX */}

      {activePhoto && (
        <div
          className="BirthdaySpecialTwo__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Birthday photo viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="BirthdaySpecialTwo__lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                className="BirthdaySpecialTwo__lightbox-nav BirthdaySpecialTwo__lightbox-nav--prev"
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
                className="BirthdaySpecialTwo__lightbox-nav BirthdaySpecialTwo__lightbox-nav--next"
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
            className="BirthdaySpecialTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="BirthdaySpecialTwo__lightbox-image"
              src={getImageUrl(activePhoto.image)}
              alt={activePhoto.alt}
            />

            <figcaption className="BirthdaySpecialTwo__lightbox-caption">

              <span className="BirthdaySpecialTwo__lightbox-tag">
                {activePhoto.subCategory}
              </span>

              <span className="BirthdaySpecialTwo__lightbox-counter">
                {lightbox + 1} / {filtered.length}
              </span>

            </figcaption>
          </figure>
        </div>
      )}

    </section>
  );
};

export default BirthdaySpecialTwo;
