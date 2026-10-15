import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./FloatingForm.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "",
  date: "",
  message: "",
};

/* Motion tokens */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

const OPEN_DURATION = 950;
const OPEN_DELAY = 90;
const CLOSE_DURATION = 780;
const CLOSE_DELAY = 170;
const LEAVE_DURATION = 950;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
 * Works out how far (and how much smaller) the card must be so that
 * it appears to come out of / go into the camera lens.
 */
const getLensTransform = (card, lens) => {
  const cardRect = card.getBoundingClientRect();
  const lensRect = lens.getBoundingClientRect();

  const dx =
    lensRect.left + lensRect.width / 2 - (cardRect.left + cardRect.width / 2);
  const dy =
    lensRect.top + lensRect.height / 2 - (cardRect.top + cardRect.height / 2);

  const scale = Math.max(0.05, (lensRect.width / cardRect.width) * 0.85);

  return `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
};

export default function FloatingForm() {
  const [phase, setPhase] = useState("camera");
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const phaseRef = useRef("camera");
  const formRef = useRef(null);
  const lensRef = useRef(null);
  const timersRef = useRef([]);
  const animationsRef = useRef([]);

  const goTo = (next) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const schedule = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  };

  const track = (animation) => {
    animationsRef.current.push(animation);
    return animation;
  };

  /* Auto-start the introduction */
  useEffect(() => {
    schedule(() => {
      if (phaseRef.current === "camera") goTo("opening");
    }, 1500);

    return () => {
      timersRef.current.forEach(clearTimeout);
      animationsRef.current.forEach((animation) => animation.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Lock page scroll while the experience is visible */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (phase !== "done") {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  /* Block interaction with the card while it is closing */
  useLayoutEffect(() => {
    formRef.current?.toggleAttribute("inert", phase === "closing");
  }, [phase]);

  /* =========================================
     OPEN: card grows out of the lens
  ========================================= */
  useLayoutEffect(() => {
    if (phase !== "opening") return;

    const card = formRef.current;
    const lens = lensRef.current;

    if (!card || !lens || typeof card.animate !== "function") {
      goTo("form");
      return;
    }

    const reduced = prefersReducedMotion();
    const from = getLensTransform(card, lens);
    const rest = "translate3d(0, 0, 0) scale(1)";

    const cardAnimation = track(
      card.animate(
        [
          { transform: from, opacity: 0 },
          { transform: from, opacity: 1, offset: 0.08 },
          { transform: rest, opacity: 1 },
        ],
        {
          duration: reduced ? 1 : OPEN_DURATION,
          delay: reduced ? 0 : OPEN_DELAY,
          easing: EASE_OUT,
          fill: "both",
        }
      )
    );

    /* Content settles in one by one after the card has mostly grown */
    card.querySelectorAll("[data-reveal]").forEach((element, index) => {
      track(
        element.animate(
          [
            { opacity: 0, transform: "translate3d(0, 14px, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ],
          {
            duration: reduced ? 1 : 560,
            delay: reduced ? 0 : OPEN_DELAY + 380 + index * 60,
            easing: EASE_OUT,
            fill: "both",
          }
        )
      );
    });

    let cancelled = false;

    cardAnimation.finished
      .then(() => {
        if (!cancelled && phaseRef.current === "opening") goTo("form");
      })
      .catch(() => {});

    /* Safety net */
    const safety = schedule(() => {
      if (phaseRef.current === "opening") goTo("form");
    }, OPEN_DURATION + OPEN_DELAY + 700);

    return () => {
      cancelled = true;
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* =========================================
     CLOSE: content fades, card sinks into lens
  ========================================= */
  useLayoutEffect(() => {
    if (phase !== "closing") return;

    const card = formRef.current;
    const lens = lensRef.current;

    if (!card || !lens || typeof card.animate !== "function") {
      goTo("leaving");
      return;
    }

    const reduced = prefersReducedMotion();
    const to = getLensTransform(card, lens);
    const rest = "translate3d(0, 0, 0) scale(1)";

    const items = Array.from(card.querySelectorAll("[data-reveal]"));

    items.forEach((element, index) => {
      track(
        element.animate(
          [
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
            { opacity: 0, transform: "translate3d(0, -8px, 0)" },
          ],
          {
            duration: reduced ? 1 : 230,
            delay: reduced ? 0 : index * 18,
            easing: "ease-in",
            fill: "both",
          }
        )
      );
    });

    const cardAnimation = track(
      card.animate(
        [
          { transform: rest, opacity: 1 },
          { transform: rest, opacity: 1, offset: 0.04 },
          { opacity: 1, offset: 0.78 },
          { transform: to, opacity: 0 },
        ],
        {
          duration: reduced ? 1 : CLOSE_DURATION,
          delay: reduced ? 0 : CLOSE_DELAY,
          easing: EASE_IN_OUT,
          fill: "both",
        }
      )
    );

    let cancelled = false;

    cardAnimation.finished
      .then(() => {
        if (!cancelled && phaseRef.current === "closing") goTo("leaving");
      })
      .catch(() => {});

    const safety = schedule(() => {
      if (phaseRef.current === "closing") goTo("leaving");
    }, CLOSE_DURATION + CLOSE_DELAY + 700);

    return () => {
      cancelled = true;
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* Final fade of the whole overlay */
  useEffect(() => {
    if (phase !== "leaving") return;

    const timer = schedule(
      () => goTo("done"),
      prefersReducedMotion() ? 60 : LEAVE_DURATION
    );

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* Focus first field once the form is ready */
  useEffect(() => {
    if (phase !== "form") return;

    const timer = setTimeout(() => {
      formRef.current
        ?.querySelector("input")
        ?.focus({ preventScroll: true });
    }, 120);

    return () => clearTimeout(timer);
  }, [phase]);

  const openForm = () => {
    if (phaseRef.current !== "camera") return;
    goTo("opening");
  };

  const closeExperience = () => {
    const current = phaseRef.current;

    if (current === "closing" || current === "leaving" || current === "done") {
      return;
    }

    // No card yet (still on the camera screen) -> just leave.
    if (current === "camera") {
      goTo("leaving");
      return;
    }

    goTo("closing");
  };

  /* Escape key */
  useEffect(() => {
    if (phase === "done") return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeExperience();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || phaseRef.current !== "form") return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        date: form.date,
        message: form.message.trim(),
      };

      /*
       * DEMO MODE:
       * Replace this with your real backend API request.
       *
       * const response = await fetch(
       *   `${import.meta.env.VITE_BASE_URL}/api/enquiries`,
       *   {
       *     method: "POST",
       *     headers: { "Content-Type": "application/json" },
       *     body: JSON.stringify(payload),
       *   }
       * );
       *
       * if (!response.ok) throw new Error("Enquiry submission failed");
       *
       * Call closeExperience() only after a successful API response.
       */

      console.log("Photography enquiry (demo only):", payload);

      closeExperience();
    } catch {
      setError("Unable to send your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (phase === "done") return null;

  const copyVisible = phase === "camera";
  const showForm = ["opening", "form", "closing"].includes(phase);

  return (
    <div className={`photo-intro photo-phase-${phase}`}>
      <div className="photo-intro-bg" />
      <div className="photo-intro-pattern" />

      <header className="photo-intro-brand">
        <span className="photo-brand-mark">✦</span>
        <span className="photo-brand-name">MOMENTS STUDIO</span>
        <span className="photo-brand-subtitle">PHOTOGRAPHY &amp; FILMS</span>
      </header>

      <main className="photo-camera-stage">
        <button
          type="button"
          className="photo-camera-button"
          onClick={openForm}
          disabled={phase !== "camera"}
          aria-label="Click the camera to open the enquiry form"
        >
          <span className="photo-camera-aura" />

          <span className="photo-camera">
            <span className="photo-camera-viewfinder">
              <span />
            </span>

            <span className="photo-camera-branding">MOMENTS.</span>

            <span className="photo-camera-flash-unit">
              <span />
            </span>

            <span className="photo-camera-lens" ref={lensRef}>
              <span className="photo-lens-outer">
                <span className="photo-lens-aperture">
                  <span className="photo-lens-center" />
                </span>
              </span>
              <span className="photo-lens-reflection" />
            </span>

            <span className="photo-camera-led" />
            <span className="photo-camera-grip" />
          </span>

          <span className="photo-camera-shadow" />
        </button>

        {/* Always mounted so the camera never shifts position */}
        <div
          className={`photo-intro-copy${copyVisible ? "" : " is-hidden"}`}
          aria-hidden={!copyVisible}
        >
          <span className="photo-intro-eyebrow">PRESERVE WHAT MATTERS</span>

          <h1>
            Every Moment
            <br />
            <em>Deserves to Shine.</em>
          </h1>

          <p>Your story. Our lens. One timeless memory.</p>

          <div className="photo-click-hint">
            <span />
            CLICK THE CAMERA TO BEGIN
            <span />
          </div>

          <span className="photo-auto-hint">
            YOUR ENQUIRY OPENS AUTOMATICALLY
          </span>
        </div>
      </main>

      <div className="photo-shutter-flash" aria-hidden="true" />

      {showForm && (
        <div className="photo-form-layer">
          <button
            type="button"
            className="photo-form-backdrop"
            aria-label="Close enquiry form"
            onClick={closeExperience}
            tabIndex={phase === "closing" ? -1 : 0}
          />

          <section
            ref={formRef}
            className="photo-form-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-form-title"
            aria-hidden={phase === "closing"}
          >
            <header className="photo-form-header" data-reveal>
              <div className="photo-form-brand">
                <span className="photo-form-logo">✦</span>

                <div>
                  <strong>MOMENTS STUDIO</strong>
                  <small>PHOTOGRAPHY &amp; FILMS</small>
                </div>
              </div>

              <button
                type="button"
                className="photo-form-close"
                onClick={closeExperience}
                disabled={phase === "closing"}
                aria-label="Close form"
              >
                ×
              </button>
            </header>

            <div className="photo-form-content">
              <div className="photo-form-heading" data-reveal>
                <span className="photo-form-eyebrow">
                  <i />
                  QUICK ENQUIRY
                  <i />
                </span>

                <h2 id="photo-form-title">
                  Let's Capture
                  <br />
                  <em>Your Story.</em>
                </h2>

                <p>
                  Tell us about your special day. We'll take care of the
                  memories.
                </p>
              </div>

              <form className="photo-enquiry-form" onSubmit={handleSubmit}>
                <div className="photo-field" data-reveal>
                  <label htmlFor="photo-name">
                    Full Name <b>*</b>
                  </label>

                  <input
                    id="photo-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="photo-form-grid" data-reveal>
                  <div className="photo-field">
                    <label htmlFor="photo-phone">
                      Mobile Number <b>*</b>
                    </label>

                    <input
                      id="photo-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Your mobile number"
                      autoComplete="tel"
                      pattern="[+]?[0-9 ()-]{7,18}"
                      maxLength={18}
                      required
                    />
                  </div>

                  <div className="photo-field">
                    <label htmlFor="photo-email">
                      Email <small>OPTIONAL</small>
                    </label>

                    <input
                      id="photo-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      autoComplete="email"
                      maxLength={254}
                    />
                  </div>
                </div>

                <div className="photo-form-grid" data-reveal>
                  <div className="photo-field">
                    <label htmlFor="photo-service">
                      Photoshoot <b>*</b>
                    </label>

                    <select
                      id="photo-service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select service</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Birthday">Birthday &amp; Events</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Product">Product Photography</option>
                      <option value="Family">Family Photoshoot</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="photo-field">
                    <label htmlFor="photo-date">Preferred Date</label>

                    <input
                      id="photo-date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toLocaleDateString("en-CA")}
                    />
                  </div>
                </div>

                <div className="photo-field" data-reveal>
                  <label htmlFor="photo-message">
                    Your Vision <small>OPTIONAL</small>
                  </label>

                  <textarea
                    id="photo-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Event, location or special requests..."
                    rows={2}
                    maxLength={1000}
                  />
                </div>

                {error && (
                  <p className="photo-form-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="photo-submit-button"
                  type="submit"
                  disabled={loading || phase !== "form"}
                  data-reveal
                >
                  <span>{loading ? "Submitting..." : "Send Enquiry"}</span>
                  <span>↗</span>
                </button>

                <p className="photo-form-privacy" data-reveal>
                  ✦ Your details are used to respond to your enquiry.
                </p>
              </form>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}