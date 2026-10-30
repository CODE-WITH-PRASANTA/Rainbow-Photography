import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './BabyShootTwo.css';

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
  { id: 'all', label: 'All Photos' },
  { id: 'newborn', label: 'Newborn' },
  { id: 'sitter', label: 'Sitter (6-9M)' },
  { id: 'milestone', label: 'Milestones' },
  { id: 'themes-props', label: 'Themes & Props' },
  { id: 'family-cuddles', label: 'Family Cuddles' },
];

const CATEGORY_LABELS = CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});

const PHOTOS = [
  { id: 1, image: maternity1, category: 'newborn', alt: 'Peaceful sleeping newborn portrait' },
  { id: 2, image: maternity2, category: 'sitter', alt: 'Cute sitting baby smile and expression' },
  { id: 3, image: maternity3, category: 'milestone', alt: 'Baby milestone monthly celebration portrait' },
  { id: 4, image: maternity4, category: 'themes-props', alt: 'Creative wooden basket and floral prop setup' },
  { id: 5, image: maternity5, category: 'family-cuddles', alt: 'Parents lovingly cuddling their baby' },
  { id: 6, image: maternity6, category: 'newborn', alt: 'Soft organic wrap newborn baby pose' },
  { id: 7, image: maternity7, category: 'sitter', alt: 'Curious baby sitting on studio setup' },
  { id: 8, image: maternity8, category: 'milestone', alt: 'First year standing milestone photo' },
  { id: 9, image: maternity9, category: 'themes-props', alt: 'Themed baby studio backdrop portrait' },
  { id: 10, image: maternity10, category: 'family-cuddles', alt: 'Mother and baby tender tender moments' },
  { id: 11, image: maternity11, category: 'newborn', alt: 'Tiny hands and feet newborn detail' },
  { id: 12, image: maternity12, category: 'sitter', alt: 'Joyful baby giggles during photoshoot' },
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

const BabyShootTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <li
      className="BabyShootTwo__item"
      style={{ '--delay': `${(index % PAGE_SIZE) * 70}ms` }}
    >
      <button
        type="button"
        className={`BabyShootTwo__card ${loaded ? 'is-loaded' : ''}`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        <img
          className="BabyShootTwo__image"
          src={photo.image}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          draggable="false"
          onLoad={() => setLoaded(true)}
        />
        <span className="BabyShootTwo__overlay">
          <span className="BabyShootTwo__tag">
            {CATEGORY_LABELS[photo.category]}
          </span>
          <span className="BabyShootTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

/* ---------- Main Component ---------- */

const BabyShootTwo = () => {
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
    <section className="BabyShootTwo" aria-labelledby="BabyShootTwo-title">
      <div className="BabyShootTwo__container">
        {/* Header */}
        <header className="BabyShootTwo__header">
          <span className="BabyShootTwo__eyebrow">Little Wonders Gallery</span>
          <h2 className="BabyShootTwo__title" id="BabyShootTwo-title">
            Newborn &amp; Baby Photography Portfolio
          </h2>
          <span className="BabyShootTwo__divider" aria-hidden="true" />
          <p className="BabyShootTwo__subtitle">
            Every tiny yawn, gentle touch, and innocent smile safely preserved in heartwarming, timeless portraits.
          </p>
        </header>

        {/* Filter tabs */}
        <div className="BabyShootTwo__filters" role="tablist" aria-label="Filter photos">
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
                ref={(el) => {
                  tabRefs.current[category.id] = el;
                }}
                className={`BabyShootTwo__tab ${
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
        <ul className="BabyShootTwo__grid" key={filter}>
          {visible.map((photo, index) => (
            <BabyShootTwoCard
              key={photo.id}
              photo={photo}
              index={index}
              onOpen={setLightbox}
            />
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="BabyShootTwo__empty">
            No baby portraits available in this category yet.
          </p>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="BabyShootTwo__footer">
            <p className="BabyShootTwo__count">
              Showing {visible.length} of {filtered.length} photos
            </p>
            {hasMore && (
              <button
                type="button"
                className="BabyShootTwo__button"
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
                className="BabyShootTwo__lightbox-nav BabyShootTwo__lightbox-nav--next"
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
            className="BabyShootTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="BabyShootTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />
            <figcaption className="BabyShootTwo__lightbox-caption">
              <span className="BabyShootTwo__lightbox-tag">
                {CATEGORY_LABELS[activePhoto.category]}
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