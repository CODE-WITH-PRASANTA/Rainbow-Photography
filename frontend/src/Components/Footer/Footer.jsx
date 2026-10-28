import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import logo from "../../assets/LOGO2-removebg-preview.png";
import bubbles from "../../assets/icon-bubbles.webp";
import leafLeft from "../../assets/icon-leaves-12.webp";
import leafRight from "../../assets/icon-leaves-13.webp";

import { FiMail, FiPhone, FiMapPin, FiChevronRight } from "react-icons/fi";
import { FaFacebookF, FaGoogle, FaInstagram, FaXTwitter } from "react-icons/fa6";

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

const socials = [
  { label: "Facebook", href: "#", icon: <FaFacebookF /> },
  { label: "Instagram", href: "#", icon: <FaInstagram /> },
  { label: "Google", href: "#", icon: <FaGoogle /> },
  { label: "X (Twitter)", href: "#", icon: <FaXTwitter /> },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to your API / email service here
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="premium-footer">
      {/* Decorative background */}
      <img src={bubbles} alt="" aria-hidden="true" className="footer-bubbles" />
      <img src={leafLeft} alt="" aria-hidden="true" className="footer-leaf-left" />
      <img src={leafRight} alt="" aria-hidden="true" className="footer-leaf-right" />
      <div className="footer-overlay"></div>

      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-col footer-brand">
          <Link to="/" onClick={scrollTop} aria-label="Rainbow Photography home">
            <img src={logo} alt="Rainbow Photography" className="footer-logo" />
          </Link>
          <p>
            Capturing weddings, portraits and life's finest moments with a
            cinematic eye. Every frame is crafted to be treasured for a lifetime.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col footer-links">
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
        </div>

        {/* CONTACT */}
        <div className="footer-col footer-contact">
          <h3>Contact Information</h3>

          <a className="contact-item" href="mailto:Rrainbowphotography@gmail.com">
            <span className="icon-circle"><FiMail /></span>
            <span className="contact-text">Rrainbowphotography@gmail.com</span>
          </a>

          <a className="contact-item" href="tel:+917375971966">
            <span className="icon-circle"><FiPhone /></span>
            <span className="contact-text">+91 7375971966</span>
          </a>

          <a
            className="contact-item"
            href="https://www.google.com/maps/search/?api=1&query=Charampa+Bhadrak+Odisha+756101"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon-circle"><FiMapPin /></span>
            <span className="contact-text">Charampa, Bhadrak, Odisha - 756101</span>
          </a>
        </div>

        {/* NEWSLETTER */}
        <div className="footer-col footer-newsletter">
          <h3>Subscribe Newsletter</h3>
          <p>Receive fresh blog content and invites to our webinars.</p>

          <form className="newsletter-input" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email..."
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">
              <FiMail />
            </button>
          </form>

          {subscribed && (
            <p className="newsletter-success" role="status">
              Thank you for subscribing!
            </p>
          )}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p className="copyright">
          Copyright © 2026 . All rights reserved.
        </p>

        <p className="developed-by">
          Developed by{" "}
          <a href="https://prwebstock.com/" target="_blank" rel="noopener noreferrer">
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
    </footer>
  );
};

export default Footer;