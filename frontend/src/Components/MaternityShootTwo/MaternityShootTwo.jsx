import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './MaternityShootTwo.css';

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

const PAGE_SIZE = 6; // images shown first, and added on every "Load More"

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'mehendi', label: 'Mehendi' },
  { id: 'haldi', label: 'Haldi' },
  { id: 'marriage', label: 'Marriage' },
  { id: 'reception', label: 'Reception' },
];

const CATEGORY_LABELS = CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});

/* Change the `category` of each photo to one of:
   engagement | mehendi | haldi | marriage | reception */
const PHOTOS = [
  { id: 1, image: maternity1, category: 'engagement', alt: 'Engagement photography in Bangalore' },
  { id: 2, image: maternity2, category: 'mehendi', alt: 'Mehendi ceremony photography in Bangalore' },
  { id: 3, image: maternity3, category: 'haldi', alt: 'Haldi ceremony photography in Bangalore' },
  { id: 4, image: maternity4, category: 'marriage', alt: 'Wedding photography in Bangalore' },
  { id: 5, image: maternity5, category: 'reception', alt: 'Reception photography in Bangalore' },
  { id: 6, image: maternity6, category: 'engagement', alt: 'Engagement couple portrait' },
  { id: 7, image: maternity7, category: 'mehendi', alt: 'Bride showing mehendi design' },
  { id: 8, image: maternity8, category: 'haldi', alt: 'Haldi celebration moments' },
  { id: 9, image: maternity9, category: 'marriage', alt: 'Wedding rituals captured' },
  { id: 10, image: maternity10, category: 'reception', alt: 'Reception couple portrait' },
  { id: 11, image: maternity11, category: 'engagement', alt: 'Ring ceremony photography' },
  { id: 12, image: maternity12, category: 'mehendi', alt: 'Mehendi details close-up' },
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

/* ---------- Single gallery card ---------- */

const MaternityShootTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <li
      className="MaternityShootTwo__item"
      style={{ '--delay': `${(index % PAGE_SIZE) * 70}ms` }}
    >
      <button
        type="button"
        className={`MaternityShootTwo__card ${loaded ? 'is-loaded' : ''}`}
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
            {CATEGORY_LABELS[photo.category]}
          </span>
          <span className="MaternityShootTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

/* ---------- Main component ---------- */

const MaternityShootTwo = () => {
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
    <section className="MaternityShootTwo" aria-labelledby="MaternityShootTwo-title">
      <div className="MaternityShootTwo__container">
        {/* Heading */}
        <header className="MaternityShootTwo__header">
          <span className="MaternityShootTwo__eyebrow">Our Portfolio</span>
          <h2 className="MaternityShootTwo__title" id="MaternityShootTwo-title">
            Bangalore Maternity Photography Portfolio
          </h2>
          <span className="MaternityShootTwo__divider" aria-hidden="true" />
          <p className="MaternityShootTwo__subtitle">
            Embrace the journey of motherhood with our enchanting maternity
            photoshoot in Bangalore.
          </p>
        </header>

        {/* Filter tabs */}
        <div className="MaternityShootTwo__filters" role="tablist" aria-label="Filter photos">
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
                ref={(el) => {
                  tabRefs.current[category.id] = el;
                }}
                className={`MaternityShootTwo__tab ${
                  filter === category.id ? 'is-active' : ''
                }`}
                onClick={(e) => handleFilter(category.id, e)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry gallery (re-mounts on filter change to replay the animation) */}
        <ul className="MaternityShootTwo__grid" key={filter}>
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
            No photos in this category yet.
          </p>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="MaternityShootTwo__footer">
            <p className="MaternityShootTwo__count">
              Showing {visible.length} of {filtered.length}
            </p>
            {hasMore && (
              <button
                type="button"
                className="MaternityShootTwo__button"
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
                className="MaternityShootTwo__lightbox-nav MaternityShootTwo__lightbox-nav--next"
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
            className="MaternityShootTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="MaternityShootTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />
            <figcaption className="MaternityShootTwo__lightbox-caption">
              <span className="MaternityShootTwo__lightbox-tag">
                {CATEGORY_LABELS[activePhoto.category]}
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