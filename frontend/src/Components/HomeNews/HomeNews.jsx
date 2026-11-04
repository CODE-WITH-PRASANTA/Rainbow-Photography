import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./HomeNews.css";
import API from "../../api/axios";

/* Images */
import bgFlower from "../../assets/LeftFlower-2.webp";
import headingFlower from "../../assets/TwinFlower-1.webp";
import cardFlower from "../../assets/Flower-33.webp";

/* Constants */
const MAX_REVIEW = 500;
const MIN_REVIEW = 10;

const SLIDE_INTERVAL = 3000;
const SLIDE_SPEED = 800;

const EMPTY_FORM = {
  name: "",
  location: "",
  rating: 0,
  message: "",
};

/* ================= HELPERS ================= */

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "R";

/* Cards visible at once */
const getPerView = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
};

const pad = (number) => String(number).padStart(2, "0");

/* Form validation */
const validate = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!values.location.trim()) {
    errors.location = "Enter your location.";
  }

  if (!values.rating) {
    errors.rating = "Select a rating.";
  }

  if (!values.message.trim()) {
    errors.message = "Write your review.";
  } else if (values.message.trim().length < MIN_REVIEW) {
    errors.message = `At least ${MIN_REVIEW} characters please.`;
  }

  return errors;
};

/* ================= ICONS ================= */

const Icon = ({ children, size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const UserIcon = () => (
  <Icon>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
  </Icon>
);

const PinIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
  </Icon>
);

const ChatIcon = () => (
  <Icon>
    <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
  </Icon>
);

const SendIcon = () => (
  <Icon size={19}>
    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
  </Icon>
);

const QuoteIcon = () => (
  <svg
    viewBox="0 0 64 48"
    aria-hidden="true"
    className="HomeNews__quoteSvg"
  >
    <path
      fill="currentColor"
      d="M0 48V28C0 12 9 2 26 0v10C17 12 14 17 14 24h12v24H0zm36 0V28C36 12 45 2 62 0v10c-9 2-12 7-12 14h12v24H36z"
    />
  </svg>
);

/* ================= CAMERA LENS BADGE ================= */

const LensBadge = () => (
  <svg
    viewBox="0 0 200 200"
    className="HomeNews__lens"
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id="hnGold"
        x1="0"
        y1="0"
        x2="1"
        y2="1"
      >
        <stop offset="0" stopColor="#f5b301" />
        <stop offset="0.5" stopColor="#d4af37" />
        <stop offset="1" stopColor="#a35a2d" />
      </linearGradient>
    </defs>

    <circle
      cx="100"
      cy="100"
      r="92"
      fill="#fff"
      stroke="url(#hnGold)"
      strokeWidth="6"
    />

    <circle cx="100" cy="100" r="74" fill="#2a1f1a" />

    {[
      "#ef4b4b",
      "#f7952b",
      "#f5d90a",
      "#3fb37f",
      "#3f8fe0",
      "#8a63d2",
    ].map((color, index) => (
      <circle
        key={color}
        cx="100"
        cy="100"
        r={68 - index * 8}
        fill="none"
        stroke={color}
        strokeWidth="6"
      />
    ))}

    <circle cx="100" cy="100" r="18" fill="#120c09" />
    <circle cx="92" cy="92" r="6" fill="#fff" opacity=".85" />
  </svg>
);

/* ================= STAR RATING INPUT ================= */

const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div
      className="HomeNews__starInput"
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((number) => (
        <button
          type="button"
          key={number}
          role="radio"
          aria-checked={value === number}
          aria-label={`${number} star${number > 1 ? "s" : ""}`}
          className={`HomeNews__starBtn ${
            number <= active ? "is-on" : ""
          }`}
          onMouseEnter={() => setHover(number)}
          onFocus={() => setHover(number)}
          onBlur={() => setHover(0)}
          onClick={() => onChange(number)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const HomeNews = () => {
  /* Reviews from MongoDB */
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  /* Responsive slider */
  const [perView, setPerView] = useState(getPerView());

  /* Slider */
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  /* Form */
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listRef = useRef(null);

  /* Reduced motion preference */
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches,
    []
  );

  /* ================= FETCH REVIEWS ================= */

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await API.get("/testimonials/public");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to fetch reviews."
        );
      }

      const reviewData = response.data?.data;

      setReviews(Array.isArray(reviewData) ? reviewData : []);
    } catch (error) {
      console.error(
        "Fetch reviews error:",
        error.response?.data || error.message
      );

      setReviews([]);

      setMessageType("error");
      setSuccessMsg(
        error.response?.data?.message ||
          "Unable to load reviews. Please try again later."
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  /* Fetch reviews when component loads */
  useEffect(() => {
    fetchReviews();
  }, []);

  /* ================= SLIDER DATA ================= */

  const total = reviews.length;
  const canSlide = total > perView;

  const slides = useMemo(
    () =>
      canSlide
        ? [...reviews, ...reviews.slice(0, perView)]
        : reviews,
    [reviews, perView, canSlide]
  );

  /* ================= RESPONSIVE SLIDER ================= */

  useEffect(() => {
    const handleResize = () => {
      setPerView(getPerView());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* Reset slider when reviews/layout change */
  useEffect(() => {
    setAnimate(false);
    setIndex(0);
  }, [total, perView]);

  /* Automatic slider */
  useEffect(() => {
    if (!canSlide || paused || reducedMotion) return;

    const timer = setTimeout(() => {
      setAnimate(true);

      setIndex((previous) =>
        previous >= total ? previous : previous + 1
      );
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [index, canSlide, paused, total, reducedMotion]);

  /* Seamless slider reset */
  useEffect(() => {
    if (!canSlide || index < total) return;

    const timer = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, SLIDE_SPEED + 100);

    return () => clearTimeout(timer);
  }, [index, total, canSlide]);

  /* Hide notification */
  useEffect(() => {
    if (!successMsg) return;

    const timer = setTimeout(() => {
      setSuccessMsg("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [successMsg]);

  /* ================= SLIDER CONTROLS ================= */

  const goNext = () => {
    if (!canSlide || index >= total) return;

    setAnimate(true);
    setIndex(index + 1);
  };

  const goPrev = () => {
    if (!canSlide) return;

    if (index === 0) {
      setAnimate(false);
      setIndex(total);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
          setIndex(total - 1);
        });
      });
    } else {
      setAnimate(true);
      setIndex(index - 1);
    }
  };

  /* ================= FORM HANDLING ================= */

  const setField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const handleChange = (event) => {
    setField(event.target.name, event.target.value);
  };

  /* ================= SUBMIT REVIEW TO MONGODB ================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const foundErrors = validate(form);

    setErrors(foundErrors);

    if (Object.keys(foundErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSuccessMsg("");

      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        rating: Number(form.rating),
        message: form.message.trim(),
      };

      /*
        Axios sends:
        POST http://localhost:5000/api/testimonials

        Backend saves the review as Unpublished.
      */

      const response = await API.post(
        "/testimonials",
        payload
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to submit your review."
        );
      }

      /* Clear form after successful API response */
      setForm(EMPTY_FORM);
      setErrors({});

      setMessageType("success");

      setSuccessMsg(
        response.data?.message ||
          "Thank you! Your review has been submitted and is awaiting approval."
      );

      /* Scroll to review section */
      setTimeout(() => {
        listRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (error) {
      console.error(
        "Submit review error:",
        error.response?.data || error.message
      );

      setMessageType("error");

      setSuccessMsg(
        error.response?.data?.message ||
          error.message ||
          "Unable to submit your review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Current slide number */
  const currentNumber =
    total === 0 ? 0 : (index % total) + 1;

  /* ================= JSX ================= */

  return (
    <section className="HomeNews">

      {/* Background flowers */}

      <img
        src={bgFlower}
        className="HomeNews__bg HomeNews__bg--bottom"
        alt=""
      />

      <img
        src={bgFlower}
        className="HomeNews__bg HomeNews__bg--top"
        alt=""
      />

      {/* Header */}

      <div className="HomeNews__header">
        <span className="HomeNews__label">
          TESTIMONIALS
        </span>

        <h2 className="HomeNews__title">
          What Our Clients Say
        </h2>

        <img
          src={headingFlower}
          className="HomeNews__headingFlower"
          alt=""
        />
      </div>

      {/* Review form */}

      <div
        className="HomeNews__formCard"
        id="share-experience"
      >

        {/* Left intro */}

        <div className="HomeNews__intro">
          <LensBadge />

          <div className="HomeNews__introText">
            <span className="HomeNews__introLabel">
              YOUR VOICE MATTERS
            </span>

            <h3>
              Share Your <span>Experience</span>
            </h3>

            <i className="HomeNews__introLine" />

            <p>
              Your feedback helps us grow and capture more beautiful moments.
            </p>
          </div>
        </div>

        {/* Right form */}

        <form
          className="HomeNews__form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Name */}

          <div className="HomeNews__field">
            <label htmlFor="hn-name">
              Name <em>*</em>
            </label>

            <div
              className={`HomeNews__inputWrap ${
                errors.name ? "is-invalid" : ""
              }`}
            >
              <UserIcon />

              <input
                id="hn-name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                maxLength={60}
                autoComplete="name"
              />
            </div>

            {errors.name && (
              <p className="HomeNews__err">
                {errors.name}
              </p>
            )}
          </div>

          {/* Location */}

          <div className="HomeNews__field">
            <label htmlFor="hn-location">
              Location <em>*</em>
            </label>

            <div
              className={`HomeNews__inputWrap ${
                errors.location ? "is-invalid" : ""
              }`}
            >
              <PinIcon />

              <input
                id="hn-location"
                name="location"
                type="text"
                placeholder="e.g. Bhubaneswar"
                value={form.location}
                onChange={handleChange}
                maxLength={60}
                autoComplete="address-level2"
              />
            </div>

            {errors.location && (
              <p className="HomeNews__err">
                {errors.location}
              </p>
            )}
          </div>

          {/* Rating */}

          <div className="HomeNews__field">
            <label>
              Rating <em>*</em>
            </label>

            <div
              className={`HomeNews__ratingBox ${
                errors.rating ? "is-invalid" : ""
              }`}
            >
              <StarInput
                value={form.rating}
                onChange={(number) =>
                  setField("rating", number)
                }
              />
            </div>

            {errors.rating && (
              <p className="HomeNews__err">
                {errors.rating}
              </p>
            )}
          </div>

          {/* Review message */}

          <div className="HomeNews__field HomeNews__field--full">
            <label htmlFor="hn-message">
              Your Review <em>*</em>
            </label>

            <div
              className={`HomeNews__inputWrap HomeNews__inputWrap--area ${
                errors.message ? "is-invalid" : ""
              }`}
            >
              <ChatIcon />

              <textarea
                id="hn-message"
                name="message"
                placeholder="Write your experience here..."
                value={form.message}
                onChange={handleChange}
                maxLength={MAX_REVIEW}
                rows={3}
              />

              <span className="HomeNews__count">
                {form.message.length}/{MAX_REVIEW}
              </span>
            </div>

            {errors.message && (
              <p className="HomeNews__err">
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit button */}

          <div className="HomeNews__footer">
            <p className="HomeNews__note">
              Your review will appear on our website after our team approves it.
            </p>

            <button
              type="submit"
              className="HomeNews__submit"
              disabled={isSubmitting}
            >
              <SendIcon />

              {isSubmitting
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>

          {/* API success/error message */}

          {successMsg && (
            <p
              className={`HomeNews__banner ${
                messageType === "error"
                  ? "HomeNews__banner--error"
                  : "HomeNews__banner--ok"
              }`}
              role="status"
            >
              {messageType === "error" ? "!" : "✓"}{" "}
              {successMsg}
            </p>
          )}

        </form>
      </div>

      {/* ================= REVIEWS SLIDER ================= */}

      <div
        className="HomeNews__listAnchor"
        ref={listRef}
      />

      {/* Loading state */}

      {reviewsLoading && (
        <p className="HomeNews__status">
          Loading client reviews...
        </p>
      )}

      {/* Empty state */}

      {!reviewsLoading && total === 0 && (
        <p className="HomeNews__status">
          No published reviews yet. Be the first to share your experience!
        </p>
      )}

      {/* Published reviews */}

      {!reviewsLoading && total > 0 && (
        <div
          className="HomeNews__slider"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client reviews"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >

          <div className="HomeNews__viewport">
            <div
              className={`HomeNews__track ${
                animate ? "is-animating" : ""
              } ${canSlide ? "" : "is-static"}`}
              style={{
                "--index": canSlide ? index : 0,
                "--pv": perView,
              }}
            >

              {slides.map((item, slideIndex) => {
                const isClone = slideIndex >= total;

                const rating = Math.min(
                  5,
                  Math.max(1, Number(item.rating) || 5)
                );

                return (
                  <article
                    className="HomeNews__card"
                    key={
                      isClone
                        ? `${item._id}-clone`
                        : item._id
                    }
                    aria-hidden={isClone ? "true" : undefined}
                  >

                    <img
                      src={cardFlower}
                      className="HomeNews__cardFlower"
                      alt=""
                    />

                    <span
                      className="HomeNews__quoteMark"
                      aria-hidden="true"
                    >
                      <QuoteIcon />
                    </span>

                    {/* Rating stars */}

                    <div
                      className="HomeNews__stars"
                      role="img"
                      aria-label={`${rating} out of 5 stars`}
                    >
                      {"★".repeat(rating)}

                      <span>
                        {"★".repeat(5 - rating)}
                      </span>
                    </div>

                    {/* Review message */}

                    <p className="HomeNews__desc">
                      “{item.message}”
                    </p>

                    {/* Author information */}

                    <div className="HomeNews__author">
                      <span
                        className="HomeNews__avatar"
                        aria-hidden="true"
                      >
                        {getInitials(item.name)}
                      </span>

                      <div className="HomeNews__authorInfo">
                        <h4
                          className="HomeNews__cardTitle"
                          title={item.name}
                        >
                          {item.name}
                        </h4>

                        <span
                          className="HomeNews__role"
                          title={item.location}
                        >
                          <PinIcon size={13} />
                          {item.location}
                        </span>
                      </div>
                    </div>

                  </article>
                );
              })}

            </div>
          </div>

          {/* Slider controls */}

          {canSlide && (
            <div className="HomeNews__controls">

              <button
                type="button"
                className="HomeNews__navBtn"
                onClick={goPrev}
                aria-label="Previous review"
              >
                ‹
              </button>

              <span className="HomeNews__counter">
                <b>{pad(currentNumber)}</b> / {pad(total)}
              </span>

              <button
                type="button"
                className="HomeNews__navBtn"
                onClick={goNext}
                aria-label="Next review"
              >
                ›
              </button>

            </div>
          )}

        </div>
      )}

    </section>
  );
};

export default HomeNews;