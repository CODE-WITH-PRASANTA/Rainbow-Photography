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

// Import Images
import gallery1 from "../../assets/gallery4-1.webp";
import gallery2 from "../../assets/gallery4-2.webp";
import gallery3 from "../../assets/gallery4-3.webp";
import gallery4 from "../../assets/gallery4-4.webp";
import gallery5 from "../../assets/gallery4-5.webp";
import gallery6 from "../../assets/gallery4-6.webp";
import ctaFlower from "../../assets/cta-flowers.webp";

const GetInTouch = () => {
  const galleryImages = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
  ];

  return (
    <section className="git">
      {/* Background Text */}
      <h1 className="git-bg-text">CONTACT</h1>

      {/* Decorative Flowers */}
      <img src={ctaFlower} alt="" className="git-flower git-flower-left" />
      <img src={ctaFlower} alt="" className="git-flower git-flower-right" />

      <div className="git-container">
        {/* LEFT SIDE */}
        <div className="git-info">
          <h2>Contact Information</h2>

          <div className="git-info-item">
            <FiMail className="git-icon" />
            <p>username@domain.com</p>
          </div>

          <div className="git-info-item">
            <FiPhone className="git-icon" />
            <p>+ (123) 456 - 7890 - 456 - 7890</p>
          </div>

          <div className="git-info-item">
            <FiMapPin className="git-icon" />
            <p>Street New York</p>
          </div>

          <h3 className="git-connect-title">Get Connected</h3>

          <div className="git-social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaGooglePlusG /></a>
            <a href="#"><FaXTwitter /></a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="git-form">
          <h2>
            <span>Here’s</span> how to plan a wedding
          </h2>

          <div className="git-row">
            <input type="text" placeholder="Complete Name" />
            <input type="email" placeholder="Email Address" />
          </div>

          <textarea placeholder="Message"></textarea>

          <button className="git-btn">
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* AUTO SCROLL GALLERY */}
      <div className="git-gallery-wrapper">
        <div className="git-gallery">
          {[...galleryImages, ...galleryImages].map((img, i) => (
            <div className="git-gallery-item" key={i}>
              <img src={img} alt="" />
              <div className="git-overlay">
                <span>⤢</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;