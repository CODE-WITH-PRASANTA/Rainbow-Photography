
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import API, { IMG_URL } from "../../api/axios";
import "./MaternityShootTwo.css";

const PAGE_SIZE = 6;

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "engagement", label: "Engagement", value: "Engagement" },
  { id: "mehendi", label: "Mehendi", value: "Mehendi" },
  { id: "haldi", label: "Haldi", value: "Haldi" },
  { id: "marriage", label: "Marriage", value: "Marriage" },
  { id: "reception", label: "Reception", value: "Reception" },
];

const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  const baseUrl = (IMG_URL || "").replace(/\/+$/, "");
  const image = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${baseUrl}${image}`;
};

const normalizeGalleryItem = (item) => {
  const category = CATEGORIES.find(
    (cat) =>
      cat.value?.toLowerCase() ===
      String(item.subCategory || "").toLowerCase()
  );

  return {
    id: item._id || item.id,
    image: normalizeImageUrl(item.image),
    category: category?.id || "",
    categoryLabel: item.subCategory || "",
    title: item.title || item.subCategory || "Maternity photography",
    alt: item.title || `${item.subCategory || "Maternity"} photography`,
  };
};

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
    <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const PrevIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MaternityShootTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <li
      className="MaternityShootTwo__item"
      style={{ "--delay": `${(index % PAGE_SIZE) * 70}ms` }}
    >
      <button
        type="button"
        className={`MaternityShootTwo__card ${loaded ? "is-loaded" : ""}`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        <img
          className="MaternityShootTwo__image"
          src={photo.image}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          draggable="false"
          onLoad={() => setLoaded(true)}
        />

        <span className="MaternityShootTwo__overlay">
          <span className="MaternityShootTwo__tag">
            {photo.categoryLabel}
          </span>
          <span className="MaternityShootTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

const MaternityShootTwo = () => {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tabRefs = useRef({});

  // Fetch images from MongoDB through the Gallery API.
  const fetchMaternityPhotos = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/gallery", {
        params: { category: "Maternity Shoot" },
        signal,
      });

      const records = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.gallery || [];

      const formattedPhotos = records
        .map(normalizeGalleryItem)
        .filter((photo) => photo.id && photo.image && photo.category);

      setPhotos(formattedPhotos);
    } catch (err) {
      if (
        err.name === "CanceledError" ||
        err.code === "ERR_CANCELED"
      ) {
        return;
      }

      console.error("Maternity gallery error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load maternity photos. Please try again."
      );
      setPhotos([]);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchMaternityPhotos(controller.signal);

    return () => controller.abort();
  }, [fetchMaternityPhotos]);

  // Filter by the subCategory saved in the admin panel.
  const filtered = useMemo(
    () =>
      filter === "all"
        ? photos
        : photos.filter((photo) => photo.category === filter),
    [photos, filter]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Active category sliding indicator.
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

    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

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

  // Lightbox controls.
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const showPrev = useCallback(() => {
    setLightbox((current) =>
      current === null
        ? current
        : (current - 1 + filtered.length) % filtered.length
    );
  }, [filtered.length]);

  const showNext = useCallback(() => {
    setLightbox((current) =>
      current === null
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

  useEffect(() => {
    if (lightbox !== null && lightbox >= filtered.length) {
      setLightbox(filtered.length ? 0 : null);
    }
  }, [filtered.length, lightbox]);

  const activePhoto = lightbox !== null ? filtered[lightbox] : null;

  return (
    <section
      className="MaternityShootTwo"
      aria-labelledby="MaternityShootTwo-title"
    >
      <div className="MaternityShootTwo__container">

        <header className="MaternityShootTwo__header">
          <span className="MaternityShootTwo__eyebrow">
            Our Portfolio
          </span>

          <h2
            className="MaternityShootTwo__title"
            id="MaternityShootTwo-title"
          >
            Bangalore Maternity Photography Portfolio
          </h2>

          <span
            className="MaternityShootTwo__divider"
            aria-hidden="true"
          />

          <p className="MaternityShootTwo__subtitle">
            Embrace the journey of motherhood with our enchanting maternity
            photoshoot in Bangalore.
          </p>
        </header>

        {/* Category tabs */}
        <div
          className="MaternityShootTwo__filters"
          role="tablist"
          aria-label="Filter maternity photos"
        >
          <div className="MaternityShootTwo__tabs">

            <span
              className="MaternityShootTwo__indicator"
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
                className={`MaternityShootTwo__tab ${
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
          <div className="MaternityShootTwo__empty" role="status">
            Loading maternity photos...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="MaternityShootTwo__empty" role="alert">
            <p>{error}</p>

            <button
              type="button"
              className="MaternityShootTwo__button"
              onClick={() => fetchMaternityPhotos()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Gallery */}
        {!loading && !error && (
          <>
            <ul
              className="MaternityShootTwo__grid"
              key={filter}
            >
              {visible.map((photo, index) => (
                <MaternityShootTwoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onOpen={setLightbox}
                />
              ))}
            </ul>

            {filtered.length === 0 && (
              <p className="MaternityShootTwo__empty">
                No photos have been added to this category yet.
              </p>
            )}

            {filtered.length > 0 && (
              <div className="MaternityShootTwo__footer">
                <p className="MaternityShootTwo__count">
                  Showing {visible.length} of {filtered.length}
                </p>

                {hasMore && (
                  <button
                    type="button"
                    className="MaternityShootTwo__button"
                    onClick={() =>
                      setVisibleCount((count) => count + PAGE_SIZE)
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
          className="MaternityShootTwo__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="MaternityShootTwo__lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                className="MaternityShootTwo__lightbox-nav MaternityShootTwo__lightbox-nav--prev"
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
                className="MaternityShootTwo__lightbox-nav MaternityShootTwo__lightbox-nav--next"
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
            className="MaternityShootTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="MaternityShootTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />

            <figcaption className="MaternityShootTwo__lightbox-caption">
              <span className="MaternityShootTwo__lightbox-tag">
                {activePhoto.categoryLabel}
              </span>

              <span className="MaternityShootTwo__lightbox-counter">
                {lightbox + 1} / {filtered.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
};

export default MaternityShootTwo;
