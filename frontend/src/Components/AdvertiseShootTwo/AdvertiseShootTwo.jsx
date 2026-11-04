
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import API, { IMG_URL } from "../../api/axios";
import "./AdvertiseShootTwo.css";

const PAGE_SIZE = 6;
const MAIN_CATEGORY = "Advertise Shoot";

const CATEGORIES = [
  { id: "all", label: "All Campaigns" },
  { id: "product", label: "Product & Packshot" },
  { id: "fashion", label: "Fashion & Lookbook" },
  { id: "brand", label: "Brand Commercial" },
  { id: "editorial", label: "Editorial & Print" },
  { id: "corporate", label: "Corporate & Lifestyle" },
];

// These values must match the subCategory values saved in MongoDB.
const SUBCATEGORY_MAP = {
  product: "Product & Packshot",
  fashion: "Fashion & Lookbook",
  brand: "Brand Commercial",
  editorial: "Editorial & Print",
  corporate: "Corporate & Lifestyle",
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

/* ---------------- API Response Handler ---------------- */

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

/* ---------------- Format Backend Data ---------------- */

const formatGalleryPhoto = (item) => {
  const image =
    item.image ||
    item.imageUrl ||
    item.imagePath ||
    item.url ||
    "";

  return {
    id: item._id || item.id,
    title: item.title || item.name || "Commercial Photography",
    image: getImageUrl(image),
    category: item.category || "",
    subCategory: item.subCategory || item.subcategory || "",
    alt:
      item.title ||
      item.name ||
      "Advertising and commercial photography",
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

const AdvertiseShootTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <li
      className="AdvertiseShootTwo__item"
      style={{
        "--delay": `${(index % PAGE_SIZE) * 70}ms`,
      }}
    >
      <button
        type="button"
        className={`AdvertiseShootTwo__card ${
          loaded ? "is-loaded" : ""
        }`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        {imageError ? (
          <div className="AdvertiseShootTwo__image-error">
            Image unavailable
          </div>
        ) : (
          <img
            className="AdvertiseShootTwo__image"
            src={photo.image}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            draggable="false"
            onLoad={() => setLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        <span className="AdvertiseShootTwo__overlay">
          <span className="AdvertiseShootTwo__tag">
            {photo.subCategory}
          </span>

          <span className="AdvertiseShootTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

/* ---------------- Main Component ---------------- */

const AdvertiseShootTwo = () => {
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

  /* ---------------- Fetch Gallery From Backend ---------------- */

  const fetchAdvertisePhotos = useCallback(async () => {
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
        "Advertise Shoot API Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load advertising photos. Please try again."
      );

      setPhotos([]);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAdvertisePhotos();

    return () => {
      if (requestRef.current) {
        requestRef.current.abort();
      }
    };
  }, [fetchAdvertisePhotos]);

  /* ---------------- Category Wise Filtering ---------------- */

  const filtered = useMemo(() => {
    if (filter === "all") {
      return photos;
    }

    const selectedCategory = SUBCATEGORY_MAP[filter];

    return photos.filter(
      (photo) =>
        normalizeText(photo.subCategory) ===
        normalizeText(selectedCategory)
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

  /* ---------------- Category Change ---------------- */

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
      className="AdvertiseShootTwo"
      aria-labelledby="AdvertiseShootTwo-title"
    >
      <div className="AdvertiseShootTwo__container">

        {/* Header */}
        <header className="AdvertiseShootTwo__header">
          <span className="AdvertiseShootTwo__eyebrow">
            Commercial Showcase
          </span>

          <h2
            className="AdvertiseShootTwo__title"
            id="AdvertiseShootTwo-title"
          >
            Advertising &amp; Commercial Photography Portfolio
          </h2>

          <span
            className="AdvertiseShootTwo__divider"
            aria-hidden="true"
          />

          <p className="AdvertiseShootTwo__subtitle">
            Engineered lighting, precise art direction, and
            editorial excellence crafted to scale your brand
            aesthetic and sales impact.
          </p>
        </header>

        {/* Category Tabs */}
        <div
          className="AdvertiseShootTwo__filters"
          role="tablist"
          aria-label="Filter advertising photos"
        >
          <div className="AdvertiseShootTwo__tabs">
            <span
              className="AdvertiseShootTwo__indicator"
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
                className={`AdvertiseShootTwo__tab ${
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
          <div className="AdvertiseShootTwo__status">
            <p>Loading advertising campaigns...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="AdvertiseShootTwo__status AdvertiseShootTwo__error">
            <p>{error}</p>

            <button
              type="button"
              className="AdvertiseShootTwo__button"
              onClick={fetchAdvertisePhotos}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Gallery */}
        {!loading && !error && (
          <>
            <ul
              className="AdvertiseShootTwo__grid"
              key={filter}
            >
              {visible.map((photo, index) => (
                <AdvertiseShootTwoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onOpen={setLightbox}
                />
              ))}
            </ul>

            {/* Empty State */}
            {filtered.length === 0 && (
              <p className="AdvertiseShootTwo__empty">
                No advertising campaigns found in this category.
              </p>
            )}

            {/* Load More */}
            {filtered.length > 0 && (
              <div className="AdvertiseShootTwo__footer">
                <p className="AdvertiseShootTwo__count">
                  Showing {visible.length} of {filtered.length} campaigns
                </p>

                {hasMore && (
                  <button
                    type="button"
                    className="AdvertiseShootTwo__button"
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
          className="AdvertiseShootTwo__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Commercial campaign viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="AdvertiseShootTwo__lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                className="AdvertiseShootTwo__lightbox-nav AdvertiseShootTwo__lightbox-nav--prev"
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
                className="AdvertiseShootTwo__lightbox-nav AdvertiseShootTwo__lightbox-nav--next"
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
            className="AdvertiseShootTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="AdvertiseShootTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />

            <figcaption className="AdvertiseShootTwo__lightbox-caption">
              <span className="AdvertiseShootTwo__lightbox-tag">
                {activePhoto.subCategory}
              </span>

              <span className="AdvertiseShootTwo__lightbox-counter">
                {lightbox + 1} / {filtered.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
};

export default AdvertiseShootTwo;
