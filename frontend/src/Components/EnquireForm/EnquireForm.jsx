import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Camera,
  X,
  User,
  Mail,
  Phone,
  ChevronDown,
  RefreshCw,
  Lock,
  Sparkles,
  Video,
  Award,
  Heart,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import "./EnquireForm.css";

// Replace with your photography hero image or banner from assets
import enquireImage from "../../assets/images.webp";

// ============================================
// BUSINESS DETAILS
// ============================================
const BRAND_NAME = "Rainbow Photography";
const CALL_NUMBER = "+917375971966";
const PHONE_DISPLAY = "+91 73759 71966";
const EMAIL_DISPLAY = "Rrainbowphotography@gmail.com";

const SERVICES = [
  "Wedding Photography & Cinematography",
  "Pre-Wedding & Post-Wedding Shoots",
  "Candid Photography & Drone Coverage",
  "Engagement & Ring Ceremony",
  "Reception & Sangeet Nights",
  "Maternity & Baby Portfolio",
  "Birthday & Private Event Coverage",
];

const FEATURES = [
  { icon: <Camera size={15} />, title: "Cinematic 4K", text: "Ultra HD gear & drones" },
  { icon: <Heart size={15} />, title: "Candid Storytelling", text: "Capturing real emotions" },
  { icon: <Award size={15} />, title: "Expert Crew", text: "Seasoned wedding artists" },
  { icon: <Sparkles size={15} />, title: "Handcrafted Edits", text: "Fast album & video delivery" },
];

const INITIAL_FORM = {
  fullName: "",
  email: "",
  mobile: "",
  service: "",
  captchaInput: "",
  agreeTerms: false,
};

const FIELD_IDS = {
  fullName: "enquireFormFullName",
  email: "enquireFormEmail",
  mobile: "enquireFormMobile",
  service: "enquireFormService",
  captchaInput: "enquireFormCaptcha",
  agreeTerms: "enquireFormTerms",
};

const EnquireForm = ({
  triggerOnLoad = false,
  loadDelay = 3000,
  onFormSubmitSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [captchaRaw, setCaptchaRaw] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM);

  const firstInputRef = useRef(null);
  const paneRef = useRef(null);

  // ==========================================
  // CAPTCHA
  // ==========================================
  const generateCaptcha = useCallback(() => {
    const randomNum = Math.floor(100 + Math.random() * 900).toString();
    setCaptchaRaw(randomNum);
    setFormData((prev) => ({ ...prev, captchaInput: "" }));
  }, []);

  // ==========================================
  // OPEN / CLOSE / RESET
  // ==========================================
  const handleOpen = useCallback(() => {
    setErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
    generateCaptcha();
    setIsOpen(true);
  }, [generateCaptcha]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    setFormData(INITIAL_FORM);
    setErrors({});
    generateCaptcha();
  };

  // Automatic popup trigger
  useEffect(() => {
    if (!triggerOnLoad) return undefined;
    const timer = setTimeout(handleOpen, loadDelay);
    return () => clearTimeout(timer);
  }, [triggerOnLoad, loadDelay, handleOpen]);

  // Auto focus first input on open
  useEffect(() => {
    if (!isOpen || isSubmitted) return undefined;
    const timer = setTimeout(() => firstInputRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, [isOpen, isSubmitted]);

  // Scroll to top of pane when submitted
  useEffect(() => {
    if (isSubmitted) paneRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [isSubmitted]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // ==========================================
  // INPUT HANDLING
  // ==========================================
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let nextValue = type === "checkbox" ? checked : value;

    if (name === "mobile") nextValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "captchaInput") nextValue = value.replace(/\D/g, "").slice(0, 3);

    setFormData((prev) => ({ ...prev, [name]: nextValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==========================================
  // VALIDATION
  // ==========================================
  const validateForm = () => {
    const next = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const mobile = formData.mobile.trim();

    if (fullName.length < 3) {
      next.fullName = "Please enter your name (at least 3 characters).";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address.";
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      next.mobile = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.service) {
      next.service = "Please select a photography service.";
    }

    if (formData.captchaInput.trim() !== captchaRaw) {
      next.captchaInput = "Code does not match. Please try again.";
    }

    if (!formData.agreeTerms) {
      next.agreeTerms = "Please agree to the Terms & Conditions to continue.";
    }

    setErrors(next);

    const firstKey = Object.keys(FIELD_IDS).find((key) => next[key]);
    if (firstKey) {
      if (firstKey === "captchaInput") generateCaptcha();
      setTimeout(() => document.getElementById(FIELD_IDS[firstKey])?.focus(), 0);
      return false;
    }
    return true;
  };

  // ==========================================
  // SUBMISSION (No WhatsApp redirect, shows clean confirmation screen)
  // ==========================================
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      service: formData.service,
      submittedAt: new Date().toISOString(),
    };

    setSubmittedData(payload);
    setIsSubmitted(true);
    setFormData(INITIAL_FORM);
    setErrors({});

    if (onFormSubmitSuccess) {
      onFormSubmitSuccess(payload);
    }
  };

  const renderError = (key) =>
    errors[key] ? (
      <p id={`${FIELD_IDS[key]}Error`} className="enquire-form-error" role="alert">
        {errors[key]}
      </p>
    ) : null;

  const captchaSpaced = captchaRaw ? captchaRaw.split("").join(" ") : "...";

  return (
    <>
      {/* ==========================================
          SIDE TRIGGER BUTTON
      ========================================== */}
      {!isOpen && (
        <button
          type="button"
          className="enquire-form-trigger"
          onClick={handleOpen}
          aria-label="Open enquiry form"
        >
          <span className="enquire-form-trigger-dot" aria-hidden="true" />
          <span className="enquire-form-trigger-icon" aria-hidden="true">
            <Camera size={17} strokeWidth={2} />
          </span>
          <span className="enquire-form-trigger-text">ENQUIRE NOW</span>
        </button>
      )}

      {/* ==========================================
          MODAL BACKDROP
      ========================================== */}
      {isOpen && (
        <div
          className="enquire-form-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquireFormTitle"
        >
          <div className="enquire-form-card">
            <button
              type="button"
              className="enquire-form-close"
              onClick={handleClose}
              aria-label="Close enquiry form"
            >
              <X size={18} strokeWidth={2.2} />
            </button>

            {/* ---------- LEFT: PROMO PANEL ---------- */}
            <div
              className="enquire-form-promo"
              style={{ backgroundImage: `url(${enquireImage})` }}
            >
              <div className="enquire-form-promo-overlay" />

              <div className="enquire-form-promo-content">
                <div className="enquire-form-promo-top">
                  <div className="enquire-form-badge">
                    <span className="enquire-form-badge-dot" />
                    Wedding &amp; Event Planners
                  </div>

                  <h2 className="enquire-form-promo-title">
                    Capturing love &amp; vibrant moments with <span>{BRAND_NAME}</span>
                  </h2>

                  <p className="enquire-form-promo-desc">
                    Cinematic wedding films, candid emotions, and timeless portraiture.
                    Tell us about your special day and let us preserve your unforgettable memories.
                  </p>
                </div>

                <div className="enquire-form-feature-grid">
                  {FEATURES.map((item) => (
                    <div className="enquire-form-feature" key={item.title}>
                      <span className="enquire-form-feature-icon">{item.icon}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <a href={`tel:${CALL_NUMBER}`} className="enquire-form-call-btn">
                  <span className="enquire-form-call-icon">
                    <PhoneCall size={16} />
                  </span>
                  <span className="enquire-form-call-text">
                    <small>Direct Studio Line</small>
                    <strong>{PHONE_DISPLAY}</strong>
                  </span>
                </a>
              </div>
            </div>

            {/* ---------- RIGHT: FORM & SUBMITTED STATE ---------- */}
            <div className="enquire-form-pane" ref={paneRef}>
              {isSubmitted ? (
                <div className="enquire-form-success" role="status">
                  <span className="enquire-form-success-icon">
                    <CheckCircle2 size={38} strokeWidth={2} />
                  </span>
                  <h3 className="enquire-form-success-title" id="enquireFormTitle">
                    Enquiry Submitted!
                  </h3>
                  <p className="enquire-form-success-text">
                    Thank you, <strong>{submittedData?.fullName}</strong>! We have successfully received your enquiry for <strong>{submittedData?.service}</strong>.
                  </p>

                  <div className="enquire-form-success-box">
                    <div className="enquire-form-success-row">
                      <span>Contact No:</span>
                      <strong>+91 {submittedData?.mobile}</strong>
                    </div>
                    {submittedData?.email && (
                      <div className="enquire-form-success-row">
                        <span>Email:</span>
                        <strong>{submittedData?.email}</strong>
                      </div>
                    )}
                    <div className="enquire-form-success-row">
                      <span>Status:</span>
                      <strong className="enquire-form-status-badge">Received &bull; Priority Queue</strong>
                    </div>
                  </div>

                  <p className="enquire-form-success-subtext">
                    Our photography team will review date availability and call you shortly at <strong>+91 {submittedData?.mobile}</strong> with customized packages and quotes.
                  </p>

                  <div className="enquire-form-success-actions">
                    <a href={`tel:${CALL_NUMBER}`} className="enquire-form-primary-btn">
                      <PhoneCall size={16} /> Call Us Directly: {PHONE_DISPLAY}
                    </a>
                    <button
                      type="button"
                      className="enquire-form-ghost-btn"
                      onClick={handleResetForm}
                    >
                      <RotateCcw size={15} /> Send Another Enquiry
                    </button>
                    <button
                      type="button"
                      className="enquire-form-close-sheet-btn"
                      onClick={handleClose}
                    >
                      Done &amp; Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="enquire-form-header">
                    <span className="enquire-form-form-badge">Quick Booking &amp; Quote</span>
                    <h3 id="enquireFormTitle" className="enquire-form-title">
                      Plan Your Shoot
                    </h3>
                    <p className="enquire-form-subtitle">
                      Share your details and desired shoot. Our team will contact you promptly with portfolio catalogs and pricing.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="enquire-form-form"
                    noValidate
                  >
                    {/* FULL NAME */}
                    <div className="enquire-form-field">
                      <label htmlFor={FIELD_IDS.fullName} className="enquire-form-label">
                        Full Name
                      </label>
                      <div className="enquire-form-input-wrap">
                        <User className="enquire-form-input-icon" size={17} aria-hidden="true" />
                        <input
                          ref={firstInputRef}
                          id={FIELD_IDS.fullName}
                          type="text"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          maxLength={80}
                          autoComplete="name"
                          aria-invalid={!!errors.fullName}
                          aria-describedby={errors.fullName ? `${FIELD_IDS.fullName}Error` : undefined}
                        />
                      </div>
                      {renderError("fullName")}
                    </div>

                    {/* EMAIL */}
                    <div className="enquire-form-field">
                      <label htmlFor={FIELD_IDS.email} className="enquire-form-label">
                        Email Address <em>Optional</em>
                      </label>
                      <div className="enquire-form-input-wrap">
                        <Mail className="enquire-form-input-icon" size={17} aria-hidden="true" />
                        <input
                          id={FIELD_IDS.email}
                          type="email"
                          name="email"
                          placeholder="e.g. name@domain.com"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? `${FIELD_IDS.email}Error` : undefined}
                        />
                      </div>
                      {renderError("email")}
                    </div>

                    {/* MOBILE */}
                    <div className="enquire-form-field">
                      <label htmlFor={FIELD_IDS.mobile} className="enquire-form-label">
                        Phone Number
                      </label>
                      <div className="enquire-form-input-wrap">
                        <Phone className="enquire-form-input-icon" size={17} aria-hidden="true" />
                        <span className="enquire-form-prefix">+91</span>
                        <input
                          id={FIELD_IDS.mobile}
                          className="enquire-form-input-prefixed"
                          type="tel"
                          name="mobile"
                          placeholder="10 digit mobile number"
                          maxLength={10}
                          value={formData.mobile}
                          onChange={handleChange}
                          autoComplete="tel-national"
                          inputMode="numeric"
                          aria-invalid={!!errors.mobile}
                          aria-describedby={errors.mobile ? `${FIELD_IDS.mobile}Error` : undefined}
                        />
                      </div>
                      {renderError("mobile")}
                    </div>

                    {/* SERVICE */}
                    <div className="enquire-form-field">
                      <label htmlFor={FIELD_IDS.service} className="enquire-form-label">
                        Photography Service
                      </label>
                      <div className="enquire-form-input-wrap">
                        <select
                          id={FIELD_IDS.service}
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          required
                          aria-invalid={!!errors.service}
                          aria-describedby={errors.service ? `${FIELD_IDS.service}Error` : undefined}
                        >
                          <option value="" disabled>
                            Select a shoot / service
                          </option>
                          {SERVICES.map((srv) => (
                            <option key={srv} value={srv}>
                              {srv}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="enquire-form-chevron" size={17} aria-hidden="true" />
                      </div>
                      {renderError("service")}
                    </div>

                    {/* CAPTCHA */}
                    <div className="enquire-form-field">
                      <label htmlFor={FIELD_IDS.captchaInput} className="enquire-form-label">
                        Security Check
                      </label>
                      <div className="enquire-form-captcha-row">
                        <div
                          className="enquire-form-captcha-box"
                          aria-label={`Security code ${captchaSpaced}`}
                        >
                          {captchaSpaced}
                        </div>
                        <input
                          id={FIELD_IDS.captchaInput}
                          type="text"
                          name="captchaInput"
                          placeholder="Enter code"
                          className="enquire-form-captcha-input"
                          value={formData.captchaInput}
                          onChange={handleChange}
                          maxLength={3}
                          autoComplete="off"
                          inputMode="numeric"
                          aria-invalid={!!errors.captchaInput}
                          aria-describedby={errors.captchaInput ? `${FIELD_IDS.captchaInput}Error` : undefined}
                        />
                        <button
                          type="button"
                          className="enquire-form-captcha-refresh"
                          onClick={generateCaptcha}
                          aria-label="Generate a new code"
                        >
                          <RefreshCw size={17} />
                        </button>
                      </div>
                      {renderError("captchaInput")}
                    </div>

                    {/* TERMS */}
                    <div className="enquire-form-terms-wrap">
                      <div className="enquire-form-terms">
                        <input
                          type="checkbox"
                          id={FIELD_IDS.agreeTerms}
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          aria-invalid={!!errors.agreeTerms}
                        />
                        <label htmlFor={FIELD_IDS.agreeTerms}>
                          I agree to the{" "}
                          <a href="/terms" target="_blank" rel="noreferrer">
                            Terms &amp; Conditions
                          </a>{" "}
                          and booking privacy policy of {BRAND_NAME}.
                        </label>
                      </div>
                      {renderError("agreeTerms")}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button type="submit" className="enquire-form-submit">
                      Submit Enquiry <ArrowRight size={17} />
                    </button>

                    <p className="enquire-form-secure-text">
                      <Lock size={12} /> We respect your privacy. No spam guaranteed.
                    </p>

                    {/* Mobile Quick Call Button */}
                    <a href={`tel:${CALL_NUMBER}`} className="enquire-form-mobile-call">
                      <PhoneCall size={16} />
                      Prefer to talk? Call {PHONE_DISPLAY}
                    </a>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnquireForm;