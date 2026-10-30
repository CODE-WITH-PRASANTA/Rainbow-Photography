import React, { useState } from "react";
import "./GetInMail.css";

/* ---------- Icons ---------- */
const Svg = ({ children, size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const PhoneIcon = () => (
  <Svg>
    <path d="M22 16.92V20a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4 2h3.09a1 1 0 0 1 1 .75c.12.62.31 1.22.57 1.81a1 1 0 0 1-.23 1.09L7.21 7.79a16 16 0 0 0 9 9l2.14-1.24a1 1 0 0 1 1.09-.23c.59.26 1.19.45 1.81.57a1 1 0 0 1 .75 1.03z" />
  </Svg>
);
const MailIcon = () => (
  <Svg>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </Svg>
);
const PinIcon = () => (
  <Svg>
    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z" />
    <circle cx="12" cy="9" r="2.6" />
  </Svg>
);
const ClockIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
const CameraIcon = () => (
  <Svg size={24}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </Svg>
);
const HeartIcon = () => (
  <Svg size={22}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);
const SendIcon = () => (
  <Svg size={18}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);
const CheckIcon = () => (
  <Svg size={38}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5a9.43 9.43 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.45 9.45 0 1 1 7.98 4.41zm0-20.73a11.2 11.2 0 0 0-9.6 16.9L1 23l5.47-1.43a11.2 11.2 0 1 0 5.57-20.8z" />
  </svg>
);

/* ---------- Config ---------- */
const WHATSAPP_NUMBER = "917375971966";
const EMAIL = "Rrainbowphotography@gmail.com";
const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Charampa,Bhadrak,Odisha+756101";

/* Optional: paste your Formspree / backend URL here to really receive the
   enquiries, e.g. "https://formspree.io/f/xxxxxxx". Leave "" to only show
   the success message. */
const FORM_ENDPOINT = "";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  eventType: "Wedding",
  message: "",
};

const GetInMail = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Request failed");
      }
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="rp-contact" id="contact">
      <span className="rp-blob rp-blob-1" />
      <span className="rp-blob rp-blob-2" />

      <div className="rp-wrap">
        {/* ---------- Heading ---------- */}
        <header className="rp-head">
          <span className="rp-eyebrow">RAINBOW PHOTOGRAPHY</span>
          <div className="rp-divider">
            <i />
            <CameraIcon />
            <i />
          </div>
          <h2 className="rp-title">
            Let’s Create <span>Timeless Memories</span>
          </h2>
          <p className="rp-lead">
            Every love story deserves to be remembered beautifully. Tell us about
            your wedding, pre-wedding, engagement or special events.
          </p>
        </header>

        {/* ---------- Main grid ---------- */}
        <div className="rp-grid">
          {/* LEFT : info panel */}
          <aside className="rp-info">
            <div className="rp-info-glow" />
            <h3 className="rp-info-title">Contact Information</h3>
            <p className="rp-info-sub">
              12+ years of heirloom-quality storytelling. 500+ happy couples.
              One call away from your perfect day.
            </p>

            <a className="rp-item" href="tel:+917375971966">
              <span className="rp-ico"><PhoneIcon /></span>
              <span className="rp-txt">
                <small>Call Us</small>
                <b>+91 73759 71966</b>
              </span>
            </a>

            <a className="rp-item" href={`mailto:${EMAIL}`}>
              <span className="rp-ico"><MailIcon /></span>
              <span className="rp-txt">
                <small>Write To Us</small>
                <b>{EMAIL}</b>
              </span>
            </a>

            <a className="rp-item" href={MAP_LINK} target="_blank" rel="noreferrer">
              <span className="rp-ico"><PinIcon /></span>
              <span className="rp-txt">
                <small>Visit Studio</small>
                <b>Charampa, Bhadrak, Odisha – 756101</b>
              </span>
            </a>

            <div className="rp-item rp-item-static">
              <span className="rp-ico"><ClockIcon /></span>
              <span className="rp-txt">
                <small>Working Hours</small>
                <b>Mon – Sun : 9:00 AM – 8:00 PM</b>
              </span>
            </div>

            <div className="rp-stats">
              <div><strong>500+</strong><span>Weddings</span></div>
              <div><strong>12+</strong><span>Years</span></div>
              <div><strong>100%</strong><span>Love</span></div>
            </div>

            <a
              className="rp-wa"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
          </aside>

          {/* RIGHT : form */}
          <div className="rp-formcard">
            {status === "success" ? (
              <div className="rp-success">
                <span className="rp-success-ico">
                  <CheckIcon />
                </span>
                <h3>Submitted Successfully!</h3>
                <p>
                  Thank you for reaching out to Rainbow Photography. Our team
                  will contact you very soon to plan your special day.
                </p>
                <button
                  type="button"
                  className="rp-btn rp-btn-ghost"
                  onClick={() => setStatus("idle")}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="rp-formhead">
                  <span className="rp-heart"><HeartIcon /></span>
                  <div>
                    <h3>Send Us A Message</h3>
                    <p>We usually reply within a few hours.</p>
                  </div>
                </div>

                <form className="rp-form" onSubmit={handleSubmit}>
                  <div className="rp-row">
                    <label className="rp-field">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder=" "
                        required
                      />
                      <span>Your Name</span>
                    </label>
                    <label className="rp-field">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder=" "
                        required
                      />
                      <span>Email Address</span>
                    </label>
                  </div>

                  <div className="rp-row">
                    <label className="rp-field">
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder=" "
                        required
                      />
                      <span>Phone Number</span>
                    </label>
                    <label className="rp-field rp-select">
                      <select
                        name="eventType"
                        value={form.eventType}
                        onChange={handleChange}
                      >
                        <option>Wedding</option>
                        <option>Pre-Wedding</option>
                        <option>Engagement</option>
                        <option>Cinematic Film</option>
                        <option>Birthday / Party</option>
                        <option>Other</option>
                      </select>
                      <span>Event Type</span>
                    </label>
                  </div>

                  <label className="rp-field rp-area">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <span>Tell us about your special day…</span>
                  </label>

                  <div className="rp-actions">
                    <button
                      type="submit"
                      className="rp-btn rp-btn-primary"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? "Sending…" : "Send Enquiry"}
                      <SendIcon />
                    </button>
                    <button
                      type="button"
                      className="rp-btn rp-btn-ghost"
                      onClick={() => {
                        setForm(initialForm);
                        setStatus("idle");
                      }}
                    >
                      Reset
                    </button>
                  </div>

                  {status === "error" && (
                    <p className="rp-error">
                      Something went wrong. Please try again or call us directly.
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInMail;