import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";
import "./HomeHeroSection.css";

import heroImage1 from "../../assets/heroimage-1.webp";
import heroImage2 from "../../assets/heroimage-2.webp";
import heroImage3 from "../../assets/heroimage-3.webp";
import heroImage4 from "../../assets/heroimage-4.webp";
import heroImage5 from "../../assets/heroimage-5.webp";
import heroImage6 from "../../assets/heroimage-6.webp";
import heroImage7 from "../../assets/heroimage-7.webp";
import heroImage8 from "../../assets/heroimage-8.webp";
import heroImage9 from "../../assets/heroimage-9.webp";
import heroImage10 from "../../assets/heroimage-10.webp";
import heroImage11 from "../../assets/heroimage-11.webp";
import heroImage12 from "../../assets/heroimage-12.webp";

const AUTOPLAY_DELAY = 3000;
const SLIDE_DURATION = 900;
const INSTANT_JUMP_LIMIT = 4;
const SWIPE_THRESHOLD = 40;

const SLIDES = [
  {
    id: 1,
    image: heroImage1,
    title: "Event Photography",
    description:
      "From grand celebrations to intimate gatherings, we capture the emotions, details, and unforgettable moments that make every event special.",
    label: "Events",
    link: "/gallery",
  },
  {
    id: 2,
    image: heroImage2,
    title: "Pre-Wedding Photography",
    description:
      "Celebrate your love story with romantic pre-wedding portraits, beautiful locations, and timeless photographs filled with genuine emotions.",
    label: "Love Stories",
    link: "/gallery",
  },
  {
    id: 3,
    image: heroImage3,
    title: "Baby Photography",
    description:
      "Every tiny smile, little expression, and precious first moment deserves to be remembered. We turn your baby's sweetest memories into lasting treasures.",
    label: "Little Wonders",
    link: "/gallery",
  },
  {
    id: 4,
    image: heroImage4,
    title: "Maternity Photography",
    description:
      "Celebrate the beautiful journey of motherhood with elegant maternity portraits that preserve the love, anticipation, and magic of this special time.",
    label: "Motherhood",
    link: "/gallery",
  },
  {
    id: 5,
    image: heroImage5,
    title: "Wedding Photography",
    description:
      "From the first look to the final farewell, we document your wedding with creativity, emotion, and an eye for every beautiful detail.",
    label: "Forever Begins",
    link: "/gallery",
  },
  {
    id: 6,
    image: heroImage6,
    title: "Family Photography",
    description:
      "Bring your family together for natural, heartfelt portraits that celebrate your connection and become treasured memories for generations.",
    label: "Family Moments",
    link: "/gallery",
  },
  {
    id: 7,
    image: heroImage7,
    title: "Haldi & Mehendi Photography",
    description:
      "Capture vibrant traditions, joyful laughter, beautiful rituals, and colourful celebrations with photographs that bring your memories to life.",
    label: "Traditions",
    link: "/gallery",
  },
  {
    id: 8,
    image: heroImage8,
    title: "Engagement Photography",
    description:
      "Celebrate the beginning of forever with elegant engagement portraits that reflect your personalities, connection, and excitement for the future.",
    label: "The Beginning",
    link: "/gallery",
  },
  {
    id: 9,
    image: heroImage9,
    title: "Birthday Photography",
    description:
      "From candles and cake to laughter and surprises, we preserve every joyful moment of your special day with beautiful photography.",
    label: "Celebrations",
    link: "/gallery",
  },
  {
    id: 10,
    image: heroImage10,
    title: "Cake Smash Photography",
    description:
      "Celebrate your little one's first birthday with playful portraits, adorable expressions, and fun-filled memories you will cherish forever.",
    label: "Little Memories",
    link: "/gallery",
  },
  {
    id: 11,
    image: heroImage11,
    title: "Corporate Photography",
    description:
      "Present your business with confidence through professional team portraits, corporate events, and brand imagery that makes a lasting impression.",
    label: "Professional",
    link: "/gallery",
  },
  {
    id: 12,
    image: heroImage12,
    title: "Portrait Photography",
    description:
      "Discover the beauty of authentic expression through thoughtfully composed portraits that showcase your personality, confidence, and individuality.",
    label: "Your Story",
    link: "/gallery",
  },
];

const TOTAL = SLIDES.length;

const pad = (number) => String(number).padStart(2, "0");

const ArrowLeft = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M19 12H5M11 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HomeHeroSection = () => {
  const [queue, setQueue] = useState(() =>
    SLIDES.map((_, index) => index)
  );

  const [shift, setShift] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const queueRef = useRef(queue);
  const busyRef = useRef(false);
  const timersRef = useRef(new Set());
  const touchStartX = useRef(null);

  const current = SLIDES[activeIndex];

  const schedule = useCallback((callback, delay) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);

    timersRef.current.add(timer);

    return timer;
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
    };
  }, []);

  // Move the carousel continuously from right to left.
  const advance = useCallback(
    (steps) => {
      if (
        busyRef.current ||
        steps <= 0 ||
        steps >= TOTAL
      ) {
        return;
      }

      busyRef.current = true;

      const currentQueue = queueRef.current;

      setActiveIndex(currentQueue[steps]);

      const commit = () => {
        const rotated = [
          ...currentQueue.slice(steps),
          ...currentQueue.slice(0, steps),
        ];

        queueRef.current = rotated;

        // Reset the track without a visible reverse animation.
        setAnimate(false);
        setShift(0);
        setQueue(rotated);

        schedule(() => {
          setAnimate(true);
          busyRef.current = false;
        }, 60);
      };

      if (steps > INSTANT_JUMP_LIMIT) {
        commit();
        return;
      }

      setShift(steps);

      schedule(commit, SLIDE_DURATION);
    },
    [schedule]
  );

  const next = useCallback(() => {
    advance(1);
  }, [advance]);

  // Previous slide enters from the left.
  const prev = useCallback(() => {
    if (busyRef.current) return;

    busyRef.current = true;

    const currentQueue = queueRef.current;

    const rotated = [
      currentQueue[currentQueue.length - 1],
      ...currentQueue.slice(0, -1),
    ];

    queueRef.current = rotated;

    setActiveIndex(rotated[0]);

    setAnimate(false);
    setShift(1);
    setQueue(rotated);

    schedule(() => {
      setAnimate(true);
      setShift(0);

      schedule(() => {
        busyRef.current = false;
      }, SLIDE_DURATION);
    }, 60);
  }, [schedule]);

  const goTo = useCallback(
    (slideIndex) => {
      if (busyRef.current) return;

      const position =
        queueRef.current.indexOf(slideIndex);

      if (position <= 0) return;

      if (position === TOTAL - 1) {
        prev();
      } else {
        advance(position);
      }
    },
    [advance, prev]
  );

  // Automatically change the active image every three seconds.
  useEffect(() => {
    if (paused) return undefined;

    const timer = setTimeout(next, AUTOPLAY_DELAY);

    return () => clearTimeout(timer);
  }, [activeIndex, paused, next]);

  // Pause automatic movement when the browser tab is hidden.
  useEffect(() => {
    const handleVisibility = () => {
      setPaused(document.hidden);
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  const handleTouchStart = (event) => {
    touchStartX.current =
      event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const difference =
      touchStartX.current -
      event.changedTouches[0].clientX;

    if (Math.abs(difference) > SWIPE_THRESHOLD) {
      if (difference > 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = null;
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  };

  return (
    <section
      className="HomeHeroSection"
      aria-roledescription="carousel"
      aria-label="Rainbow Photography featured services"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-screen photography backgrounds */}
      <div
        className="HomeHeroSection__backgrounds"
        aria-hidden="true"
      >
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`HomeHeroSection__background ${
              index === activeIndex ? "is-active" : ""
            }`}
          >
            <img
              className="HomeHeroSection__background-image"
              src={slide.image}
              alt=""
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
          </div>
        ))}

        <div className="HomeHeroSection__overlay" />
      </div>

      {/* Vertical slide navigation */}
      <ul
        className="HomeHeroSection__timeline"
        aria-label="Slide navigation"
      >
        {SLIDES.map((slide, index) => (
          <li
            key={slide.id}
            className="HomeHeroSection__timeline-item"
          >
            <button
              type="button"
              className={`HomeHeroSection__timeline-button ${
                index === activeIndex ? "is-active" : ""
              }`}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-current={
                index === activeIndex ? "true" : undefined
              }
            >
              <span className="HomeHeroSection__timeline-dot">
                {index + 1}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="HomeHeroSection__inner">
        {/* Brand introduction and changing service content */}
        <div
          className="HomeHeroSection__content"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className="HomeHeroSection__content-inner"
            key={current.id}
          >
            <div className="HomeHeroSection__brand">
              <span className="HomeHeroSection__brand-line" />

              <span className="HomeHeroSection__brand-name">
                RAINBOW PHOTOGRAPHY
              </span>
            </div>

            <span className="HomeHeroSection__eyebrow">
              CAPTURING LIFE, CREATING MEMORIES
            </span>

            <h1 className="HomeHeroSection__title">
              Every Picture
              <br />
              <span className="HomeHeroSection__title-accent">
                Tells a Story.
              </span>
            </h1>

            <p className="HomeHeroSection__intro">
              Welcome to Rainbow Photography, where your most
              precious moments become timeless memories. Through
              creativity, emotion, and an eye for every beautiful
              detail, we capture the stories that make your life
              extraordinary.
            </p>

            <div className="HomeHeroSection__service">
              <span className="HomeHeroSection__service-number">
                {pad(activeIndex + 1)} / {pad(TOTAL)}
              </span>

              <span className="HomeHeroSection__service-divider" />

              <span className="HomeHeroSection__service-label">
                {current.label}
              </span>
            </div>

            <h2 className="HomeHeroSection__service-title">
              {current.title}
            </h2>

            <p className="HomeHeroSection__description">
              {current.description}
            </p>

            <div className="HomeHeroSection__actions">
              <Link
                className="HomeHeroSection__button"
                to="/gallery"
              >
                Explore Our Gallery
                <ArrowRight />
              </Link>

              <Link
                className="HomeHeroSection__secondary-button"
                to="/contact"
              >
                Book a Session
              </Link>
            </div>

            <div className="HomeHeroSection__signature">
              <span className="HomeHeroSection__signature-line" />
              <span>
                Your Moments. Our Passion. Your Memories.
              </span>
            </div>
          </div>
        </div>

        {/* Right-side endless image carousel */}
        <div
          className="HomeHeroSection__carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget
              )
            ) {
              setPaused(false);
            }
          }}
        >
          <div className="HomeHeroSection__carousel-heading">
            <span>OUR PORTFOLIO</span>
            <span className="HomeHeroSection__carousel-heading-line" />
          </div>

          <div className="HomeHeroSection__viewport">
            <ul
              className={`HomeHeroSection__track ${
                animate ? "" : "is-static"
              }`}
              style={{ "--hero-shift": shift }}
            >
              {queue.map((slideIndex, position) => {
                const slide = SLIDES[slideIndex];
                const isActive = position === shift;

                return (
                  <li
                    key={slide.id}
                    className="HomeHeroSection__slide"
                    aria-roledescription="slide"
                    aria-label={`${slideIndex + 1} of ${TOTAL}`}
                  >
                    <button
                      type="button"
                      className={`HomeHeroSection__card ${
                        isActive ? "is-active" : ""
                      }`}
                      onClick={() => goTo(slideIndex)}
                      aria-label={`Show ${slide.title}`}
                      aria-pressed={slideIndex === activeIndex}
                    >
                      <img
                        className="HomeHeroSection__card-image"
                        src={slide.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                      />

                      <span className="HomeHeroSection__card-number">
                        {pad(slideIndex + 1)}
                      </span>

                      <span className="HomeHeroSection__card-caption">
                        <span className="HomeHeroSection__card-title">
                          {slide.title}
                        </span>

                        <span className="HomeHeroSection__card-label">
                          {slide.label}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Carousel controls */}
          <div className="HomeHeroSection__controls">
            <div className="HomeHeroSection__controls-left">
              <button
                type="button"
                className="HomeHeroSection__arrow"
                onClick={prev}
                aria-label="Previous slide"
              >
                <ArrowLeft />
              </button>

              <button
                type="button"
                className="HomeHeroSection__arrow"
                onClick={next}
                aria-label="Next slide"
              >
                <ArrowRight />
              </button>
            </div>

            <span className="HomeHeroSection__progress">
              <span
                key={`${activeIndex}-progress`}
                className={`HomeHeroSection__progress-bar ${
                  paused ? "is-paused" : ""
                }`}
              />
            </span>

            <span className="HomeHeroSection__progress-count">
              {pad(activeIndex + 1)}
              <span>/</span>
              {pad(TOTAL)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;