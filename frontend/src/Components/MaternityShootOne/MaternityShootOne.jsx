import React, { useEffect, useState } from "react";
import "./MaternityShootOne.css";

import maternity1 from "../../assets/maternity-1.webp";
import maternity2 from "../../assets/maternity-2.webp";
import maternity3 from "../../assets/maternity-3.webp";
import maternity4 from "../../assets/maternity-4.webp";
import maternity5 from "../../assets/maternity-5.webp";

const SLIDE_INTERVAL = 4000; // background image changes every 4 seconds
const SUCCESS_DURATION = 7000; // thank-you panel stays 7 seconds, then the form returns
const COMPANY = "Rainbow Photography";
const GALLERY_LINK = "#gallery"; // change to your gallery page or section
const PACKAGES_LINK = "#pricing"; // change to your pricing / packages section

const slides = [maternity1, maternity2, maternity3, maternity4, maternity5];

const highlights = ["Studio & outdoor shoots", "Styled outfits & props", "Beautifully edited photos"];

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

/*
 * Optional prop: onSubmit(payload) -> Promise
 * Pass a function that sends the enquiry to your API / email service.
 * Without it, the form shows the success panel but does not store anything.
 */
const MaternityShootOne = ({ onSubmit }) => {
  const [isReady, setIsReady] = useState(false);
  const [active, setActive] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [formError, setFormError] = useState("");

  /* Start the entrance animation and preload every slide */
  useEffect(() => {
    slides.forEach((src) => {
      const image = new Image();
      image.src = src;
    });

    const frame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Pause the slideshow while the browser tab is hidden */
  useEffect(() => {
    const handleVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  /* Automatic slideshow: next image every 4 seconds */
  useEffect(() => {
    if (tabHidden) return undefined;

    const timer = setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [active, tabHidden]);

  /* After a successful submit, show the thank-you for a few seconds, then bring back a fresh form */
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

  /* Form */
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
        source: "Maternity hero enquiry form",
      };

      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        // TODO: connect your API / email service here
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      // Success: remove the form and show the thank-you panel
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
      className={`maternity-shoot-one ${isReady ? "maternity-shoot-one--ready" : ""}`}
      id="maternity"
      aria-labelledby="maternity-shoot-one-title"
    >
      {/* Background slideshow */}
      <div className="maternity-shoot-one__slides" aria-hidden="true">
        {slides.map((src, index) => (
          <div
            key={src}
            className={`maternity-shoot-one__slide ${
              index === active ? "maternity-shoot-one__slide--active" : ""
            }`}
          >
            <img
              src={src}
              alt=""
              className="maternity-shoot-one__image"
              decoding="async"
              loading={index < 2 ? "eager" : "lazy"}
              draggable="false"
            />
          </div>
        ))}

        <span className="maternity-shoot-one__overlay"></span>
        <span className="maternity-shoot-one__vignette"></span>
      </div>

      <div className="maternity-shoot-one__container">
        {/* Left: content */}
        <div className="maternity-shoot-one__content">
          <span className="maternity-shoot-one__eyebrow">
            <span className="maternity-shoot-one__eyebrow-line"></span>
            {COMPANY.toUpperCase()}
          </span>

          <h1 className="maternity-shoot-one__title" id="maternity-shoot-one-title">
            Maternity &amp; Pregnancy <span>Photography</span>
          </h1>

          <p className="maternity-shoot-one__tagline">
            Capturing the Glow of Motherhood in Every Click.
          </p>

          <svg
            className="maternity-shoot-one__squiggle"
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

          <p className="maternity-shoot-one__description">
            At {COMPANY}, we turn the quiet, glowing weeks of pregnancy into
            portraits you will treasure for life, with gentle direction, soft
            light and styling that feels completely like you.
          </p>

          <ul className="maternity-shoot-one__highlights">
            {highlights.map((item) => (
              <li className="maternity-shoot-one__highlight" key={item}>
                <span className="maternity-shoot-one__highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5L10 17.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="maternity-shoot-one__actions">
            <a className="maternity-shoot-one__button maternity-shoot-one__button--primary" href={GALLERY_LINK}>
              <span>View Gallery</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a className="maternity-shoot-one__button maternity-shoot-one__button--ghost" href={PACKAGES_LINK}>
              Packages
            </a>
          </div>
        </div>

        {/* Right: premium glass enquiry card (form or success) */}
        <div className="maternity-shoot-one__form-wrap">
          <div
            className={`maternity-shoot-one__form-card ${
              isSubmitted ? "maternity-shoot-one__form-card--success" : ""
            }`}
          >
            {isSubmitted ? (
              <div className="maternity-shoot-one__success" role="status" aria-live="polite">
                <span className="maternity-shoot-one__success-icon" aria-hidden="true">
                  <svg viewBox="0 0 52 52" fill="none">
                    <circle className="maternity-shoot-one__success-ring" cx="26" cy="26" r="23" stroke="currentColor" strokeWidth="2.5" />
                    <path className="maternity-shoot-one__success-tick" d="M15 27L23 35L37 19" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>

                <h2 className="maternity-shoot-one__success-title">
                  Thank you{submittedName ? `, ${submittedName}` : ""}!
                </h2>

                <p className="maternity-shoot-one__success-text">
                  Your enquiry has been received. Our team will call you shortly to
                  plan your maternity shoot.
                </p>

                <button
                  type="button"
                  className="maternity-shoot-one__success-button"
                  onClick={handleNewEnquiry}
                >
                  Send another enquiry
                </button>

              </div>
            ) : (
              <>
                <div className="maternity-shoot-one__form-heading">
                  <span className="maternity-shoot-one__form-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.4l1-1.5h6.2l1 1.5h1.4A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <h2 className="maternity-shoot-one__form-title">Enquiry Form</h2>
                  <span className="maternity-shoot-one__form-rule" aria-hidden="true"></span>
                  <p className="maternity-shoot-one__form-subtitle">
                    Tell us about your shoot and we will get back to you.
                  </p>
                </div>

                <form className="maternity-shoot-one__form" onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="maternity-shoot-one__field">
                    <label className="maternity-shoot-one__sr-only" htmlFor="maternity-shoot-one-name">
                      Your name
                    </label>
                    <input
                      className={`maternity-shoot-one__input ${errors.name ? "maternity-shoot-one__input--error" : ""}`}
                      id="maternity-shoot-one-name"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      maxLength={100}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "maternity-shoot-one-name-error" : undefined}
                    />
                    {errors.name && (
                      <span className="maternity-shoot-one__error" id="maternity-shoot-one-name-error">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="maternity-shoot-one__field">
                    <label className="maternity-shoot-one__sr-only" htmlFor="maternity-shoot-one-phone">
                      Mobile number
                    </label>
                    <div className={`maternity-shoot-one__phone ${errors.phone ? "maternity-shoot-one__phone--error" : ""}`}>
                      <span className="maternity-shoot-one__phone-code">
                        <span className="maternity-shoot-one__flag" aria-hidden="true"></span>
                        +91
                      </span>
                      <input
                        className="maternity-shoot-one__phone-input"
                        id="maternity-shoot-one-phone"
                        type="tel"
                        inputMode="numeric"
                        name="phone"
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel-national"
                        maxLength={10}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "maternity-shoot-one-phone-error" : undefined}
                      />
                    </div>
                    {errors.phone && (
                      <span className="maternity-shoot-one__error" id="maternity-shoot-one-phone-error">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="maternity-shoot-one__field">
                    <label className="maternity-shoot-one__sr-only" htmlFor="maternity-shoot-one-email">
                      Email address
                    </label>
                    <input
                      className={`maternity-shoot-one__input ${errors.email ? "maternity-shoot-one__input--error" : ""}`}
                      id="maternity-shoot-one-email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      maxLength={254}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "maternity-shoot-one-email-error" : undefined}
                    />
                    {errors.email && (
                      <span className="maternity-shoot-one__error" id="maternity-shoot-one-email-error">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="maternity-shoot-one__field">
                    <label className="maternity-shoot-one__sr-only" htmlFor="maternity-shoot-one-requirements">
                      Your requirements
                    </label>
                    <textarea
                      className="maternity-shoot-one__textarea"
                      id="maternity-shoot-one-requirements"
                      name="requirements"
                      placeholder="Requirements (shoot date, location, ideas...)"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={3}
                      maxLength={1500}
                    />
                  </div>

                  {formError && (
                    <div className="maternity-shoot-one__status" role="alert">
                      {formError}
                    </div>
                  )}

                  <button
                    className="maternity-shoot-one__submit"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? "Sending..." : "Request Quote"}</span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <p className="maternity-shoot-one__note">
                    Please provide the details in the form, and our expert will be
                    in touch with you shortly.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Slideshow controls */}
      <div className="maternity-shoot-one__controls">
        <div className="maternity-shoot-one__controls-inner">
          <div className="maternity-shoot-one__arrows">
            <button
              type="button"
              className="maternity-shoot-one__arrow"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              className="maternity-shoot-one__arrow"
              onClick={goNext}
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <span className="maternity-shoot-one__counter" aria-live="off">
            <strong>{current}</strong> / {total}
          </span>

          <div className="maternity-shoot-one__progress" role="tablist" aria-label="Choose photo">
            {slides.map((src, index) => (
              <button
                type="button"
                key={src}
                role="tab"
                aria-selected={index === active}
                aria-label={`Show photo ${index + 1}`}
                className={`maternity-shoot-one__bar ${
                  index === active ? "maternity-shoot-one__bar--active" : ""
                } ${index < active ? "maternity-shoot-one__bar--done" : ""}`}
                onClick={() => setActive(index)}
              >
                {index === active && (
                  <span
                    key={`${active}-${tabHidden}`}
                    className="maternity-shoot-one__bar-fill"
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

export default MaternityShootOne;