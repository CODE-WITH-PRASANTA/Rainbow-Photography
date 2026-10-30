import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './BirthdaySpecialTwo.css';

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
  { id: 'all', label: 'All Celebrations' },
  { id: 'cake-smash', label: 'Cake Smash' },
  { id: 'kids-party', label: 'Kids Party' },
  { id: 'milestone', label: 'Milestones' },
  { id: 'themed-decor', label: 'Themed Decor' },
  { id: 'family-moments', label: 'Family Moments' },
];

const CATEGORY_LABELS = CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});

const PHOTOS = [
  { id: 1, image: maternity1, category: 'cake-smash', alt: 'Fun cake smash photography session' },
  { id: 2, image: maternity2, category: 'kids-party', alt: 'Kids birthday party candid celebration' },
  { id: 3, image: maternity3, category: 'milestone', alt: 'First year milestone birthday portrait' },
  { id: 4, image: maternity4, category: 'themed-decor', alt: 'Magical balloon and theme setup' },
  { id: 5, image: maternity5, category: 'family-moments', alt: 'Family cheering around birthday cake' },
  { id: 6, image: maternity6, category: 'cake-smash', alt: 'Joyful toddler cake smash celebration' },
  { id: 7, image: maternity7, category: 'kids-party', alt: 'Birthday party candid laughs and games' },
  { id: 8, image: maternity8, category: 'milestone', alt: 'Grand milestone birthday portrait session' },
  { id: 9, image: maternity9, category: 'themed-decor', alt: 'Fairytale themed birthday backdrop setup' },
  { id: 10, image: maternity10, category: 'family-moments', alt: 'Heartfelt parents and child birthday portrait' },
  { id: 11, image: maternity11, category: 'cake-smash', alt: 'Little hands enjoying cake smash moments' },
  { id: 12, image: maternity12, category: 'kids-party', alt: 'Candle blowing and birthday celebrations' },
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

const BirthdaySpecialTwoCard = ({ photo, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <li
      className="BirthdaySpecialTwo__item"
      style={{ '--delay': `${(index % PAGE_SIZE) * 70}ms` }}
    >
      <button
        type="button"
        className={`BirthdaySpecialTwo__card ${loaded ? 'is-loaded' : ''}`}
        onClick={() => onOpen(index)}
        aria-label={`Open photo: ${photo.alt}`}
      >
        <img
          className="BirthdaySpecialTwo__image"
          src={photo.image}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          draggable="false"
          onLoad={() => setLoaded(true)}
        />
        <span className="BirthdaySpecialTwo__overlay">
          <span className="BirthdaySpecialTwo__tag">
            {CATEGORY_LABELS[photo.category]}
          </span>
          <span className="BirthdaySpecialTwo__zoom">
            <ZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
};

/* ---------- Main Component ---------- */

const BirthdaySpecialTwo = () => {
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
    <section className="BirthdaySpecialTwo" aria-labelledby="BirthdaySpecialTwo-title">
      <div className="BirthdaySpecialTwo__container">
        {/* Heading */}
        <header className="BirthdaySpecialTwo__header">
          <span className="BirthdaySpecialTwo__eyebrow">Birthday Celebrations</span>
          <h2 className="BirthdaySpecialTwo__title" id="BirthdaySpecialTwo-title">
            Birthday &amp; Milestone Photography Portfolio
          </h2>
          <span className="BirthdaySpecialTwo__divider" aria-hidden="true" />
          <p className="BirthdaySpecialTwo__subtitle">
            Cherish every joyful chuckle, playful cake smash, and candle-blowing moment with our bespoke birthday photography sessions.
          </p>
        </header>

        {/* Filter tabs */}
        <div className="BirthdaySpecialTwo__filters" role="tablist" aria-label="Filter photos">
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
                ref={(el) => {
                  tabRefs.current[category.id] = el;
                }}
                className={`BirthdaySpecialTwo__tab ${
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
        <ul className="BirthdaySpecialTwo__grid" key={filter}>
          {visible.map((photo, index) => (
            <BirthdaySpecialTwoCard
              key={photo.id}
              photo={photo}
              index={index}
              onOpen={setLightbox}
            />
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="BirthdaySpecialTwo__empty">
            No celebration photos in this category yet.
          </p>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="BirthdaySpecialTwo__footer">
            <p className="BirthdaySpecialTwo__count">
              Showing {visible.length} of {filtered.length} photos
            </p>
            {hasMore && (
              <button
                type="button"
                className="BirthdaySpecialTwo__button"
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
                className="BirthdaySpecialTwo__lightbox-nav BirthdaySpecialTwo__lightbox-nav--next"
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
            className="BirthdaySpecialTwo__lightbox-figure"
            key={activePhoto.id}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="BirthdaySpecialTwo__lightbox-image"
              src={activePhoto.image}
              alt={activePhoto.alt}
            />
            <figcaption className="BirthdaySpecialTwo__lightbox-caption">
              <span className="BirthdaySpecialTwo__lightbox-tag">
                {CATEGORY_LABELS[activePhoto.category]}
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