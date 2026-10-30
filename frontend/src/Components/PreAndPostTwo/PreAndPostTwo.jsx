import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './PreAndPostTwo.css';

import maternity1 from '../../assets/MaternityTwo-1.webp';
import maternity2 from '../../assets/MaternityTwo-2.webp';
import maternity3 from '../../assets/MaternityTwo-3.webp';
import maternity4 from '../../assets/MaternityTwo-4.webp';
import maternity5 from '../../assets/MaternityTwo-5.webp';
import maternity6 from '../../assets/MaternityTwo-6.webp';
import maternity7 from '../../assets/MaternityTwo-7.webp';
import maternity8 from '../../assets/MaternityTwo-8.webp';
import maternity9 from '../../assets/MaternityTwo-9.webp';
import maternity10 from '../../assets/MaternityTwo-10.webp';
import maternity11 from '../../assets/MaternityTwo-11.webp';
import maternity12 from '../../assets/MaternityTwo-12.jpeg';

const PAGE_SIZE = 6;

const CATEGORIES = [
  { id: 'all', label: 'All Stories' },
  { id: 'pre-wedding', label: 'Pre-Wedding' },
  { id: 'post-wedding', label: 'Post-Wedding' },
  { id: 'destination', label: 'Destinations' },
  { id: 'sunset-candid', label: 'Sunset & Candids' },
  { id: 'heritage', label: 'Heritage & Royal' },
];

const CATEGORY_LABELS = CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});

const PHOTOS = [
  { id: 1, image: maternity1, category: 'pre-wedding', alt: 'Romantic pre-wedding couple portrait' },
  { id: 2, image: maternity2, category: 'post-wedding', alt: 'Candid post-wedding celebration shoot' },
  { id: 3, image: maternity3, category: 'destination', alt: 'Scenic destination couple photoshoot' },
  { id: 4, image: maternity4, category: 'sunset-candid', alt: 'Golden hour sunset couple portrait' },
  { id: 5, image: maternity5, category: 'heritage', alt: 'Royal heritage architectural couple shoot' },
  { id: 6, image: maternity6, category: 'pre-wedding', alt: 'Intimate pre-wedding love story portrait' },
  { id: 7, image: maternity7, category: 'post-wedding', alt: 'Post-wedding traditional attire portrait' },
  { id: 8, image: maternity8, category: 'destination', alt: 'Beachside destination couple photography' },
  { id: 9, image: maternity9, category: 'sunset-candid', alt: 'Spontaneous candid laugh during golden hour' },
  { id: 10, image: maternity10, category: 'heritage', alt: 'Palatial temple backdrop pre-wedding frame' },
  { id: 11, image: maternity11, category: 'pre-wedding', alt: 'Cinematic ring exchange concept frame' },
  { id: 12, image: maternity12, category: 'post-wedding', alt: 'Relaxed post-wedding romantic walk portrait' },
];

/* ---------- Icons ---------- */

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
    <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const PrevIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Single Gallery Card ---------- */

const PreAndPostTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <li
      className="PreAndPostTwo__item"
      style={{ '--delay': `${(index % PAGE_SIZE) * 70}ms` }}
    >
      <button
        type="button"
        className={`PreAndPostTwo__card ${loaded ? 'is-loaded' : ''}`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        <img
          className="PreAndPostTwo__image"
          src={photo.image}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          draggable="false"
          onLoad={() => setLoaded(true)}
        />
        <span className="PreAndPostTwo__overlay">
          <span className="PreAndPostTwo__tag">
            {CATEGORY_LABELS[photo.category]}
          </span>
          <span className="PreAndPostTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

/* ---------- Main Component ---------- */

const PreAndPostTwo = () => {
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});

  const filtered = useMemo(
    () =>
      filter === 'all' ? PHOTOS : PHOTOS.filter((p) => p.category === filter),
    [filter]
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  /* Sliding pill behind the active tab */
  const updateIndicator = useCallback(() => {
    const el = tabRefs.current[filter];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [filter]);

  useLayoutEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateIndicator);
    }
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const handleFilter = (id, event) => {
    if (id === filter) return;
    setFilter(id);
    setVisibleCount(PAGE_SIZE);
    setLightbox(null);
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  /* Lightbox controls */
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const showPrev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );
  const showNext = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (lightbox === null) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox, showPrev, showNext]);

  const activePhoto = lightbox !== null ? filtered[lightbox] : null;

  return (
    <section className="PreAndPostTwo" aria-labelledby="PreAndPostTwo-title">
      <div className="PreAndPostTwo__container">
        {/* Header */}
        <header className="PreAndPostTwo__header">
          <span className="PreAndPostTwo__eyebrow">Our Couple Stories</span>
          <h2 className="PreAndPostTwo__title" id="PreAndPostTwo-title">
            Pre &amp; Post Wedding Portfolio
          </h2>
          <span className="PreAndPostTwo__divider" aria-hidden="true" />
          <p className="PreAndPostTwo__subtitle">
            Relive your connection through sweeping destination vistas, intimate candlelit portraits, and effortless candid laughter.
          </p>
        </header>

        {/* Filter tabs */}
        <div className="PreAndPostTwo__filters" role="tablist" aria-label="Filter photos">
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
                ref={(el) => {
                  tabRefs.current[category.id] = el;
                }}
                className={`PreAndPostTwo__tab ${
                  filter === category.id ? 'is-active' : ''
                }`}
                onClick={(e) => handleFilter(category.id, e)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry gallery */}
        <ul className="PreAndPostTwo__grid" key={filter}>
          {visible.map((photo, index) => (
            <PreAndPostTwoCard
              key={photo.id}
              photo={photo}
              index={index}
              onOpen={setLightbox}
            />
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="PreAndPostTwo__empty">
            No couple photographs in this category yet.
          </p>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="PreAndPostTwo__footer">
            <p className="PreAndPostTwo__count">
              Showing {visible.length} of {filtered.length} photos
            </p>
            {hasMore && (
              <button
                type="button"
                className="PreAndPostTwo__button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Load More
              </button>
            )}
          </div>
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
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous photo"
              >
                <PrevIcon />
              </button>
              <button
                type="button"
                className="PreAndPostTwo__lightbox-nav PreAndPostTwo__lightbox-nav--next"
                onClick={(e) => {
                  e.stopPropagation();
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
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="PreAndPostTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />
            <figcaption className="PreAndPostTwo__lightbox-caption">
              <span className="PreAndPostTwo__lightbox-tag">
                {CATEGORY_LABELS[activePhoto.category]}
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