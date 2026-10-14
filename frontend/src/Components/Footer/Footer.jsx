
import React from "react";
import "./Footer.css";

import logo from "../../assets/LOGO2-removebg-preview.png";
import bubbles from "../../assets/icon-bubbles.webp";
import leafLeft from "../../assets/icon-leaves-12.webp";
import leafRight from "../../assets/icon-leaves-13.webp";

import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaGoogle, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="premium-footer">
      {/* Background Decorative Images */}
      <img src={bubbles} alt="" className="footer-bubbles" />
      <img src={leafLeft} alt="" className="footer-leaf-left" />
      <img src={leafRight} alt="" className="footer-leaf-right" />

      <div className="footer-overlay"></div>

      <div className="footer-container">
        {/* LEFT SECTION */}
        <div className="footer-col footer-brand">
          <img src={logo} alt="Wendola" className="footer-logo" />

          <p>
            Semper libero, sit amet blandit vel, rhoncus ven enatis luctus
            pulvinar, hendrerit id, lorem. Semper libero, sit amet blandit vel.
          </p>
        </div>

        {/* CENTER SECTION */}
        <div className="footer-col footer-contact">
          <h3>Contact Information</h3>

          <div className="contact-item">
            <div className="icon-circle">
              <FiMail />
            </div>
            <span>username@domain.com</span>
          </div>

          <div className="contact-item">
            <div className="icon-circle">
              <FiPhone />
            </div>
            <span>+(123) 456 - 7890 - 456 - 7890</span>
          </div>

          <div className="contact-item">
            <div className="icon-circle">
              <FiMapPin />
            </div>
            <span>Street New York</span>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="footer-col footer-newsletter">
          <h3>Subscribe Newsletter</h3>
          <p>
            Receive fresh blog content and invites to our webinars.
          </p>

          <div className="newsletter-input">
            <input type="email" placeholder="Enter your email...." />
            <button>
              <FiMail />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>Copyright © Vendola kodesolution . All rights reserved.</p>

        <div className="social-icons">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaGoogle /></a>
          <a href="#"><FaXTwitter /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;