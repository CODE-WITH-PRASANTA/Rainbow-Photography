import React, { useEffect, useState } from "react";
import "./BabyShootMain.css";

import maternity1 from "../../assets/maternity-1.webp";
import maternity2 from "../../assets/maternity-2.webp";
import maternity3 from "../../assets/maternity-3.webp";
import maternity4 from "../../assets/maternity-4.webp";
import maternity5 from "../../assets/maternity-5.webp";

const SLIDE_INTERVAL = 4000;
const SUCCESS_DURATION = 7000;
const COMPANY = "Rainbow Photography";
const GALLERY_LINK = "#gallery";
const PACKAGES_LINK = "#pricing";

const slides = [maternity1, maternity2, maternity3, maternity4, maternity5];

const highlights = [
  "Newborn, sitter & toddler shoots",
  "Sanitized props & cozy wraps",
  "Gentle handling & safe studio setup",
];

const initialForm = { name: "", phone: "", email: "", requirements: "" };

const validate = (values) => {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }

  if (!/^[6-9]\d{9}$/.test(values.phone)) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
};

const BabyShootMain = ({ onSubmit }) => {
  const [isReady, setIsReady] = useState(false);
  const [active, setActive] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [formError, setFormError] = useState("");

  /* Start entrance animation and preload slide images */
  useEffect(() => {
    slides.forEach((src) => {
      const image = new Image();
      image.src = src;
    });

    const frame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Pause auto-play when tab is not visible */
  useEffect(() => {
    const handleVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  /* Slideshow interval timer */
  useEffect(() => {
    if (tabHidden) return undefined;

    const timer = setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [active, tabHidden]);

  /* Reset form after success message duration */
  useEffect(() => {
    if (!isSubmitted) return undefined;

    const timer = setTimeout(() => {
      setIsSubmitted(false);
      setSubmittedName("");
    }, SUCCESS_DURATION);

    return () => clearTimeout(timer);
  }, [isSubmitted]);

  const goNext = () => setActive((current) => (current + 1) % slides.length);
  const goPrev = () =>
    setActive((current) => (current - 1 + slides.length) % slides.length);

  /* Form handling */
  const handleChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;

    if (name === "phone") value = value.replace(/\D/g, "").slice(0, 10);

    setFormData((previous) => ({ ...previous, [name]: value }));

    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: "" }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const foundErrors = validate(formData);
    setErrors(foundErrors);

    if (Object.keys(foundErrors).length > 0) {
      setFormError("Please check the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const payload = {
        name: formData.name.trim(),
        phone: `+91${formData.phone}`,
        email: formData.email.trim(),
        requirements: formData.requirements.trim(),
        source: "Baby shoot hero enquiry form",
      };

      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      setSubmittedName(payload.name.split(" ")[0]);
      setFormData(initialForm);
      setErrors({});
      setIsSubmitted(true);
    } catch {
      setFormError("Something went wrong. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewEnquiry = () => {
    setIsSubmitted(false);
    setSubmittedName("");
    setFormError("");
  };

  const total = String(slides.length).padStart(2, "0");
  const current = String(active + 1).padStart(2, "0");

  return (
    <section
      className={`baby-shoot-main ${isReady ? "baby-shoot-main--ready" : ""}`}
      id="baby-shoot"
      aria-labelledby="baby-shoot-main-title"
    >
      {/* Background slideshow */}
      <div className="baby-shoot-main__slides" aria-hidden="true">
        {slides.map((src, index) => (
          <div
            key={src}
            className={`baby-shoot-main__slide ${
              index === active ? "baby-shoot-main__slide--active" : ""
            }`}
          >
            <img
              src={src}
              alt=""
              className="baby-shoot-main__image"
              decoding="async"
              loading={index < 2 ? "eager" : "lazy"}
              draggable="false"
            />
          </div>
        ))}

        <span className="baby-shoot-main__overlay"></span>
        <span className="baby-shoot-main__vignette"></span>
      </div>

      <div className="baby-shoot-main__container">
        {/* Left: Content */}
        <div className="baby-shoot-main__content">
          <span className="baby-shoot-main__eyebrow">
            <span className="baby-shoot-main__eyebrow-line"></span>
            {COMPANY.toUpperCase()}
          </span>

          <h1 className="baby-shoot-main__title" id="baby-shoot-main-title">
            Newborn &amp; Baby <span>Photography</span>
          </h1>

          <p className="baby-shoot-main__tagline">
            Tiny Fingers, Little Toes, and Precious Memories That Last Forever.
          </p>

          <svg
            className="baby-shoot-main__squiggle"
            viewBox="0 0 220 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 12C12 2 20 2 24 12C28 22 36 22 44 12C52 2 60 2 64 12C68 22 76 22 84 12C92 2 100 2 104 12C108 22 116 22 124 12C132 2 140 2 144 12C148 22 156 22 164 12C172 2 180 2 184 12C188 22 196 22 216 12"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>

          <p className="baby-shoot-main__description">
            At {COMPANY}, we specialize in capturing the innocence, gentle slumber,
            and sweet expressions of your little ones. With temperature-controlled studio environments,
            organic fabric wraps, and patient posing, your baby's comfort and safety always come first.
          </p>

          <ul className="baby-shoot-main__highlights">
            {highlights.map((item) => (
              <li className="baby-shoot-main__highlight" key={item}>
                <span className="baby-shoot-main__highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12.5L10 17.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="baby-shoot-main__actions">
            <a
              className="baby-shoot-main__button baby-shoot-main__button--primary"
              href={GALLERY_LINK}
            >
              <span>View Gallery</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12H19M12 5L19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              className="baby-shoot-main__button baby-shoot-main__button--ghost"
              href={PACKAGES_LINK}
            >
              Packages
            </a>
          </div>
        </div>

        {/* Right: Glass Enquiry Card */}
        <div className="baby-shoot-main__form-wrap">
          <div
            className={`baby-shoot-main__form-card ${
              isSubmitted ? "baby-shoot-main__form-card--success" : ""
            }`}
          >
            {isSubmitted ? (
              <div className="baby-shoot-main__success" role="status" aria-live="polite">
                <span className="baby-shoot-main__success-icon" aria-hidden="true">
                  <svg viewBox="0 0 52 52" fill="none">
                    <circle
                      className="baby-shoot-main__success-ring"
                      cx="26"
                      cy="26"
                      r="23"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <path
                      className="baby-shoot-main__success-tick"
                      d="M15 27L23 35L37 19"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <h2 className="baby-shoot-main__success-title">
                  Thank you{submittedName ? `, ${submittedName}` : ""}!
                </h2>

                <p className="baby-shoot-main__success-text">
                  Your enquiry has been received. Our baby photography specialist will call you shortly to plan a cozy and safe photoshoot.
                </p>

                <button
                  type="button"
                  className="baby-shoot-main__success-button"
                  onClick={handleNewEnquiry}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <>
                <div className="baby-shoot-main__form-heading">
                  <span className="baby-shoot-main__form-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.4l1-1.5h6.2l1 1.5h1.4A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <h2 className="baby-shoot-main__form-title">Enquiry Form</h2>
                  <span className="baby-shoot-main__form-rule" aria-hidden="true"></span>
                  <p className="baby-shoot-main__form-subtitle">
                    Tell us about your baby's age and preferred shoot date.
                  </p>
                </div>

                <form className="baby-shoot-main__form" onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="baby-shoot-main__field">
                    <label className="baby-shoot-main__sr-only" htmlFor="baby-form-name">
                      Your name
                    </label>
                    <input
                      className={`baby-shoot-main__input ${errors.name ? "baby-shoot-main__input--error" : ""}`}
                      id="baby-form-name"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      maxLength={100}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "baby-form-name-error" : undefined}
                    />
                    {errors.name && (
                      <span className="baby-shoot-main__error" id="baby-form-name-error">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="baby-shoot-main__field">
                    <label className="baby-shoot-main__sr-only" htmlFor="baby-form-phone">
                      Mobile number
                    </label>
                    <div
                      className={`baby-shoot-main__phone ${errors.phone ? "baby-shoot-main__phone--error" : ""}`}
                    >
                      <span className="baby-shoot-main__phone-code">
                        <span className="baby-shoot-main__flag" aria-hidden="true"></span>
                        +91
                      </span>
                      <input
                        className="baby-shoot-main__phone-input"
                        id="baby-form-phone"
                        type="tel"
                        inputMode="numeric"
                        name="phone"
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel-national"
                        maxLength={10}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "baby-form-phone-error" : undefined}
                      />
                    </div>
                    {errors.phone && (
                      <span className="baby-shoot-main__error" id="baby-form-phone-error">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="baby-shoot-main__field">
                    <label className="baby-shoot-main__sr-only" htmlFor="baby-form-email">
                      Email address
                    </label>
                    <input
                      className={`baby-shoot-main__input ${errors.email ? "baby-shoot-main__input--error" : ""}`}
                      id="baby-form-email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      maxLength={254}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "baby-form-email-error" : undefined}
                    />
                    {errors.email && (
                      <span className="baby-shoot-main__error" id="baby-form-email-error">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="baby-shoot-main__field">
                    <label className="baby-shoot-main__sr-only" htmlFor="baby-form-requirements">
                      Your requirements
                    </label>
                    <textarea
                      className="baby-shoot-main__textarea"
                      id="baby-form-requirements"
                      name="requirements"
                      placeholder="Requirements (baby age in days/months, newborn/sitter theme, shoot date...)"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={3}
                      maxLength={1500}
                    />
                  </div>

                  {formError && (
                    <div className="baby-shoot-main__status" role="alert">
                      {formError}
                    </div>
                  )}

                  <button
                    className="baby-shoot-main__submit"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? "Sending..." : "Request Quote"}</span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12H19M12 5L19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <p className="baby-shoot-main__note">
                    Share your requirements, and our team will get in touch with available dates and details.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Slideshow controls */}
      <div className="baby-shoot-main__controls">
        <div className="baby-shoot-main__controls-inner">
          <div className="baby-shoot-main__arrows">
            <button
              type="button"
              className="baby-shoot-main__arrow"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M19 12H5M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="baby-shoot-main__arrow"
              onClick={goNext}
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12H19M12 5L19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <span className="baby-shoot-main__counter" aria-live="off">
            <strong>{current}</strong> / {total}
          </span>

          <div className="baby-shoot-main__progress" role="tablist" aria-label="Choose photo">
            {slides.map((src, index) => (
              <button
                type="button"
                key={src}
                role="tab"
                aria-selected={index === active}
                aria-label={`Show photo ${index + 1}`}
                className={`baby-shoot-main__bar ${
                  index === active ? "baby-shoot-main__bar--active" : ""
                } ${index < active ? "baby-shoot-main__bar--done" : ""}`}
                onClick={() => setActive(index)}
              >
                {index === active && (
                  <span
                    key={`${active}-${tabHidden}`}
                    className="baby-shoot-main__bar-fill"
                    style={{
                      animationDuration: `${SLIDE_INTERVAL}ms`,
                      animationPlayState: tabHidden ? "paused" : "running",
                    }}
                  ></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BabyShootMain;