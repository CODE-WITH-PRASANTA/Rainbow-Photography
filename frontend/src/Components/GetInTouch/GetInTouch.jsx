// GetInTouch.jsx

import React from "react";
import "./GetInTouch.css";

import {
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

import {
  FaFacebookF,
  FaGooglePlusG,
  FaXTwitter,
} from "react-icons/fa6";

// Decorative image
import ctaFlower from "../../assets/cta-flowers.webp";

const GetInTouch = () => {
  return (
    <section className="git">
      {/* Background Text */}
      <h1 className="git-bg-text">CONTACT</h1>

      {/* Decorative Flowers */}
      <img
        src={ctaFlower}
        alt=""
        className="git-flower git-flower-left"
        aria-hidden="true"
      />

      <img
        src={ctaFlower}
        alt=""
        className="git-flower git-flower-right"
        aria-hidden="true"
      />

      <div className="git-container">
        {/* =========================================
            LEFT SIDE: CONTACT INFORMATION
        ========================================= */}

        <div className="git-info">
          <h2>Contact Information</h2>

          <div className="git-info-item">
            <FiMail className="git-icon" />
            <p>Rrainbowphotography@gmail.com</p>
          </div>

          <div className="git-info-item">
            <FiPhone className="git-icon" />
            <p>+91 7375971966</p>
          </div>

          <div className="git-info-item">
            <FiMapPin className="git-icon" />
            <p>Charampa, Bhadrak, Odisha - 756101</p>
          </div>

          <h3 className="git-connect-title">Get Connected</h3>

          <div className="git-social">
            <a
              href="#"
              aria-label="Facebook"
              onClick={(event) => event.preventDefault()}
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Google Plus"
              onClick={(event) => event.preventDefault()}
            >
              <FaGooglePlusG />
            </a>

            <a
              href="#"
              aria-label="X"
              onClick={(event) => event.preventDefault()}
            >
              <FaXTwitter />
            </a>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE: CONTACT FORM
        ========================================= */}

        <div className="git-form">
          <h2>
            <span>Here’s</span> how to plan a wedding
          </h2>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="git-row">
              <input
                type="text"
                name="name"
                placeholder="Complete Name"
                aria-label="Complete Name"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                aria-label="Email Address"
              />
            </div>

            <textarea
              name="message"
              placeholder="Message"
              aria-label="Message"
            />

            <button type="submit" className="git-btn">
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;