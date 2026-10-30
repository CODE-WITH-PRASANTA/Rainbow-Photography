import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './AdvertiseShootTwo.css';

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
  { id: 'all', label: 'All Campaigns' },
  { id: 'product', label: 'Product & Packshot' },
  { id: 'fashion', label: 'Fashion & Lookbook' },
  { id: 'brand', label: 'Brand Commercial' },
  { id: 'editorial', label: 'Editorial & Print' },
  { id: 'corporate', label: 'Corporate & Lifestyle' },
];

const CATEGORY_LABELS = CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});

const PHOTOS = [
  { id: 1, image: maternity1, category: 'product', alt: 'Luxury studio product photography setup' },
  { id: 2, image: maternity2, category: 'fashion', alt: 'High-fashion editorial model photoshoot' },
  { id: 3, image: maternity3, category: 'brand', alt: 'Brand advertising campaign visual' },
  { id: 4, image: maternity4, category: 'editorial', alt: 'Magazine cover editorial styling shoot' },
  { id: 5, image: maternity5, category: 'corporate', alt: 'Executive corporate lifestyle imagery' },
  { id: 6, image: maternity6, category: 'product', alt: 'Creative tabletop product advertising shoot' },
  { id: 7, image: maternity7, category: 'fashion', alt: 'Apparel lookbook fashion campaign portrait' },
  { id: 8, image: maternity8, category: 'brand', alt: 'Cinematic brand story and promotional visual' },
  { id: 9, image: maternity9, category: 'editorial', alt: 'High-concept creative editorial photoshoot' },
  { id: 10, image: maternity10, category: 'corporate', alt: 'Workplace team leadership campaign portrait' },
  { id: 11, image: maternity11, category: 'product', alt: 'Fine detail macro commercial product photography' },
  { id: 12, image: maternity12, category: 'fashion', alt: 'Contemporary streetwear and model campaign' },
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

const AdvertiseShootTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <li
      className="AdvertiseShootTwo__item"
      style={{ '--delay': `${(index % PAGE_SIZE) * 70}ms` }}
    >
      <button
        type="button"
        className={`AdvertiseShootTwo__card ${loaded ? 'is-loaded' : ''}`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        <img
          className="AdvertiseShootTwo__image"
          src={photo.image}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          draggable="false"
          onLoad={() => setLoaded(true)}
        />
        <span className="AdvertiseShootTwo__overlay">
          <span className="AdvertiseShootTwo__tag">
            {CATEGORY_LABELS[photo.category]}
          </span>
          <span className="AdvertiseShootTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

/* ---------- Main Component ---------- */

const AdvertiseShootTwo = () => {
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

  /* Sliding pill indicator under the active tab */
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

  /* Lightbox handlers */
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
    <section className="AdvertiseShootTwo" aria-labelledby="AdvertiseShootTwo-title">
      <div className="AdvertiseShootTwo__container">
        {/* Header */}
        <header className="AdvertiseShootTwo__header">
          <span className="AdvertiseShootTwo__eyebrow">Commercial Showcase</span>
          <h2 className="AdvertiseShootTwo__title" id="AdvertiseShootTwo-title">
            Advertising &amp; Commercial Photography Portfolio
          </h2>
          <span className="AdvertiseShootTwo__divider" aria-hidden="true" />
          <p className="AdvertiseShootTwo__subtitle">
            Engineered lighting, precise art direction, and editorial excellence crafted to scale your brand aesthetic and sales impact.
          </p>
        </header>

        {/* Filter tabs */}
        <div className="AdvertiseShootTwo__filters" role="tablist" aria-label="Filter photos">
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
                ref={(el) => {
                  tabRefs.current[category.id] = el;
                }}
                className={`AdvertiseShootTwo__tab ${
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
        <ul className="AdvertiseShootTwo__grid" key={filter}>
          {visible.map((photo, index) => (
            <AdvertiseShootTwoCard
              key={photo.id}
              photo={photo}
              index={index}
              onOpen={setLightbox}
            />
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="AdvertiseShootTwo__empty">
            No advertising campaigns found in this category.
          </p>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="AdvertiseShootTwo__footer">
            <p className="AdvertiseShootTwo__count">
              Showing {visible.length} of {filtered.length} campaigns
            </p>
            {hasMore && (
              <button
                type="button"
                className="AdvertiseShootTwo__button"
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
                className="AdvertiseShootTwo__lightbox-nav AdvertiseShootTwo__lightbox-nav--next"
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
            className="AdvertiseShootTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="AdvertiseShootTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />
            <figcaption className="AdvertiseShootTwo__lightbox-caption">
              <span className="AdvertiseShootTwo__lightbox-tag">
                {CATEGORY_LABELS[activePhoto.category]}
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