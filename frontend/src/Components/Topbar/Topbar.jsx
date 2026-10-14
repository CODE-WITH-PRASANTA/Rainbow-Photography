
import React from "react";
import { Link } from "react-router-dom";
import {
  LuInstagram,
  LuFacebook,
  LuPhoneCall,
  LuArrowUpRight,
  LuMail,
  LuClock,
} from "react-icons/lu";
import "./Topbar.css";

const Topbar = () => {
  return (
    <aside
      className="rainbow-topbar"
      aria-label="Announcement and quick contacts"
    >
      <div className="rainbow-topbar-container">
        {/* Left section */}
        <div className="topbar-left">
          <div className="topbar-badge">
            <span className="pulse-indicator" />
            <span className="topbar-headline">
              CAPTURING MOMENTS • CREATING MEMORIES
            </span>
          </div>

          <div className="topbar-schedule">
            <LuClock className="topbar-icon" aria-hidden="true" />
            <span>MON - SAT: 9:00 AM - 8:00 PM</span>
          </div>
        </div>

        {/* Right section */}
        <div className="topbar-right">
          <a
            href="mailto:info@rainbowphotography.com"
            className="topbar-info-link email-link"
          >
            <LuMail className="topbar-icon" aria-hidden="true" />
            <span>info@rainbowphotography.com</span>
          </a>

          {/* Social links */}
          <div className="topbar-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="Visit Instagram"
            >
              <LuInstagram />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="Visit Facebook"
            >
              <LuFacebook />
            </a>
          </div>

          <span className="topbar-separator" aria-hidden="true" />

          {/* Contact CTA */}
          <Link to="/contact" className="topbar-cta">
            <LuPhoneCall className="cta-phone" aria-hidden="true" />
            <span className="cta-label">LET'S TALK</span>
            <LuArrowUpRight className="cta-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Topbar;
