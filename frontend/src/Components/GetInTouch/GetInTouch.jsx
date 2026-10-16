
// GetInTouch.jsx

import React, { useEffect, useState } from "react";
import "./GetInTouch.css";

import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

import {
  FaFacebookF,
  FaGooglePlusG,
  FaXTwitter,
} from "react-icons/fa6";

import API, { IMG_URL } from "../../api/axios";

// Decorative image
import ctaFlower from "../../assets/cta-flowers.webp";

const GetInTouch = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // NORMALIZE IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    // Support objects returned by the API
    const imagePath =
      typeof image === "string"
        ? image
        : image.url || image.image || image.imageUrl || image.path || "";

    if (!imagePath) return "";

    // Already an absolute or browser-generated URL
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:") ||
      imagePath.startsWith("blob:")
    ) {
      return imagePath;
    }

    const baseUrl = (IMG_URL || "").replace(/\/+$/, "");
    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;

    return `${baseUrl}${normalizedPath}`;
  };

  // =====================================================
  // FETCH GALLERY FROM BACKEND
  // =====================================================

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/gallery");

      // Support common API response structures
      const responseData = response.data;

      const images = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData?.gallery)
        ? responseData.gallery
        : Array.isArray(responseData?.images)
        ? responseData.images
        : [];

      const formattedImages = images
        .map((item, index) => ({
          id: item._id || item.id || `gallery-${index}`,
          title: item.title || item.name || "Wedding Photography",
          image: getImageUrl(
            item.image || item.imageUrl || item.url || item.path
          ),
        }))
        .filter((item) => item.image);

      setGalleryImages(formattedImages);
    } catch (err) {
      console.error(
        "Failed to fetch gallery images:",
        err.response?.data || err.message
      );

      setError("Unable to load gallery images. Please try again.");
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // =====================================================
  // GALLERY IMAGES FOR INFINITE SCROLL
  // =====================================================

  const scrollingImages =
    galleryImages.length > 0
      ? [...galleryImages, ...galleryImages]
      : [];

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
            <p>+ 91 7375971966</p>
          </div>

          <div className="git-info-item">
            <FiMapPin className="git-icon" />
            <p>Charampa, bhadrak, odisha -756101</p>
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

          <button type="button" className="git-btn">
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* =========================================
          AUTO-SCROLL BACKEND GALLERY
      ========================================= */}

      <div className="git-gallery-wrapper">
        {loading ? (
          <div className="git-gallery-status">
            <span className="git-gallery-spinner" />
            <p>Loading gallery...</p>
          </div>
        ) : error ? (
          <div className="git-gallery-status">
            <p>{error}</p>

            <button
              type="button"
              className="git-gallery-retry"
              onClick={fetchGalleryImages}
            >
              <FiRefreshCw />
              Try Again
            </button>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="git-gallery-status">
            <p>No gallery images available.</p>
          </div>
        ) : (
          <div className="git-gallery">
            {scrollingImages.map((item, index) => (
              <div
                className="git-gallery-item"
                key={`${item.id}-${index}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />

                <div className="git-overlay">
                  <span aria-hidden="true">⤢</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GetInTouch;
