import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import logo from "../../assets/LOGO2-removebg-preview.png";
import bubbles from "../../assets/icon-bubbles.webp";
import leafLeft from "../../assets/icon-leaves-12.webp";
import leafRight from "../../assets/icon-leaves-13.webp";

import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronRight,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiCamera,
} from "react-icons/fi";
import { FaFacebookF, FaGoogle, FaInstagram, FaXTwitter } from "react-icons/fa6";

/* ---------- EDIT YOUR DETAILS HERE ---------- */
const EMAIL = "Rrainbowphotography@gmail.com";
const PHONE_DISPLAY = "+91 7375971966";
const PHONE_LINK = "+917375971966";
const ADDRESS = "Charampa, Bhadrak, Odisha - 756101";
const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Charampa+Bhadrak+Odisha+756101";

/* Change the `to` paths if your routes are named differently */
const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Show Case", to: "/showcase" },
  { label: "Pricing", to: "/pricing" },
  { label: "Service", to: "/service" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

/* Replace each href with your real profile URL */
const socials = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/", icon: <FaInstagram /> },
  { label: "Google", href: "https://www.google.com/", icon: <FaGoogle /> },
  { label: "X (Twitter)", href: "https://x.com/", icon: <FaXTwitter /> },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const value = email.trim();

    if (!EMAIL_REGEX.test(value)) {
      setStatus("error");
      setMessage("Enter a valid email address, like name@example.com.");
      return;
    }

    try {
      setStatus("loading");
      // TODO: connect to your API / email service here, e.g.
      // await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email: value }) });
      await new Promise((resolve) => setTimeout(resolve, 600));

      setStatus("success");
      setMessage("Subscribed. Check your inbox for a welcome note.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage("Could not subscribe right now. Please try again.");
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <footer className="premium-footer">
      {/* Decorative background */}
      <img src={bubbles} alt="" aria-hidden="true" className="footer-bubbles" />
      <img src={leafLeft} alt="" aria-hidden="true" className="footer-leaf-left" />
      <img src={leafRight} alt="" aria-hidden="true" className="footer-leaf-right" />
      <div className="footer-overlay" />

      {/* GOLD ORNAMENT — aperture badge on a glowing line */}
      <div className="footer-ornament" aria-hidden="true">
        <span className="orn-line orn-left" />
        <span className="orn-badge">
          <FiCamera />
        </span>
        <span className="orn-line orn-right" />
      </div>

      {/* MAIN GRID */}
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-col footer-brand">
          <Link to="/" onClick={scrollTop} aria-label="Rainbow Photography home">
            <img src={logo} alt="Rainbow Photography" className="footer-logo" />
          </Link>
          <p>
            Capturing weddings, portraits and life's finest moments with a
            cinematic eye. Every frame is crafted to be treasured for a
            lifetime.
          </p>
        </div>

        {/* QUICK LINKS */}
        <nav className="footer-col footer-links" aria-label="Footer">
          <h3>Quick Links</h3>
          <ul>
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} onClick={scrollTop}>
                  <FiChevronRight className="link-arrow" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CONTACT */}
        <div className="footer-col footer-contact">
          <h3>Contact Information</h3>

          <a className="contact-item" href={`mailto:${EMAIL}`}>
            <span className="icon-circle">
              <FiMail />
            </span>
            <span className="contact-text contact-email">{EMAIL}</span>
          </a>

          <a className="contact-item" href={`tel:${PHONE_LINK}`}>
            <span className="icon-circle">
              <FiPhone />
            </span>
            <span className="contact-text">{PHONE_DISPLAY}</span>
          </a>

          <a
            className="contact-item"
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon-circle">
              <FiMapPin />
            </span>
            <span className="contact-text">{ADDRESS}</span>
          </a>
        </div>

        {/* NEWSLETTER */}
        <div className="footer-col footer-newsletter">
          <h3>Subscribe Newsletter</h3>
          <p>Get new portfolio stories, offers and shoot ideas in your inbox.</p>

          <form className="newsletter-input" onSubmit={handleSubscribe} noValidate>
            <input
              type="email"
              placeholder="Enter your email..."
              aria-label="Email address"
              aria-invalid={status === "error"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              autoComplete="email"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              disabled={status === "loading"}
              className={status === "loading" ? "is-loading" : ""}
            >
              <FiSend />
            </button>
          </form>

          <p className={`newsletter-msg ${status}`} role="status" aria-live="polite">
            {status === "success" && <FiCheckCircle />}
            {status === "error" && <FiAlertCircle />}
            {message}
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="copyright">
            Copyright © {new Date().getFullYear()} Rainbow Photography. All
            rights reserved.
          </p>

          <p className="developed-by">
            Developed by{" "}
            <a
              href="https://prwebstock.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PR WEBSTOCK
            </a>
          </p>

          <div className="social-icons">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;