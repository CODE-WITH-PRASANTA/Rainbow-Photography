import React, { useEffect, useState } from "react";
import "./BirthdaySpecialMain.css";

import birthday1 from "../../assets/maternity-1.webp";
import birthday2 from "../../assets/maternity-2.webp";
import birthday3 from "../../assets/maternity-3.webp";
import birthday4 from "../../assets/maternity-4.webp";
import birthday5 from "../../assets/maternity-5.webp";

const SLIDE_INTERVAL = 4000;
const SUCCESS_DURATION = 7000;
const COMPANY = "Rainbow Photography";
const GALLERY_LINK = "#gallery";
const PACKAGES_LINK = "#pricing";

const slides = [birthday1, birthday2, birthday3, birthday4, birthday5];

const highlights = [
  "Theme & cake-smash setups",
  "Custom party props & backdrops",
  "Candid moments & edited portraits",
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

const BirthdaySpecialMain = ({ onSubmit }) => {
  const [isReady, setIsReady] = useState(false);
  const [active, setActive] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    slides.forEach((src) => {
      const image = new Image();
      image.src = src;
    });

    const frame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (tabHidden) return undefined;

    const timer = setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [active, tabHidden]);

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
        source: "Birthday hero enquiry form",
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
      className={`birthday-special-main ${isReady ? "birthday-special-main--ready" : ""}`}
      id="birthday"
      aria-labelledby="birthday-special-main-title"
    >
      {/* Background slideshow */}
      <div className="birthday-special-main__slides" aria-hidden="true">
        {slides.map((src, index) => (
          <div
            key={src}
            className={`birthday-special-main__slide ${
              index === active ? "birthday-special-main__slide--active" : ""
            }`}
          >
            <img
              src={src}
              alt=""
              className="birthday-special-main__image"
              decoding="async"
              loading={index < 2 ? "eager" : "lazy"}
              draggable="false"
            />
          </div>
        ))}

        <span className="birthday-special-main__overlay"></span>
        <span className="birthday-special-main__vignette"></span>
      </div>

      <div className="birthday-special-main__container">
        {/* Left: content */}
        <div className="birthday-special-main__content">
          <span className="birthday-special-main__eyebrow">
            <span className="birthday-special-main__eyebrow-line"></span>
            {COMPANY.toUpperCase()}
          </span>

          <h1 className="birthday-special-main__title" id="birthday-special-main-title">
            Birthday &amp; Milestone <span>Celebrations</span>
          </h1>

          <p className="birthday-special-main__tagline">
            Freezing Every Smile, Laugh, and Candle in Timeless Frames.
          </p>

          <svg
            className="birthday-special-main__squiggle"
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

          <p className="birthday-special-main__description">
            From first-year cake smashes and magical themed parties to grand milestone birthdays,
            {COMPANY} captures the authentic joy, candid laughter, and vibrant energy with
            personalized styling and cinematic warmth.
          </p>

          <ul className="birthday-special-main__highlights">
            {highlights.map((item) => (
              <li className="birthday-special-main__highlight" key={item}>
                <span className="birthday-special-main__highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5L10 17.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="birthday-special-main__actions">
            <a className="birthday-special-main__button birthday-special-main__button--primary" href={GALLERY_LINK}>
              <span>View Gallery</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a className="birthday-special-main__button birthday-special-main__button--ghost" href={PACKAGES_LINK}>
              Packages
            </a>
          </div>
        </div>

        {/* Right: glass enquiry card */}
        <div className="birthday-special-main__form-wrap">
          <div
            className={`birthday-special-main__form-card ${
              isSubmitted ? "birthday-special-main__form-card--success" : ""
            }`}
          >
            {isSubmitted ? (
              <div className="birthday-special-main__success" role="status" aria-live="polite">
                <span className="birthday-special-main__success-icon" aria-hidden="true">
                  <svg viewBox="0 0 52 52" fill="none">
                    <circle className="birthday-special-main__success-ring" cx="26" cy="26" r="23" stroke="currentColor" strokeWidth="2.5" />
                    <path className="birthday-special-main__success-tick" d="M15 27L23 35L37 19" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>

                <h2 className="birthday-special-main__success-title">
                  Thank you{submittedName ? `, ${submittedName}` : ""}!
                </h2>

                <p className="birthday-special-main__success-text">
                  Your birthday shoot enquiry has been received. Our team will get in touch shortly to help design your special celebration.
                </p>

                <button
                  type="button"
                  className="birthday-special-main__success-button"
                  onClick={handleNewEnquiry}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <>
                <div className="birthday-special-main__form-heading">
                  <span className="birthday-special-main__form-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.4l1-1.5h6.2l1 1.5h1.4A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <h2 className="birthday-special-main__form-title">Enquiry Form</h2>
                  <span className="birthday-special-main__form-rule" aria-hidden="true"></span>
                  <p className="birthday-special-main__form-subtitle">
                    Tell us about your celebration and we will get back to you.
                  </p>
                </div>

                <form className="birthday-special-main__form" onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="birthday-special-main__field">
                    <label className="birthday-special-main__sr-only" htmlFor="birthday-form-name">
                      Your name
                    </label>
                    <input
                      className={`birthday-special-main__input ${errors.name ? "birthday-special-main__input--error" : ""}`}
                      id="birthday-form-name"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      maxLength={100}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "birthday-form-name-error" : undefined}
                    />
                    {errors.name && (
                      <span className="birthday-special-main__error" id="birthday-form-name-error">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="birthday-special-main__field">
                    <label className="birthday-special-main__sr-only" htmlFor="birthday-form-phone">
                      Mobile number
                    </label>
                    <div className={`birthday-special-main__phone ${errors.phone ? "birthday-special-main__phone--error" : ""}`}>
                      <span className="birthday-special-main__phone-code">
                        <span className="birthday-special-main__flag" aria-hidden="true"></span>
                        +91
                      </span>
                      <input
                        className="birthday-special-main__phone-input"
                        id="birthday-form-phone"
                        type="tel"
                        inputMode="numeric"
                        name="phone"
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel-national"
                        maxLength={10}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "birthday-form-phone-error" : undefined}
                      />
                    </div>
                    {errors.phone && (
                      <span className="birthday-special-main__error" id="birthday-form-phone-error">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="birthday-special-main__field">
                    <label className="birthday-special-main__sr-only" htmlFor="birthday-form-email">
                      Email address
                    </label>
                    <input
                      className={`birthday-special-main__input ${errors.email ? "birthday-special-main__input--error" : ""}`}
                      id="birthday-form-email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      maxLength={254}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "birthday-form-email-error" : undefined}
                    />
                    {errors.email && (
                      <span className="birthday-special-main__error" id="birthday-form-email-error">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="birthday-special-main__field">
                    <label className="birthday-special-main__sr-only" htmlFor="birthday-form-requirements">
                      Your requirements
                    </label>
                    <textarea
                      className="birthday-special-main__textarea"
                      id="birthday-form-requirements"
                      name="requirements"
                      placeholder="Requirements (celebrant's age/milestone, date, theme, location...)"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={3}
                      maxLength={1500}
                    />
                  </div>

                  {formError && (
                    <div className="birthday-special-main__status" role="alert">
                      {formError}
                    </div>
                  )}

                  <button
                    className="birthday-special-main__submit"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? "Sending..." : "Request Quote"}</span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <p className="birthday-special-main__note">
                    Share your celebration ideas above, and our photography planner will reach out soon.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Slideshow controls */}
      <div className="birthday-special-main__controls">
        <div className="birthday-special-main__controls-inner">
          <div className="birthday-special-main__arrows">
            <button
              type="button"
              className="birthday-special-main__arrow"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              className="birthday-special-main__arrow"
              onClick={goNext}
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <span className="birthday-special-main__counter" aria-live="off">
            <strong>{current}</strong> / {total}
          </span>

          <div className="birthday-special-main__progress" role="tablist" aria-label="Choose photo">
            {slides.map((src, index) => (
              <button
                type="button"
                key={src}
                role="tab"
                aria-selected={index === active}
                aria-label={`Show photo ${index + 1}`}
                className={`birthday-special-main__bar ${
                  index === active ? "birthday-special-main__bar--active" : ""
                } ${index < active ? "birthday-special-main__bar--done" : ""}`}
                onClick={() => setActive(index)}
              >
                {index === active && (
                  <span
                    key={`${active}-${tabHidden}`}
                    className="birthday-special-main__bar-fill"
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

export default BirthdaySpecialMain;